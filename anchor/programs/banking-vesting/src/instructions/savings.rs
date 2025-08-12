use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;
use crate::utils::*;

#[derive(Accounts)]
pub struct CreateSavingsAccount<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<SavingsAccount>(),
        seeds = [SAVINGS_SEED, owner.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub savings_account: Account<'info, SavingsAccount>,
    
    #[account(
        mut,
        seeds = [BANKING_SEED, owner.key().as_ref()],
        bump = banking_account.bump,
        constraint = banking_account.owner == owner.key() @ BankingVestingError::Unauthorized
    )]
    pub banking_account: Account<'info, BankingAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = savings_account
    )]
    pub savings_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompoundInterest<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [SAVINGS_SEED, savings_account.owner.as_ref(), mint.key().as_ref()],
        bump = savings_account.bump,
        constraint = !savings_account.is_locked @ BankingVestingError::SavingsAccountLocked
    )]
    pub savings_account: Account<'info, SavingsAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = savings_account
    )]
    pub savings_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn create_savings_account(ctx: Context<CreateSavingsAccount>, apy_rate: u16) -> Result<()> {
    validate_apy_rate(apy_rate)?;
    
    let savings_account = &mut ctx.accounts.savings_account;
    let banking_account = &mut ctx.accounts.banking_account;
    let clock = Clock::get()?;
    
    // Require minimum deposit
    require!(
        ctx.accounts.owner_token_account.amount >= MIN_SAVINGS_DEPOSIT,
        BankingVestingError::InvalidAmount
    );
    
    // Initialize savings account
    savings_account.owner = ctx.accounts.owner.key();
    savings_account.mint = ctx.accounts.mint.key();
    savings_account.balance = 0;
    savings_account.apy_rate = apy_rate;
    savings_account.compound_frequency = 12; // Monthly compounding
    savings_account.last_compound = clock.unix_timestamp;
    savings_account.total_earned = 0;
    savings_account.is_locked = false;
    savings_account.unlock_time = 0;
    savings_account.bump = ctx.bumps.savings_account;
    
    // Update banking account savings count
    banking_account.last_interaction = clock.unix_timestamp;
    
    emit!(SavingsAccountCreated {
        account: savings_account.key(),
        owner: ctx.accounts.owner.key(),
        apy_rate,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn compound_interest(ctx: Context<CompoundInterest>) -> Result<()> {
    let savings_account = &mut ctx.accounts.savings_account;
    let clock = Clock::get()?;
    
    // Check if enough time has passed for compounding
    let time_since_last_compound = clock.unix_timestamp - savings_account.last_compound;
    let compound_interval = SECONDS_PER_YEAR / savings_account.compound_frequency as i64;
    
    require!(
        time_since_last_compound >= compound_interval,
        BankingVestingError::CompoundFrequencyNotMet
    );
    
    if savings_account.balance > 0 {
        // Calculate compound interest
        let interest_earned = calculate_compound_interest(
            savings_account.balance,
            savings_account.apy_rate,
            time_since_last_compound,
            savings_account.compound_frequency,
        )?;
        
        if interest_earned > 0 {
            savings_account.balance = savings_account.balance
                .checked_add(interest_earned)
                .ok_or(BankingVestingError::ArithmeticOverflow)?;
            
            savings_account.total_earned = savings_account.total_earned
                .checked_add(interest_earned)
                .ok_or(BankingVestingError::ArithmeticOverflow)?;
            
            emit!(InterestCompounded {
                account: savings_account.key(),
                owner: savings_account.owner,
                interest_earned,
                new_balance: savings_account.balance,
                timestamp: clock.unix_timestamp,
            });
        }
    }
    
    savings_account.last_compound = clock.unix_timestamp;
    
    Ok(())
}

pub fn deposit_to_savings(ctx: Context<DepositToSavings>, amount: u64) -> Result<()> {
    require!(amount >= MIN_SAVINGS_DEPOSIT, BankingVestingError::InvalidAmount);
    
    require!(
        ctx.accounts.owner_token_account.amount >= amount,
        BankingVestingError::InsufficientBalance
    );
    
    let savings_account = &mut ctx.accounts.savings_account;
    
    require!(
        !savings_account.is_locked,
        BankingVestingError::SavingsAccountLocked
    );
    
    // Transfer tokens to savings account
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.savings_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    );
    
    transfer(transfer_ctx, amount)?;
    
    savings_account.balance = savings_account.balance
        .checked_add(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(())
}

pub fn withdraw_from_savings(ctx: Context<WithdrawFromSavings>, amount: u64) -> Result<()> {
    require!(amount > 0, BankingVestingError::InvalidAmount);
    
    let savings_account = &mut ctx.accounts.savings_account;
    let clock = Clock::get()?;
    
    require!(
        !savings_account.is_locked || clock.unix_timestamp >= savings_account.unlock_time,
        BankingVestingError::SavingsAccountLocked
    );
    
    require!(
        savings_account.balance >= amount,
        BankingVestingError::InsufficientBalance
    );
    
    // Transfer tokens from savings account
    let owner_key = savings_account.owner;
    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        SAVINGS_SEED,
        owner_key.as_ref(),
        mint_key.as_ref(),
        &[savings_account.bump],
    ];
    let signer_seeds = &[&seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.savings_token_account.to_account_info(),
            to: ctx.accounts.owner_token_account.to_account_info(),
            authority: savings_account.to_account_info(),
        },
        signer_seeds,
    );
    
    transfer(transfer_ctx, amount)?;
    
    savings_account.balance = savings_account.balance
        .checked_sub(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(())
}

#[derive(Accounts)]
pub struct DepositToSavings<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [SAVINGS_SEED, owner.key().as_ref(), mint.key().as_ref()],
        bump = savings_account.bump,
        constraint = savings_account.owner == owner.key() @ BankingVestingError::Unauthorized
    )]
    pub savings_account: Account<'info, SavingsAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = savings_account
    )]
    pub savings_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawFromSavings<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [SAVINGS_SEED, owner.key().as_ref(), mint.key().as_ref()],
        bump = savings_account.bump,
        constraint = savings_account.owner == owner.key() @ BankingVestingError::Unauthorized
    )]
    pub savings_account: Account<'info, SavingsAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = savings_account
    )]
    pub savings_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}
