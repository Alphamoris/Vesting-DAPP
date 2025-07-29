use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod events;
pub mod constants;
pub mod utils;

use instructions::*;
use state::VestingType;

declare_id!("BankVest11111111111111111111111111111111111");

#[program]
pub mod banking_vesting {
    use super::*;

    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        admin: Pubkey,
        treasury_threshold: u8,
    ) -> Result<()> {
        instructions::initialize_platform(ctx, admin, treasury_threshold)
    }

    pub fn create_company(
        ctx: Context<CreateCompany>,
        name: String,
        symbol: String,
        total_supply: u64,
    ) -> Result<()> {
        instructions::create_company(ctx, name, symbol, total_supply)
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
        instructions::create_vesting_schedule(
            ctx,
            beneficiary,
            total_amount,
            start_time,
            cliff_duration,
            vesting_duration,
            vesting_type,
        )
    }

    pub fn claim_vested_tokens(ctx: Context<ClaimVestedTokens>) -> Result<()> {
        instructions::claim_vested_tokens(ctx)
    }

    pub fn deposit_funds(ctx: Context<DepositFunds>, amount: u64) -> Result<()> {
        instructions::deposit_funds(ctx, amount)
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
        instructions::withdraw_funds(ctx, amount)
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        instructions::stake_tokens(ctx, amount)
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        instructions::unstake_tokens(ctx, amount)
    }

    pub fn create_loan_request(
        ctx: Context<CreateLoanRequest>,
        amount: u64,
        duration: i64,
        collateral_amount: u64,
    ) -> Result<()> {
        instructions::create_loan_request(ctx, amount, duration, collateral_amount)
    }

    pub fn approve_loan(ctx: Context<ApproveLoan>) -> Result<()> {
        instructions::approve_loan(ctx)
    }

    pub fn repay_loan(ctx: Context<RepayLoan>, amount: u64) -> Result<()> {
        instructions::repay_loan(ctx, amount)
    }

    pub fn liquidate_position(ctx: Context<LiquidatePosition>) -> Result<()> {
        instructions::liquidate_position(ctx)
    }

    pub fn create_savings_account(
        ctx: Context<CreateSavingsAccount>,
        apy_rate: u16,
    ) -> Result<()> {
        instructions::create_savings_account(ctx, apy_rate)
    }

    pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
        instructions::emergency_pause(ctx)
    }

    pub fn emergency_unpause(ctx: Context<EmergencyUnpause>) -> Result<()> {
        instructions::emergency_unpause(ctx)
    }
}
