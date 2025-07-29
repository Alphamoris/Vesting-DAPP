use anchor_lang::prelude::*;

#[event]
pub struct PlatformInitialized {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct CompanyCreated {
    pub company: Pubkey,
    pub authority: Pubkey,
    pub name: String,
    pub mint: Pubkey,
    pub total_supply: u64,
    pub timestamp: i64,
}

#[event]
pub struct VestingScheduleCreated {
    pub schedule: Pubkey,
    pub company: Pubkey,
    pub beneficiary: Pubkey,
    pub total_amount: u64,
    pub vesting_type: String,
    pub timestamp: i64,
}

#[event]
pub struct TokensClaimed {
    pub schedule: Pubkey,
    pub beneficiary: Pubkey,
    pub amount: u64,
    pub total_claimed: u64,
    pub timestamp: i64,
}

#[event]
pub struct FundsDeposited {
    pub account: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct FundsWithdrawn {
    pub account: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct TokensStaked {
    pub pool: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
    pub timestamp: i64,
}

#[event]
pub struct TokensUnstaked {
    pub pool: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub rewards: u64,
    pub timestamp: i64,
}

#[event]
pub struct LoanRequestCreated {
    pub loan: Pubkey,
    pub borrower: Pubkey,
    pub amount: u64,
    pub collateral_amount: u64,
    pub duration: i64,
    pub timestamp: i64,
}

#[event]
pub struct LoanApproved {
    pub loan: Pubkey,
    pub borrower: Pubkey,
    pub amount: u64,
    pub interest_rate: u16,
    pub timestamp: i64,
}

#[event]
pub struct LoanRepaid {
    pub loan: Pubkey,
    pub borrower: Pubkey,
    pub amount: u64,
    pub remaining_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct PositionLiquidated {
    pub loan: Pubkey,
    pub borrower: Pubkey,
    pub collateral_seized: u64,
    pub timestamp: i64,
}

#[event]
pub struct SavingsAccountCreated {
    pub account: Pubkey,
    pub owner: Pubkey,
    pub apy_rate: u16,
    pub timestamp: i64,
}

#[event]
pub struct InterestCompounded {
    pub account: Pubkey,
    pub owner: Pubkey,
    pub interest_earned: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyPaused {
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyUnpaused {
    pub admin: Pubkey,
    pub timestamp: i64,
}
