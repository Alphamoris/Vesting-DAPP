use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;

#[derive(Accounts)]
pub struct CreateLoanRequest<'info> {
    #[account(mut)]
    pub loan_request: Account<'info, LoanRequest>,
    #[account(mut)]
    pub borrower: Signer<'info>,
}

#[derive(Accounts)]
pub struct ApproveLoan<'info> {
    #[account(mut)]
    pub loan_request: Account<'info, LoanRequest>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub loan_request: Account<'info, LoanRequest>,
    #[account(mut)]
    pub borrower: Signer<'info>,
}

#[derive(Accounts)]
pub struct LiquidatePosition<'info> {
    #[account(mut)]
    pub loan_request: Account<'info, LoanRequest>,
    #[account(mut)]
    pub liquidator: Signer<'info>,
}

pub fn create_loan_request(_ctx: Context<CreateLoanRequest>, _amount: u64, _duration: i64, _collateral_amount: u64) -> Result<()> {
    Ok(())
}

pub fn approve_loan(_ctx: Context<ApproveLoan>) -> Result<()> {
    Ok(())
}

pub fn repay_loan(_ctx: Context<RepayLoan>, _amount: u64) -> Result<()> {
    Ok(())
}

pub fn liquidate_position(_ctx: Context<LiquidatePosition>) -> Result<()> {
    Ok(())
}
