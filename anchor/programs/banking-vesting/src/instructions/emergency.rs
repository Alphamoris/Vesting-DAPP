use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = platform.admin == authority.key() @ BankingVestingError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct EmergencyUnpause<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = platform.admin == authority.key() @ BankingVestingError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
    let platform = &mut ctx.accounts.platform;
    platform.is_paused = true;
    
    let clock = Clock::get()?;
    emit!(EmergencyPaused {
        admin: ctx.accounts.authority.key(),
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

pub fn emergency_unpause(ctx: Context<EmergencyUnpause>) -> Result<()> {
    let platform = &mut ctx.accounts.platform;
    platform.is_paused = false;
    
    let clock = Clock::get()?;
    emit!(EmergencyUnpaused {
        admin: ctx.accounts.authority.key(),
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
