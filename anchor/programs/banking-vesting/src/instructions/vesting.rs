use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(beneficiary: Pubkey)]
pub struct CreateVestingSchedule<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [COMPANY_SEED, company.authority.as_ref(), &company.name],
        bump = company.bump,
        constraint = company.authority == authority.key() @ BankingVestingError::Unauthorized
    )]
    pub company: Account<'info, Company>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<VestingSchedule>(),
        seeds = [VESTING_SEED, company.key().as_ref(), beneficiary.key().as_ref()],
        bump
    )]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = company
    )]
    pub company_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = beneficiary
    )]
    pub beneficiary_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Beneficiary address
    pub beneficiary: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimVestedTokens<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        seeds = [COMPANY_SEED, company.authority.as_ref(), &company.name],
        bump = company.bump
    )]
    pub company: Account<'info, Company>,
    
    #[account(
        mut,
        seeds = [VESTING_SEED, company.key().as_ref(), beneficiary.key().as_ref()],
        bump = vesting_schedule.bump,
        constraint = vesting_schedule.beneficiary == beneficiary.key() @ BankingVestingError::Unauthorized,
        constraint = !vesting_schedule.is_revoked @ BankingVestingError::Unauthorized
    )]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = company
    )]
    pub company_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = beneficiary
    )]
    pub beneficiary_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub beneficiary: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn create_vesting_schedule(
    ctx: Context<CreateVestingSchedule>,
    beneficiary: Pubkey,
    total_amount: u64,
    start_time: i64,
    cliff_duration: i64,
    vesting_duration: i64,
    vesting_type: VestingType,
) -> Result<()> {
    validate_vesting_parameters(start_time, cliff_duration, vesting_duration)?;
    
    require!(
        total_amount > 0,
        BankingVestingError::InvalidAmount
    );
    
    require!(
        ctx.accounts.company_token_account.amount >= total_amount,
        BankingVestingError::InsufficientBalance
    );
    
    let vesting_schedule = &mut ctx.accounts.vesting_schedule;
    let company = &mut ctx.accounts.company;
    let platform = &mut ctx.accounts.platform;
    let clock = Clock::get()?;
    
    vesting_schedule.company = company.key();
    vesting_schedule.beneficiary = beneficiary;
    vesting_schedule.mint = ctx.accounts.mint.key();
    vesting_schedule.total_amount = total_amount;
    vesting_schedule.claimed_amount = 0;
    vesting_schedule.start_time = start_time;
    vesting_schedule.cliff_duration = cliff_duration;
    vesting_schedule.vesting_duration = vesting_duration;
    vesting_schedule.vesting_type = vesting_type;
    vesting_schedule.is_revoked = false;
    vesting_schedule.created_at = clock.unix_timestamp;
    vesting_schedule.last_claimed = 0;
    vesting_schedule.bump = ctx.bumps.vesting_schedule;
    
    company.allocated_supply = company.allocated_supply
        .checked_add(total_amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    company.vesting_schedules_count = company.vesting_schedules_count
        .checked_add(1)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    platform.total_vesting_schedules = platform.total_vesting_schedules
        .checked_add(1)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    let vesting_type_str = match vesting_type {
        VestingType::Linear => "Linear",
        VestingType::Cliff => "Cliff",
        VestingType::Milestone => "Milestone",
        VestingType::Performance => "Performance",
        VestingType::Hybrid => "Hybrid",
    };
    
    emit!(VestingScheduleCreated {
        schedule: vesting_schedule.key(),
        company: company.key(),
        beneficiary,
        total_amount,
        vesting_type: vesting_type_str.to_string(),
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn claim_vested_tokens(ctx: Context<ClaimVestedTokens>) -> Result<()> {
    let vesting_schedule = &mut ctx.accounts.vesting_schedule;
    let clock = Clock::get()?;
    
    require!(
        clock.unix_timestamp >= vesting_schedule.start_time,
        BankingVestingError::VestingNotStarted
    );
    
    let vested_amount = calculate_vested_amount(
        vesting_schedule.total_amount,
        vesting_schedule.start_time,
        vesting_schedule.cliff_duration,
        vesting_schedule.vesting_duration,
        clock.unix_timestamp,
    )?;
    
    let claimable_amount = vested_amount
        .checked_sub(vesting_schedule.claimed_amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    require!(
        claimable_amount > 0,
        BankingVestingError::NoTokensAvailable
    );
    
    let company_authority = ctx.accounts.company.authority;
    let company_name = &ctx.accounts.company.name;
    let seeds = &[
        COMPANY_SEED,
        company_authority.as_ref(),
        company_name,
        &[ctx.accounts.company.bump],
    ];
    let signer_seeds = &[&seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.company_token_account.to_account_info(),
            to: ctx.accounts.beneficiary_token_account.to_account_info(),
            authority: ctx.accounts.company.to_account_info(),
        },
        signer_seeds,
    );
    
    transfer(transfer_ctx, claimable_amount)?;
    
    vesting_schedule.claimed_amount = vesting_schedule.claimed_amount
        .checked_add(claimable_amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    vesting_schedule.last_claimed = clock.unix_timestamp;
    
    emit!(TokensClaimed {
        schedule: vesting_schedule.key(),
        beneficiary: ctx.accounts.beneficiary.key(),
        amount: claimable_amount,
        total_claimed: vesting_schedule.claimed_amount,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
