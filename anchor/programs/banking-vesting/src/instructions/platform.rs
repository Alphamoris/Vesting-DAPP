use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Platform>(),
        seeds = [PLATFORM_SEED],
        bump
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: Treasury account for platform fees
    pub treasury: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn initialize_platform(
    ctx: Context<InitializePlatform>,
    admin: Pubkey,
    treasury_threshold: u8,
) -> Result<()> {
    let platform = &mut ctx.accounts.platform;
    let clock = Clock::get()?;
    
    platform.admin = admin;
    platform.treasury = ctx.accounts.treasury.key();
    platform.treasury_threshold = treasury_threshold;
    platform.total_companies = 0;
    platform.total_vesting_schedules = 0;
    platform.total_value_locked = 0;
    platform.is_paused = false;
    platform.bump = ctx.bumps.platform;
    
    emit!(PlatformInitialized {
        admin,
        treasury: ctx.accounts.treasury.key(),
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
