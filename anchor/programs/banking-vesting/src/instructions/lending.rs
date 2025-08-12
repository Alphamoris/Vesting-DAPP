use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;
use crate::utils::*;

#[derive(Accounts)]
pub struct CreateLoanRequest<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        init,
        payer = borrower,
        space = 8 + std::mem::size_of::<LoanRequest>(),
        seeds = [LOAN_SEED, borrower.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub loan_request: Account<'info, LoanRequest>,
    
    #[account(
        mut,
        seeds = [BANKING_SEED, borrower.key().as_ref()],
        bump = banking_account.bump,
        constraint = banking_account.owner == borrower.key() @ BankingVestingError::Unauthorized
    )]
    pub banking_account: Account<'info, BankingAccount>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = borrower
    )]
    pub borrower_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = borrower,
        associated_token::mint = mint,
        associated_token::authority = loan_request
    )]
    pub collateral_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveLoan<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused,
        constraint = platform.admin == authority.key() @ BankingVestingError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [LOAN_SEED, loan_request.borrower.as_ref(), mint.key().as_ref()],
        bump = loan_request.bump,
        constraint = loan_request.status == LoanStatus::Pending @ BankingVestingError::LoanNotFound
    )]
    pub loan_request: Account<'info, LoanRequest>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = loan_request.borrower
    )]
    pub borrower_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = platform.treasury
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [LOAN_SEED, borrower.key().as_ref(), mint.key().as_ref()],
        bump = loan_request.bump,
        constraint = loan_request.borrower == borrower.key() @ BankingVestingError::Unauthorized,
        constraint = loan_request.status == LoanStatus::Active @ BankingVestingError::LoanNotFound
    )]
    pub loan_request: Account<'info, LoanRequest>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = borrower
    )]
    pub borrower_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = platform.treasury
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = loan_request
    )]
    pub collateral_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct LiquidatePosition<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        mut,
        seeds = [LOAN_SEED, loan_request.borrower.as_ref(), mint.key().as_ref()],
        bump = loan_request.bump,
        constraint = loan_request.status == LoanStatus::Active @ BankingVestingError::LoanNotFound
    )]
    pub loan_request: Account<'info, LoanRequest>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = liquidator
    )]
    pub liquidator_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = loan_request
    )]
    pub collateral_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub liquidator: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn create_loan_request(
    ctx: Context<CreateLoanRequest>, 
    amount: u64, 
    duration: i64, 
    collateral_amount: u64
) -> Result<()> {
    validate_loan_parameters(amount, collateral_amount, duration)?;
    
    require!(
        ctx.accounts.borrower_token_account.amount >= collateral_amount,
        BankingVestingError::InsufficientCollateral
    );
    
    let loan_request = &mut ctx.accounts.loan_request;
    let clock = Clock::get()?;
    
    // Transfer collateral to escrow
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.borrower_token_account.to_account_info(),
            to: ctx.accounts.collateral_account.to_account_info(),
            authority: ctx.accounts.borrower.to_account_info(),
        },
    );
    
    transfer(transfer_ctx, collateral_amount)?;
    
    loan_request.borrower = ctx.accounts.borrower.key();
    loan_request.mint = ctx.accounts.mint.key();
    loan_request.amount = amount;
    loan_request.collateral_amount = collateral_amount;
    loan_request.interest_rate = calculate_interest_rate(amount, collateral_amount)?;
    loan_request.duration = duration;
    loan_request.start_time = 0; // Set when approved
    loan_request.status = LoanStatus::Pending;
    loan_request.liquidation_threshold = LIQUIDATION_THRESHOLD;
    loan_request.repaid_amount = 0;
    loan_request.bump = ctx.bumps.loan_request;
    
    emit!(LoanRequestCreated {
        loan: loan_request.key(),
        borrower: ctx.accounts.borrower.key(),
        amount,
        collateral_amount,
        duration,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn approve_loan(ctx: Context<ApproveLoan>) -> Result<()> {
    let loan_request = &mut ctx.accounts.loan_request;
    let clock = Clock::get()?;
    
    // Transfer loan amount to borrower
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.treasury_token_account.to_account_info(),
            to: ctx.accounts.borrower_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    );
    
    transfer(transfer_ctx, loan_request.amount)?;
    
    loan_request.status = LoanStatus::Active;
    loan_request.start_time = clock.unix_timestamp;
    
    emit!(LoanApproved {
        loan: loan_request.key(),
        borrower: loan_request.borrower,
        amount: loan_request.amount,
        interest_rate: loan_request.interest_rate,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn repay_loan(ctx: Context<RepayLoan>, amount: u64) -> Result<()> {
    require!(amount > 0, BankingVestingError::InvalidAmount);
    
    let loan_request = &mut ctx.accounts.loan_request;
    let clock = Clock::get()?;
    
    // Calculate total debt including interest
    let interest = calculate_loan_interest(
        loan_request.amount,
        loan_request.interest_rate,
        clock.unix_timestamp - loan_request.start_time,
    )?;
    
    let total_debt = loan_request.amount + interest - loan_request.repaid_amount;
    let repayment_amount = std::cmp::min(amount, total_debt);
    
    require!(
        ctx.accounts.borrower_token_account.amount >= repayment_amount,
        BankingVestingError::InsufficientBalance
    );
    
    // Transfer repayment to treasury
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.borrower_token_account.to_account_info(),
            to: ctx.accounts.treasury_token_account.to_account_info(),
            authority: ctx.accounts.borrower.to_account_info(),
        },
    );
    
    transfer(transfer_ctx, repayment_amount)?;
    
    loan_request.repaid_amount = loan_request.repaid_amount
        .checked_add(repayment_amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    // If fully repaid, return collateral
    if loan_request.repaid_amount >= total_debt {
        let borrower_key = loan_request.borrower;
        let mint_key = ctx.accounts.mint.key();
        let seeds = &[
            LOAN_SEED,
            borrower_key.as_ref(),
            mint_key.as_ref(),
            &[loan_request.bump],
        ];
        let signer_seeds = &[&seeds[..]];
        
        let return_collateral_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.collateral_account.to_account_info(),
                to: ctx.accounts.borrower_token_account.to_account_info(),
                authority: loan_request.to_account_info(),
            },
            signer_seeds,
        );
        
        transfer(return_collateral_ctx, loan_request.collateral_amount)?;
        loan_request.status = LoanStatus::Repaid;
    }
    
    emit!(LoanRepaid {
        loan: loan_request.key(),
        borrower: ctx.accounts.borrower.key(),
        amount: repayment_amount,
        remaining_balance: total_debt - repayment_amount,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn liquidate_position(ctx: Context<LiquidatePosition>) -> Result<()> {
    let loan_request = &mut ctx.accounts.loan_request;
    let clock = Clock::get()?;
    
    // Calculate current debt
    let interest = calculate_loan_interest(
        loan_request.amount,
        loan_request.interest_rate,
        clock.unix_timestamp - loan_request.start_time,
    )?;
    
    let total_debt = loan_request.amount + interest - loan_request.repaid_amount;
    
    // Check if position is liquidatable
    let health_ratio = calculate_liquidation_health(
        loan_request.collateral_amount,
        total_debt,
        loan_request.liquidation_threshold,
    )?;
    
    require!(
        health_ratio < loan_request.liquidation_threshold,
        BankingVestingError::UnderLiquidationThreshold
    );
    
    // Transfer collateral to liquidator
    let borrower_key = loan_request.borrower;
    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        LOAN_SEED,
        borrower_key.as_ref(),
        mint_key.as_ref(),
        &[loan_request.bump],
    ];
    let signer_seeds = &[&seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.collateral_account.to_account_info(),
            to: ctx.accounts.liquidator_token_account.to_account_info(),
            authority: loan_request.to_account_info(),
        },
        signer_seeds,
    );
    
    transfer(transfer_ctx, loan_request.collateral_amount)?;
    
    loan_request.status = LoanStatus::Liquidated;
    
    emit!(PositionLiquidated {
        loan: loan_request.key(),
        borrower: loan_request.borrower,
        collateral_seized: loan_request.collateral_amount,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

fn calculate_interest_rate(amount: u64, collateral_amount: u64) -> Result<u16> {
    let ltv_ratio = amount
        .checked_mul(BASIS_POINTS)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(collateral_amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    // Higher LTV = higher interest rate
    let base_rate = MIN_INTEREST_RATE;
    let risk_premium = (ltv_ratio as u16).saturating_sub(5000) / 100; // 0.01% per 1% LTV above 50%
    
    Ok(std::cmp::min(base_rate + risk_premium, MAX_INTEREST_RATE))
}
