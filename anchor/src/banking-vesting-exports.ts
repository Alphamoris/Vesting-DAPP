import { PublicKey } from '@solana/web3.js';

export const BANKING_VESTING_PROGRAM_ID = new PublicKey('B5woVTwykhf4P4MHHawK3GgbHZBTT9Yvig426omjikB1');

export interface Platform {
  admin: PublicKey;
  treasury: PublicKey;
  treasuryThreshold: number;
  totalCompanies: bigint;
  totalVestingSchedules: bigint;
  totalValueLocked: bigint;
  isPaused: boolean;
  bump: number;
}

export interface Company {
  authority: PublicKey;
  name: Uint8Array; // Fixed size [32]
  symbol: Uint8Array; // Fixed size [8]
  mint: PublicKey;
  totalSupply: bigint;
  allocatedSupply: bigint;
  employeesCount: bigint;
  vestingSchedulesCount: bigint;
  createdAt: bigint;
  bump: number;
}

export interface VestingSchedule {
  company: PublicKey;
  beneficiary: PublicKey;
  mint: PublicKey;
  totalAmount: bigint;
  claimedAmount: bigint;
  startTime: bigint;
  cliffDuration: bigint;
  vestingDuration: bigint;
  vestingType: VestingType;
  isRevoked: boolean;
  createdAt: bigint;
  lastClaimed: bigint;
  bump: number;
}

export interface BankingAccount {
  owner: PublicKey;
  balance: bigint;
  stakedAmount: bigint;
  earnedInterest: bigint;
  lastInteraction: bigint;
  accountType: AccountType;
  tierLevel: number;
  bump: number;
}

export interface StakingPool {
  authority: PublicKey;
  mint: PublicKey;
  totalStaked: bigint;
  totalRewards: bigint;
  apyRate: number;
  lockDuration: bigint;
  isActive: boolean;
  bump: number;
}

export interface LoanRequest {
  borrower: PublicKey;
  mint: PublicKey;
  amount: bigint;
  collateralAmount: bigint;
  interestRate: number;
  duration: bigint;
  startTime: bigint;
  status: LoanStatus;
  liquidationThreshold: number;
  repaidAmount: bigint;
  bump: number;
}

export interface SavingsAccount {
  owner: PublicKey;
  mint: PublicKey;
  balance: bigint;
  apyRate: number;
  compoundFrequency: number;
  lastCompound: bigint;
  totalEarned: bigint;
  isLocked: boolean;
  unlockTime: bigint;
  bump: number;
}

export interface UserProfile {
  owner: PublicKey;
  bankingAccount: PublicKey;
  vestingSchedulesCount: number;
  loansCount: number;
  savingsAccountsCount: number;
  totalPortfolioValue: bigint;
  riskScore: number;
  kycVerified: boolean;
  createdAt: bigint;
  lastActivity: bigint;
  bump: number;
}

// Enums
export enum VestingType {
  Linear = 'Linear',
  Cliff = 'Cliff',
  Milestone = 'Milestone',
  Performance = 'Performance',
  Hybrid = 'Hybrid'
}

export enum AccountType {
  Basic = 'Basic',
  Premium = 'Premium',
  Enterprise = 'Enterprise',
  Institutional = 'Institutional'
}

export enum LoanStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Active = 'Active',
  Defaulted = 'Defaulted',
  Repaid = 'Repaid',
  Liquidated = 'Liquidated'
}

// Seed Constants
export const PLATFORM_SEED = 'platform';
export const COMPANY_SEED = 'company';
export const VESTING_SEED = 'vesting';
export const BANKING_SEED = 'banking';
export const STAKING_SEED = 'staking';
export const LOAN_SEED = 'loan';
export const SAVINGS_SEED = 'savings';
export const PROFILE_SEED = 'profile';

// Helper Functions
export function getPlatformPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PLATFORM_SEED)],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getCompanyPDA(authority: PublicKey, name: Uint8Array): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(COMPANY_SEED), authority.toBuffer(), name],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getVestingSchedulePDA(company: PublicKey, beneficiary: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(VESTING_SEED), company.toBuffer(), beneficiary.toBuffer()],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getBankingAccountPDA(user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(BANKING_SEED), user.toBuffer()],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getStakingPoolPDA(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(STAKING_SEED), mint.toBuffer()],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getLoanRequestPDA(borrower: PublicKey, mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LOAN_SEED), borrower.toBuffer(), mint.toBuffer()],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getSavingsAccountPDA(owner: PublicKey, mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SAVINGS_SEED), owner.toBuffer(), mint.toBuffer()],
    BANKING_VESTING_PROGRAM_ID
  );
}

export function getUserProfilePDA(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PROFILE_SEED), owner.toBuffer()],
    BANKING_VESTING_PROGRAM_ID
  );
}

// Utility functions for converting fixed-size arrays
export function stringToFixedBytes(str: string, length: number): Uint8Array {
  const bytes = new TextEncoder().encode(str);
  const fixedBytes = new Uint8Array(length);
  fixedBytes.set(bytes.slice(0, length));
  return fixedBytes;
}

export function fixedBytesToString(bytes: Uint8Array): string {
  // Find the first null byte or use the entire array
  const nullIndex = bytes.indexOf(0);
  const validBytes = nullIndex >= 0 ? bytes.slice(0, nullIndex) : bytes;
  return new TextDecoder().decode(validBytes);
}
