pub const PLATFORM_SEED: &[u8] = b"platform";
pub const COMPANY_SEED: &[u8] = b"company";
pub const VESTING_SEED: &[u8] = b"vesting";
pub const BANKING_SEED: &[u8] = b"banking";
pub const STAKING_SEED: &[u8] = b"staking";
pub const LOAN_SEED: &[u8] = b"loan";
pub const SAVINGS_SEED: &[u8] = b"savings";
pub const PROFILE_SEED: &[u8] = b"profile";

pub const MAX_COMPANY_NAME_LENGTH: usize = 32;
pub const MAX_SYMBOL_LENGTH: usize = 8;
pub const MAX_VESTING_SCHEDULES_PER_USER: usize = 10;
pub const MAX_LOANS_PER_USER: usize = 5;
pub const MAX_SAVINGS_ACCOUNTS_PER_USER: usize = 3;

pub const MIN_VESTING_DURATION: i64 = 86400; // 1 day
pub const MAX_VESTING_DURATION: i64 = 126144000; // 4 years
pub const MIN_CLIFF_DURATION: i64 = 0;
pub const MAX_CLIFF_DURATION: i64 = 31536000; // 1 year

pub const MIN_STAKE_AMOUNT: u64 = 1_000_000; // 1 token (6 decimals)
pub const MIN_LOAN_AMOUNT: u64 = 10_000_000; // 10 tokens
pub const MIN_SAVINGS_DEPOSIT: u64 = 1_000_000; // 1 token

pub const MAX_APY_RATE: u16 = 2000; // 20%
pub const MIN_APY_RATE: u16 = 100; // 1%
pub const MAX_INTEREST_RATE: u16 = 3000; // 30%
pub const MIN_INTEREST_RATE: u16 = 500; // 5%

pub const LIQUIDATION_THRESHOLD: u16 = 8000; // 80%
pub const MAX_LOAN_TO_VALUE: u16 = 7500; // 75%
pub const MIN_COLLATERAL_RATIO: u16 = 12500; // 125%

pub const SECONDS_PER_DAY: i64 = 86400;
pub const SECONDS_PER_YEAR: i64 = 31536000;
pub const BASIS_POINTS: u64 = 10000;

pub const PLATFORM_FEE_BPS: u16 = 25; // 0.25%
pub const STAKING_FEE_BPS: u16 = 10; // 0.1%
pub const LOAN_ORIGINATION_FEE_BPS: u16 = 50; // 0.5%
