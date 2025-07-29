use anchor_lang::prelude::*;
use crate::constants::*;
use crate::errors::BankingVestingError;

pub fn calculate_vested_amount(
    total_amount: u64,
    start_time: i64,
    cliff_duration: i64,
    vesting_duration: i64,
    current_time: i64,
) -> Result<u64> {
    if current_time < start_time {
        return Ok(0);
    }

    let elapsed_time = current_time - start_time;
    
    if elapsed_time < cliff_duration {
        return Ok(0);
    }

    if elapsed_time >= vesting_duration {
        return Ok(total_amount);
    }

    let vested_amount = total_amount
        .checked_mul(elapsed_time as u64)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(vesting_duration as u64)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;

    Ok(vested_amount)
}

pub fn calculate_compound_interest(
    principal: u64,
    apy_rate: u16,
    time_elapsed: i64,
    compound_frequency: u8,
) -> Result<u64> {
    if time_elapsed <= 0 {
        return Ok(0);
    }

    let annual_rate = apy_rate as u64;
    let periods_per_year = compound_frequency as u64;
    let years_elapsed = time_elapsed as u64 / SECONDS_PER_YEAR as u64;
    
    let rate_per_period = annual_rate / (BASIS_POINTS * periods_per_year);
    let total_periods = years_elapsed * periods_per_year;
    
    let compound_factor = (BASIS_POINTS + rate_per_period)
        .checked_pow(total_periods as u32)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    let final_amount = principal
        .checked_mul(compound_factor)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(BASIS_POINTS.pow(total_periods as u32))
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(final_amount - principal)
}

pub fn calculate_loan_interest(
    principal: u64,
    interest_rate: u16,
    time_elapsed: i64,
) -> Result<u64> {
    let annual_rate = interest_rate as u64;
    let time_fraction = time_elapsed as u64 / SECONDS_PER_YEAR as u64;
    
    let interest = principal
        .checked_mul(annual_rate)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_mul(time_fraction)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(BASIS_POINTS)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(interest)
}

pub fn calculate_liquidation_health(
    collateral_value: u64,
    debt_value: u64,
    liquidation_threshold: u16,
) -> Result<u16> {
    if debt_value == 0 {
        return Ok(10000); // 100% healthy
    }
    
    let health_ratio = collateral_value
        .checked_mul(BASIS_POINTS)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(debt_value)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(health_ratio as u16)
}

pub fn calculate_staking_rewards(
    staked_amount: u64,
    apy_rate: u16,
    time_staked: i64,
) -> Result<u64> {
    let annual_rate = apy_rate as u64;
    let time_fraction = time_staked as u64 / SECONDS_PER_YEAR as u64;
    
    let rewards = staked_amount
        .checked_mul(annual_rate)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_mul(time_fraction)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(BASIS_POINTS)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(rewards)
}

pub fn calculate_platform_fee(amount: u64, fee_bps: u16) -> Result<u64> {
    let fee = amount
        .checked_mul(fee_bps as u64)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(BASIS_POINTS)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    Ok(fee)
}

pub fn validate_vesting_parameters(
    start_time: i64,
    cliff_duration: i64,
    vesting_duration: i64,
) -> Result<()> {
    if cliff_duration < MIN_CLIFF_DURATION || cliff_duration > MAX_CLIFF_DURATION {
        return Err(BankingVestingError::InvalidVestingParameters.into());
    }
    
    if vesting_duration < MIN_VESTING_DURATION || vesting_duration > MAX_VESTING_DURATION {
        return Err(BankingVestingError::InvalidVestingParameters.into());
    }
    
    if cliff_duration > vesting_duration {
        return Err(BankingVestingError::InvalidVestingParameters.into());
    }
    
    let current_time = Clock::get()?.unix_timestamp;
    if start_time < current_time - SECONDS_PER_DAY {
        return Err(BankingVestingError::InvalidTimestamp.into());
    }
    
    Ok(())
}

pub fn validate_apy_rate(apy_rate: u16) -> Result<()> {
    if apy_rate < MIN_APY_RATE || apy_rate > MAX_APY_RATE {
        return Err(BankingVestingError::InvalidApyRate.into());
    }
    Ok(())
}

pub fn validate_loan_parameters(
    amount: u64,
    collateral_amount: u64,
    duration: i64,
) -> Result<()> {
    if amount < MIN_LOAN_AMOUNT {
        return Err(BankingVestingError::InvalidAmount.into());
    }
    
    let collateral_ratio = collateral_amount
        .checked_mul(BASIS_POINTS)
        .ok_or(BankingVestingError::ArithmeticOverflow)?
        .checked_div(amount)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    if collateral_ratio < MIN_COLLATERAL_RATIO as u64 {
        return Err(BankingVestingError::InsufficientCollateral.into());
    }
    
    if duration < SECONDS_PER_DAY || duration > SECONDS_PER_YEAR * 5 {
        return Err(BankingVestingError::InvalidVestingParameters.into());
    }
    
    Ok(())
}
