use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;
use crate::utils::*;

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<BankingAccount>(),
        seeds = [BANKING_SEED, user.key().as_ref()],
        bump
    )]
    pub banking_account: Account<'info, BankingAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = banking_account
    )]
    pub platform_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [BANKING_SEED, user.key().as_ref()],
        bump = banking_account.bump,
        constraint = banking_account.owner == user.key() @ BankingVestingError::Unauthorized
    )]
    pub banking_account: Account<'info, BankingAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = banking_account
    )]
    pub platform_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn deposit_funds(ctx: Context<DepositFunds>, amount: u64) -> Result<()> {
    require!(amount > 0, BankingVestingError::InvalidAmount);
    
    require!(
        ctx.accounts.user_token_account.amount >= amount,
        BankingVestingError::InsufficientBalance
    );
    
    let banking_account = &mut ctx.accounts.banking_account;
    let clock = Clock::get()?;
    
    if banking_account.owner == Pubkey::default() {
        banking_account.owner = ctx.accounts.user.key();
        banking_account.balance = 0;
        banking_account.staked_amount = 0;
        banking_account.earned_interest = 0;
        banking_account.last_interaction = clock.unix_timestamp;
        banking_account.account_type = AccountType::Basic;
        banking_account.tier_level = 1;
        banking_account.bump = ctx.bumps.banking_account;
    }
    
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.platform_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    
    transfer(transfer_ctx, amount)?;
    
    banking_account.balance = banking_account.balance
        .checked_add(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    banking_account.last_interaction = clock.unix_timestamp;
    
    emit!(FundsDeposited {
        account: banking_account.key(),
        user: ctx.accounts.user.key(),
        amount,
        new_balance: banking_account.balance,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
    require!(amount > 0, BankingVestingError::InvalidAmount);
    
    let banking_account = &mut ctx.accounts.banking_account;
    
    require!(
        banking_account.balance >= amount,
        BankingVestingError::InsufficientBalance
    );
    
    let banking_account_key = banking_account.key();
    let user_key = ctx.accounts.user.key();
    let seeds = &[
        BANKING_SEED,
        user_key.as_ref(),
        &[banking_account.bump],
    ];
    let signer_seeds = &[&seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.platform_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: banking_account.to_account_info(),
        },
        signer_seeds,
    );
    
    transfer(transfer_ctx, amount)?;
    
    banking_account.balance = banking_account.balance
        .checked_sub(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    let clock = Clock::get()?;
    banking_account.last_interaction = clock.unix_timestamp;
    
    emit!(FundsWithdrawn {
        account: banking_account_key,
        user: user_key,
        amount,
        new_balance: banking_account.balance,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
