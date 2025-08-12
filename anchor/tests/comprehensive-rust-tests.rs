use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_instruction,
    transaction::Transaction,
};
use std::mem;

// Import your program types
use banking_vesting::{
    state::{Platform, Company, BankingAccount, VestingSchedule, LoanRequest, SavingsAccount, VestingType, AccountType, LoanStatus},
    instruction::{InitializePlatform, CreateCompany, DepositFunds, WithdrawFunds, CreateVestingSchedule},
};

#[tokio::test]
async fn test_platform_initialization() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    // Create platform account
    let platform_keypair = Keypair::new();
    let admin_keypair = Keypair::new();
    
    // Create platform account
    let rent = banks_client.get_rent().await.unwrap();
    let platform_lamports = rent.minimum_balance(mem::size_of::<Platform>());
    
    let create_platform_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &platform_keypair.pubkey(),
        platform_lamports,
        mem::size_of::<Platform>() as u64,
        &program_id,
    );

    // Initialize platform instruction
    let treasury_threshold = 100u8;
    let initialize_platform_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(platform_keypair.pubkey(), false),
            AccountMeta::new_readonly(admin_keypair.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [0u8] // Initialize platform instruction discriminator
            .iter()
            .chain(&admin_keypair.pubkey().to_bytes())
            .chain(&treasury_threshold.to_le_bytes())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[create_platform_account_ix, initialize_platform_ix],
        Some(&payer.pubkey()),
        &[&payer, &platform_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify platform account data
    let platform_account = banks_client
        .get_account(platform_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    assert_eq!(platform_account.owner, program_id);
    
    // Deserialize and verify platform data
    let platform_data: Platform = Platform::try_deserialize(&mut platform_account.data.as_slice()).unwrap();
    assert_eq!(platform_data.admin, admin_keypair.pubkey());
    assert_eq!(platform_data.treasury_threshold, treasury_threshold);
    assert_eq!(platform_data.total_companies, 0);
    assert_eq!(platform_data.total_vesting_schedules, 0);
    assert!(!platform_data.is_paused);
}

#[tokio::test]
async fn test_company_creation() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    // Initialize platform first
    let platform_keypair = Keypair::new();
    let admin_keypair = Keypair::new();
    
    // ... (platform initialization code similar to above)
    
    // Create company
    let company_keypair = Keypair::new();
    let creator_keypair = Keypair::new();
    
    let rent = banks_client.get_rent().await.unwrap();
    let company_lamports = rent.minimum_balance(mem::size_of::<Company>());
    
    let create_company_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &company_keypair.pubkey(),
        company_lamports,
        mem::size_of::<Company>() as u64,
        &program_id,
    );

    let company_name = "Test Company";
    let company_symbol = "TST";
    let total_supply = 1000000u64;

    let create_company_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(company_keypair.pubkey(), false),
            AccountMeta::new(platform_keypair.pubkey(), false),
            AccountMeta::new(creator_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [1u8] // Create company instruction discriminator
            .iter()
            .chain(company_name.len().to_le_bytes().iter())
            .chain(company_name.as_bytes())
            .chain(company_symbol.len().to_le_bytes().iter())
            .chain(company_symbol.as_bytes())
            .chain(total_supply.to_le_bytes().iter())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[create_company_account_ix, create_company_ix],
        Some(&payer.pubkey()),
        &[&payer, &company_keypair, &creator_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify company account data
    let company_account = banks_client
        .get_account(company_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    let company_data: Company = Company::try_deserialize(&mut company_account.data.as_slice()).unwrap();
    assert_eq!(company_data.creator, creator_keypair.pubkey());
    assert_eq!(company_data.name, company_name);
    assert_eq!(company_data.symbol, company_symbol);
    assert_eq!(company_data.total_supply, total_supply);
    assert_eq!(company_data.employee_count, 0);
}

#[tokio::test]
async fn test_banking_operations() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    // Create banking account
    let banking_account_keypair = Keypair::new();
    let user_keypair = Keypair::new();
    
    let rent = banks_client.get_rent().await.unwrap();
    let banking_lamports = rent.minimum_balance(mem::size_of::<BankingAccount>());
    
    let create_banking_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &banking_account_keypair.pubkey(),
        banking_lamports,
        mem::size_of::<BankingAccount>() as u64,
        &program_id,
    );

    // Deposit funds
    let deposit_amount = 1_000_000_000u64; // 1 SOL in lamports

    let deposit_funds_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(banking_account_keypair.pubkey(), false),
            AccountMeta::new(user_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [2u8] // Deposit funds instruction discriminator
            .iter()
            .chain(deposit_amount.to_le_bytes().iter())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[create_banking_account_ix, deposit_funds_ix],
        Some(&payer.pubkey()),
        &[&payer, &banking_account_keypair, &user_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify banking account data
    let banking_account = banks_client
        .get_account(banking_account_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    let banking_data: BankingAccount = BankingAccount::try_deserialize(&mut banking_account.data.as_slice()).unwrap();
    assert_eq!(banking_data.owner, user_keypair.pubkey());
    assert_eq!(banking_data.balance, deposit_amount);
    assert_eq!(banking_data.staked_amount, 0);
}

#[tokio::test]
async fn test_withdraw_funds() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    // ... (setup banking account with some balance)
    
    let banking_account_keypair = Keypair::new();
    let user_keypair = Keypair::new();
    
    // ... (create and fund banking account)
    
    // Withdraw funds
    let withdraw_amount = 500_000_000u64; // 0.5 SOL

    let withdraw_funds_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(banking_account_keypair.pubkey(), false),
            AccountMeta::new(user_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [3u8] // Withdraw funds instruction discriminator
            .iter()
            .chain(withdraw_amount.to_le_bytes().iter())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[withdraw_funds_ix],
        Some(&payer.pubkey()),
        &[&payer, &user_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify updated banking account balance
    let banking_account = banks_client
        .get_account(banking_account_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    let banking_data: BankingAccount = BankingAccount::try_deserialize(&mut banking_account.data.as_slice()).unwrap();
    assert_eq!(banking_data.balance, 500_000_000); // 1 SOL - 0.5 SOL = 0.5 SOL
}

#[tokio::test]
async fn test_vesting_schedule_creation() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    // ... (setup platform and company)
    
    let vesting_schedule_keypair = Keypair::new();
    let company_keypair = Keypair::new();
    let beneficiary_keypair = Keypair::new();
    let creator_keypair = Keypair::new();
    
    let rent = banks_client.get_rent().await.unwrap();
    let vesting_lamports = rent.minimum_balance(mem::size_of::<VestingSchedule>());
    
    let create_vesting_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &vesting_schedule_keypair.pubkey(),
        vesting_lamports,
        mem::size_of::<VestingSchedule>() as u64,
        &program_id,
    );

    let total_amount = 10000u64;
    let start_time = 1672531200i64; // Jan 1, 2023
    let cliff_duration = 86400i64; // 1 day
    let vesting_duration = 31536000i64; // 1 year

    let create_vesting_schedule_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(vesting_schedule_keypair.pubkey(), false),
            AccountMeta::new_readonly(company_keypair.pubkey(), false),
            AccountMeta::new(creator_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [4u8] // Create vesting schedule instruction discriminator
            .iter()
            .chain(beneficiary_keypair.pubkey().to_bytes().iter())
            .chain(total_amount.to_le_bytes().iter())
            .chain(start_time.to_le_bytes().iter())
            .chain(cliff_duration.to_le_bytes().iter())
            .chain(vesting_duration.to_le_bytes().iter())
            .chain([0u8].iter()) // VestingType::Linear = 0
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[create_vesting_account_ix, create_vesting_schedule_ix],
        Some(&payer.pubkey()),
        &[&payer, &vesting_schedule_keypair, &creator_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify vesting schedule data
    let vesting_account = banks_client
        .get_account(vesting_schedule_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    let vesting_data: VestingSchedule = VestingSchedule::try_deserialize(&mut vesting_account.data.as_slice()).unwrap();
    assert_eq!(vesting_data.beneficiary, beneficiary_keypair.pubkey());
    assert_eq!(vesting_data.total_amount, total_amount);
    assert_eq!(vesting_data.claimed_amount, 0);
    assert_eq!(vesting_data.start_time, start_time);
    assert_eq!(vesting_data.cliff_duration, cliff_duration);
    assert_eq!(vesting_data.vesting_duration, vesting_duration);
}

#[tokio::test]
async fn test_error_handling_insufficient_funds() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    // Create banking account with small balance
    let banking_account_keypair = Keypair::new();
    let user_keypair = Keypair::new();
    
    // ... (create account with small balance)
    
    // Try to withdraw more than available
    let withdraw_amount = 10_000_000_000u64; // 10 SOL (more than balance)

    let withdraw_funds_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(banking_account_keypair.pubkey(), false),
            AccountMeta::new(user_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [3u8] // Withdraw funds instruction discriminator
            .iter()
            .chain(withdraw_amount.to_le_bytes().iter())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[withdraw_funds_ix],
        Some(&payer.pubkey()),
        &[&payer, &user_keypair],
        recent_blockhash,
    );

    // This should fail with insufficient funds error
    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_err());
}

#[tokio::test]
async fn test_loan_request_creation() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    let loan_request_keypair = Keypair::new();
    let borrower_keypair = Keypair::new();
    
    let rent = banks_client.get_rent().await.unwrap();
    let loan_lamports = rent.minimum_balance(mem::size_of::<LoanRequest>());
    
    let create_loan_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &loan_request_keypair.pubkey(),
        loan_lamports,
        mem::size_of::<LoanRequest>() as u64,
        &program_id,
    );

    let loan_amount = 1000u64;
    let duration = 86400i64; // 1 day
    let collateral_amount = 1500u64;

    let create_loan_request_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(loan_request_keypair.pubkey(), false),
            AccountMeta::new(borrower_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [5u8] // Create loan request instruction discriminator
            .iter()
            .chain(loan_amount.to_le_bytes().iter())
            .chain(duration.to_le_bytes().iter())
            .chain(collateral_amount.to_le_bytes().iter())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[create_loan_account_ix, create_loan_request_ix],
        Some(&payer.pubkey()),
        &[&payer, &loan_request_keypair, &borrower_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify loan request data
    let loan_account = banks_client
        .get_account(loan_request_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    let loan_data: LoanRequest = LoanRequest::try_deserialize(&mut loan_account.data.as_slice()).unwrap();
    assert_eq!(loan_data.borrower, borrower_keypair.pubkey());
    assert_eq!(loan_data.amount, loan_amount);
    assert_eq!(loan_data.duration, duration);
    assert_eq!(loan_data.collateral_amount, collateral_amount);
}

#[tokio::test]
async fn test_savings_account_creation() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "banking_vesting",
        program_id,
        processor!(banking_vesting::entry),
    )
    .start()
    .await;

    let savings_account_keypair = Keypair::new();
    let user_keypair = Keypair::new();
    
    let rent = banks_client.get_rent().await.unwrap();
    let savings_lamports = rent.minimum_balance(mem::size_of::<SavingsAccount>());
    
    let create_savings_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &savings_account_keypair.pubkey(),
        savings_lamports,
        mem::size_of::<SavingsAccount>() as u64,
        &program_id,
    );

    let apy_rate = 500u16; // 5% APY

    let create_savings_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(savings_account_keypair.pubkey(), false),
            AccountMeta::new(user_keypair.pubkey(), true),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: [6u8] // Create savings account instruction discriminator
            .iter()
            .chain(apy_rate.to_le_bytes().iter())
            .cloned()
            .collect(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[create_savings_account_ix, create_savings_ix],
        Some(&payer.pubkey()),
        &[&payer, &savings_account_keypair, &user_keypair],
        recent_blockhash,
    );

    banks_client.process_transaction(transaction).await.unwrap();

    // Verify savings account data
    let savings_account = banks_client
        .get_account(savings_account_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();

    let savings_data: SavingsAccount = SavingsAccount::try_deserialize(&mut savings_account.data.as_slice()).unwrap();
    assert_eq!(savings_data.owner, user_keypair.pubkey());
    assert_eq!(savings_data.apy_rate, apy_rate);
    assert_eq!(savings_data.balance, 0);
}
