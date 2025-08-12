use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;
use crate::utils::*;

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<StakingPool>(),
        seeds = [STAKING_SEED, mint.key().as_ref()],
        bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
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
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = staking_pool
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [STAKING_SEED, mint.key().as_ref()],
        bump = staking_pool.bump,
        constraint = staking_pool.is_active @ BankingVestingError::StakingPoolInactive
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
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
        associated_token::authority = staking_pool
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
    require!(amount >= MIN_STAKE_AMOUNT, BankingVestingError::InvalidAmount);
    
    require!(
        ctx.accounts.user_token_account.amount >= amount,
        BankingVestingError::InsufficientBalance
    );
    
    let staking_pool = &mut ctx.accounts.staking_pool;
    let banking_account = &mut ctx.accounts.banking_account;
    let clock = Clock::get()?;
    
    // Initialize staking pool if needed
    if staking_pool.authority == Pubkey::default() {
        staking_pool.authority = ctx.accounts.platform.admin;
        staking_pool.mint = ctx.accounts.mint.key();
        staking_pool.total_staked = 0;
        staking_pool.total_rewards = 0;
        staking_pool.apy_rate = 500; // 5% default APY
        staking_pool.lock_duration = 30 * SECONDS_PER_DAY; // 30 days
        staking_pool.is_active = true;
        staking_pool.bump = ctx.bumps.staking_pool;
    }
    
    require!(staking_pool.is_active, BankingVestingError::StakingPoolInactive);
    
    // Transfer tokens to staking pool
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    
    transfer(transfer_ctx, amount)?;
    
    // Update accounts
    banking_account.staked_amount = banking_account.staked_amount
        .checked_add(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    banking_account.last_interaction = clock.unix_timestamp;
    
    staking_pool.total_staked = staking_pool.total_staked
        .checked_add(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    emit!(TokensStaked {
        pool: staking_pool.key(),
        user: ctx.accounts.user.key(),
        amount,
        total_staked: staking_pool.total_staked,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
    require!(amount > 0, BankingVestingError::InvalidAmount);
    
    let banking_account = &mut ctx.accounts.banking_account;
    let staking_pool = &mut ctx.accounts.staking_pool;
    let clock = Clock::get()?;
    
    require!(
        banking_account.staked_amount >= amount,
        BankingVestingError::InsufficientBalance
    );
    
    // Calculate rewards
    let rewards = calculate_staking_rewards(
        amount,
        staking_pool.apy_rate,
        clock.unix_timestamp - banking_account.last_interaction,
    )?;
    
    let total_withdrawal = amount + rewards;
    
    // Check if pool has enough tokens
    require!(
        ctx.accounts.pool_token_account.amount >= total_withdrawal,
        BankingVestingError::InsufficientBalance
    );
    
    // Transfer tokens back to user
    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        STAKING_SEED,
        mint_key.as_ref(),
        &[staking_pool.bump],
    ];
    let signer_seeds = &[&seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: staking_pool.to_account_info(),
        },
        signer_seeds,
    );
    
    transfer(transfer_ctx, total_withdrawal)?;
    
    // Update accounts
    banking_account.staked_amount = banking_account.staked_amount
        .checked_sub(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    banking_account.earned_interest = banking_account.earned_interest
        .checked_add(rewards)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    banking_account.last_interaction = clock.unix_timestamp;
    
    staking_pool.total_staked = staking_pool.total_staked
        .checked_sub(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    staking_pool.total_rewards = staking_pool.total_rewards
        .checked_add(rewards)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    emit!(TokensUnstaked {
        pool: staking_pool.key(),
        user: ctx.accounts.user.key(),
        amount,
        rewards,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
