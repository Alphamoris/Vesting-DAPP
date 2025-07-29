use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;

#[derive(Accounts)]
pub struct CreateSavingsAccount<'info> {
    #[account(mut)]
    pub savings_account: Account<'info, SavingsAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn create_savings_account(_ctx: Context<CreateSavingsAccount>, _apy_rate: u16) -> Result<()> {
    Ok(())
}
