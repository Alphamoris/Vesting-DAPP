use anchor_lang::prelude::*;

#[account]
pub struct Platform {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub treasury_threshold: u8,
    pub total_companies: u64,
    pub total_vesting_schedules: u64,
    pub total_value_locked: u64,
    pub is_paused: bool,
    pub bump: u8,
}

#[account]
pub struct Company {
    pub authority: Pubkey,
    pub name: [u8; 32], // Fixed size instead of String
    pub symbol: [u8; 8], // Fixed size instead of String
    pub mint: Pubkey,
    pub total_supply: u64,
    pub allocated_supply: u64,
    pub employees_count: u64,
    pub vesting_schedules_count: u64,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
pub struct VestingSchedule {
    pub company: Pubkey,
    pub beneficiary: Pubkey,
    pub mint: Pubkey,
    pub total_amount: u64,
    pub claimed_amount: u64,
    pub start_time: i64,
    pub cliff_duration: i64,
    pub vesting_duration: i64,
    pub vesting_type: VestingType,
    pub is_revoked: bool,
    pub created_at: i64,
    pub last_claimed: i64,
    pub bump: u8,
}

#[account]
pub struct BankingAccount {
    pub owner: Pubkey,
    pub balance: u64,
    pub staked_amount: u64,
    pub earned_interest: u64,
    pub last_interaction: i64,
    pub account_type: AccountType,
    pub tier_level: u8,
    pub bump: u8,
}

#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub total_staked: u64,
    pub total_rewards: u64,
    pub apy_rate: u16,
    pub lock_duration: i64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
pub struct LoanRequest {
    pub borrower: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub collateral_amount: u64,
    pub interest_rate: u16,
    pub duration: i64,
    pub start_time: i64,
    pub status: LoanStatus,
    pub liquidation_threshold: u16,
    pub repaid_amount: u64,
    pub bump: u8,
}

#[account]
pub struct SavingsAccount {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub balance: u64,
    pub apy_rate: u16,
    pub compound_frequency: u8,
    pub last_compound: i64,
    pub total_earned: u64,
    pub is_locked: bool,
    pub unlock_time: i64,
    pub bump: u8,
}

#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub banking_account: Pubkey,
    pub vesting_schedules_count: u8, // Instead of Vec<Pubkey>
    pub loans_count: u8, // Instead of Vec<Pubkey>
    pub savings_accounts_count: u8, // Instead of Vec<Pubkey>
    pub total_portfolio_value: u64,
    pub risk_score: u8,
    pub kyc_verified: bool,
    pub created_at: i64,
    pub last_activity: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum VestingType {
    Linear,
    Cliff,
    Milestone,
    Performance,
    Hybrid,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AccountType {
    Basic,
    Premium,
    Enterprise,
    Institutional,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LoanStatus {
    Pending,
    Approved,
    Active,
    Defaulted,
    Repaid,
    Liquidated,
}
