use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, MintTo, mint_to};
use crate::state::*;
use crate::constants::*;
use crate::events::*;
use crate::errors::BankingVestingError;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateCompany<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.is_paused @ BankingVestingError::PlatformPaused
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Company>(),
        seeds = [COMPANY_SEED, authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub company: Account<'info, Company>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = company,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_company(
    ctx: Context<CreateCompany>,
    name: String,
    symbol: String,
    total_supply: u64,
) -> Result<()> {
    require!(
        name.len() <= MAX_COMPANY_NAME_LENGTH,
        BankingVestingError::InvalidVestingParameters
    );
    require!(
        symbol.len() <= MAX_SYMBOL_LENGTH,
        BankingVestingError::InvalidVestingParameters
    );
    
    let company = &mut ctx.accounts.company;
    let platform = &mut ctx.accounts.platform;
    let clock = Clock::get()?;
    
    company.authority = ctx.accounts.authority.key();
    
    // Convert strings to fixed-size arrays
    let mut name_bytes = [0u8; 32];
    let name_len = std::cmp::min(name.len(), 32);
    name_bytes[..name_len].copy_from_slice(&name.as_bytes()[..name_len]);
    company.name = name_bytes;
    
    let mut symbol_bytes = [0u8; 8];
    let symbol_len = std::cmp::min(symbol.len(), 8);
    symbol_bytes[..symbol_len].copy_from_slice(&symbol.as_bytes()[..symbol_len]);
    company.symbol = symbol_bytes;
    
    company.mint = ctx.accounts.mint.key();
    company.total_supply = total_supply;
    company.allocated_supply = 0;
    company.employees_count = 0;
    company.vesting_schedules_count = 0;
    company.created_at = clock.unix_timestamp;
    company.bump = ctx.bumps.company;
    
    platform.total_companies = platform.total_companies
        .checked_add(1)
        .ok_or(BankingVestingError::ArithmeticOverflow)?;
    
    emit!(CompanyCreated {
        company: company.key(),
        authority: ctx.accounts.authority.key(),
        name,
        mint: ctx.accounts.mint.key(),
        total_supply,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
