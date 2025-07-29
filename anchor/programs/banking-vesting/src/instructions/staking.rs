use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    #[account(mut)]
    pub user: Signer<'info>,
}

pub fn stake_tokens(_ctx: Context<StakeTokens>, _amount: u64) -> Result<()> {
    Ok(())
}

pub fn unstake_tokens(_ctx: Context<UnstakeTokens>, _amount: u64) -> Result<()> {
    Ok(())
}
