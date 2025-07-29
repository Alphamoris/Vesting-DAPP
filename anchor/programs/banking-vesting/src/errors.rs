use anchor_lang::prelude::*;

#[error_code]
pub enum BankingVestingError {
    #[msg("Platform is currently paused")]
    PlatformPaused,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Invalid vesting schedule parameters")]
    InvalidVestingParameters,
    
    #[msg("Vesting schedule has not started yet")]
    VestingNotStarted,
    
    #[msg("Still in cliff period")]
    InCliffPeriod,
    
    #[msg("No tokens available for claim")]
    NoTokensAvailable,
    
    #[msg("Insufficient balance")]
    InsufficientBalance,
    
    #[msg("Invalid amount")]
    InvalidAmount,
    
    #[msg("Loan already exists")]
    LoanAlreadyExists,
    
    #[msg("Loan not found")]
    LoanNotFound,
    
    #[msg("Insufficient collateral")]
    InsufficientCollateral,
    
    #[msg("Loan not approved")]
    LoanNotApproved,
    
    #[msg("Position under liquidation threshold")]
    UnderLiquidationThreshold,
    
    #[msg("Staking pool is not active")]
    StakingPoolInactive,
    
    #[msg("Invalid staking duration")]
    InvalidStakingDuration,
    
    #[msg("Tokens still locked")]
    TokensStillLocked,
    
    #[msg("Account not found")]
    AccountNotFound,
    
    #[msg("Invalid account type")]
    InvalidAccountType,
    
    #[msg("KYC verification required")]
    KycRequired,
    
    #[msg("Risk score too high")]
    RiskScoreTooHigh,
    
    #[msg("Daily limit exceeded")]
    DailyLimitExceeded,
    
    #[msg("Invalid APY rate")]
    InvalidApyRate,
    
    #[msg("Compound frequency not met")]
    CompoundFrequencyNotMet,
    
    #[msg("Savings account is locked")]
    SavingsAccountLocked,
    
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}
