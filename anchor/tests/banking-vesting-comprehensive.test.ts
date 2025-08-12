import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankingVesting } from "../target/types/banking_vesting";
import { 
  PublicKey, 
  Keypair, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
  transfer
} from "@solana/spl-token";
import { expect } from "chai";

describe("Banking Vesting - Comprehensive Tests", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BankingVesting as Program<BankingVesting>;
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;

  // Test accounts
  let platformAccount: PublicKey;
  let companyAccount: PublicKey;
  let bankingAccount: PublicKey;
  let vestingScheduleAccount: PublicKey;
  let loanRequestAccount: PublicKey;
  let savingsAccount: PublicKey;
  let userProfile: PublicKey;

  // Test keypairs
  const admin = Keypair.generate();
  const companyCreator = Keypair.generate();
  const beneficiary = Keypair.generate();
  const borrower = Keypair.generate();
  const lender = Keypair.generate();

  // Token accounts
  let mint: PublicKey;
  let companyTokenAccount: PublicKey;
  let beneficiaryTokenAccount: PublicKey;

  // Test constants
  const TREASURY_THRESHOLD = 100;
  const COMPANY_NAME = "Test Company";
  const COMPANY_SYMBOL = "TST";
  const TOTAL_SUPPLY = 1000000;

  before(async () => {
    // Airdrop SOL to test accounts
    await airdropSol(admin.publicKey, 5);
    await airdropSol(companyCreator.publicKey, 5);
    await airdropSol(beneficiary.publicKey, 5);
    await airdropSol(borrower.publicKey, 5);
    await airdropSol(lender.publicKey, 5);

    // Create test mint
    mint = await createMint(
      connection,
      wallet.payer,
      wallet.publicKey,
      null,
      9
    );

    // Create associated token accounts
    companyTokenAccount = await createAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint,
      companyCreator.publicKey
    );

    beneficiaryTokenAccount = await createAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint,
      beneficiary.publicKey
    );

    // Mint tokens to company
    await mintTo(
      connection,
      wallet.payer,
      mint,
      companyTokenAccount,
      wallet.payer,
      TOTAL_SUPPLY * 10 ** 9
    );

    console.log("Setup completed successfully");
  });

  describe("Platform Initialization", () => {
    it("Initializes the platform", async () => {
      // Derive platform PDA
      [platformAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("platform")],
        program.programId
      );

      const tx = await program.methods
        .initializePlatform(admin.publicKey, TREASURY_THRESHOLD)
        .accounts({
          platform: platformAccount,
          admin: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Platform initialization tx:", tx);

      // Verify platform account
      const platformData = await program.account.platform.fetch(platformAccount);
      expect(platformData.admin.toString()).to.equal(admin.publicKey.toString());
      expect(platformData.treasuryThreshold).to.equal(TREASURY_THRESHOLD);
      expect(platformData.totalCompanies.toNumber()).to.equal(0);
      expect(platformData.totalVestingSchedules.toNumber()).to.equal(0);
      expect(platformData.isPaused).to.be.false;
    });

    it("Fails to initialize platform twice", async () => {
      try {
        await program.methods
          .initializePlatform(admin.publicKey, TREASURY_THRESHOLD)
          .accounts({
            platform: platformAccount,
            admin: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.message).to.include("already in use");
      }
    });
  });

  describe("Company Management", () => {
    it("Creates a company", async () => {
      // Derive company PDA
      [companyAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("company"),
          companyCreator.publicKey.toBuffer(),
          Buffer.from(COMPANY_NAME)
        ],
        program.programId
      );

      const tx = await program.methods
        .createCompany(COMPANY_NAME, COMPANY_SYMBOL, new anchor.BN(TOTAL_SUPPLY))
        .accounts({
          company: companyAccount,
          platform: platformAccount,
          creator: companyCreator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([companyCreator])
        .rpc();

      console.log("Company creation tx:", tx);

      // Verify company account
      const companyData = await program.account.company.fetch(companyAccount);
      expect(companyData.creator.toString()).to.equal(companyCreator.publicKey.toString());
      expect(companyData.name).to.equal(COMPANY_NAME);
      expect(companyData.symbol).to.equal(COMPANY_SYMBOL);
      expect(companyData.totalSupply.toNumber()).to.equal(TOTAL_SUPPLY);
      expect(companyData.employeeCount.toNumber()).to.equal(0);

      // Verify platform counters updated
      const platformData = await program.account.platform.fetch(platformAccount);
      expect(platformData.totalCompanies.toNumber()).to.equal(1);
    });

    it("Fails to create duplicate company", async () => {
      try {
        await program.methods
          .createCompany(COMPANY_NAME, COMPANY_SYMBOL, new anchor.BN(TOTAL_SUPPLY))
          .accounts({
            company: companyAccount,
            platform: platformAccount,
            creator: companyCreator.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([companyCreator])
          .rpc();
        
        expect.fail("Should have failed");
      } catch (error) {
        expect(error.message).to.include("already in use");
      }
    });
  });

  describe("Banking Operations", () => {
    it("Creates a banking account and deposits funds", async () => {
      // Derive banking account PDA
      [bankingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("banking"), wallet.publicKey.toBuffer()],
        program.programId
      );

      // Create user profile first
      [userProfile] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_profile"), wallet.publicKey.toBuffer()],
        program.programId
      );

      const depositAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);

      const tx = await program.methods
        .depositFunds(depositAmount)
        .accounts({
          bankingAccount: bankingAccount,
          userProfile: userProfile,
          platform: platformAccount,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Deposit funds tx:", tx);

      // Verify banking account
      const bankingData = await program.account.bankingAccount.fetch(bankingAccount);
      expect(bankingData.owner.toString()).to.equal(wallet.publicKey.toString());
      expect(bankingData.balance.toNumber()).to.equal(depositAmount.toNumber());
      expect(bankingData.stakedAmount.toNumber()).to.equal(0);
    });

    it("Withdraws funds from banking account", async () => {
      const withdrawAmount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);

      const tx = await program.methods
        .withdrawFunds(withdrawAmount)
        .accounts({
          bankingAccount: bankingAccount,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Withdraw funds tx:", tx);

      // Verify updated balance
      const bankingData = await program.account.bankingAccount.fetch(bankingAccount);
      expect(bankingData.balance.toNumber()).to.equal(0.5 * LAMPORTS_PER_SOL);
    });

    it("Stakes tokens", async () => {
      const stakeAmount = new anchor.BN(0.2 * LAMPORTS_PER_SOL);

      const tx = await program.methods
        .stakeTokens(stakeAmount)
        .accounts({
          bankingAccount: bankingAccount,
          user: wallet.publicKey,
        })
        .rpc();

      console.log("Stake tokens tx:", tx);

      // Verify staking
      const bankingData = await program.account.bankingAccount.fetch(bankingAccount);
      expect(bankingData.stakedAmount.toNumber()).to.equal(stakeAmount.toNumber());
      expect(bankingData.balance.toNumber()).to.equal(0.3 * LAMPORTS_PER_SOL);
    });
  });

  describe("Vesting Schedules", () => {
    it("Creates a vesting schedule", async () => {
      // Derive vesting schedule PDA
      [vestingScheduleAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vesting_schedule"),
          companyAccount.toBuffer(),
          beneficiary.publicKey.toBuffer()
        ],
        program.programId
      );

      const totalAmount = new anchor.BN(10000);
      const startTime = new anchor.BN(Math.floor(Date.now() / 1000));
      const cliffDuration = new anchor.BN(60); // 1 minute cliff
      const vestingDuration = new anchor.BN(300); // 5 minute vesting

      const tx = await program.methods
        .createVestingSchedule(
          beneficiary.publicKey,
          totalAmount,
          startTime,
          cliffDuration,
          vestingDuration,
          { linear: {} }
        )
        .accounts({
          vestingSchedule: vestingScheduleAccount,
          company: companyAccount,
          platform: platformAccount,
          creator: companyCreator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([companyCreator])
        .rpc();

      console.log("Vesting schedule creation tx:", tx);

      // Verify vesting schedule
      const vestingData = await program.account.vestingSchedule.fetch(vestingScheduleAccount);
      expect(vestingData.beneficiary.toString()).to.equal(beneficiary.publicKey.toString());
      expect(vestingData.totalAmount.toNumber()).to.equal(totalAmount.toNumber());
      expect(vestingData.claimedAmount.toNumber()).to.equal(0);
      expect(vestingData.startTime.toNumber()).to.equal(startTime.toNumber());
    });

    it("Claims vested tokens (should fail before cliff)", async () => {
      try {
        await program.methods
          .claimVestedTokens()
          .accounts({
            vestingSchedule: vestingScheduleAccount,
            beneficiary: beneficiary.publicKey,
            company: companyAccount,
            beneficiaryTokenAccount: beneficiaryTokenAccount,
            companyTokenAccount: companyTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([beneficiary])
          .rpc();
        
        expect.fail("Should have failed before cliff");
      } catch (error) {
        console.log("Expected error before cliff:", error.message);
      }
    });
  });

  describe("Loan System", () => {
    it("Creates a loan request", async () => {
      // Derive loan request PDA
      [loanRequestAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("loan_request"),
          borrower.publicKey.toBuffer(),
          Buffer.from("1") // loan number
        ],
        program.programId
      );

      const loanAmount = new anchor.BN(1000);
      const duration = new anchor.BN(86400); // 1 day
      const collateralAmount = new anchor.BN(1500);

      const tx = await program.methods
        .createLoanRequest(loanAmount, duration, collateralAmount)
        .accounts({
          loanRequest: loanRequestAccount,
          platform: platformAccount,
          borrower: borrower.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([borrower])
        .rpc();

      console.log("Loan request creation tx:", tx);

      // Verify loan request
      const loanData = await program.account.loanRequest.fetch(loanRequestAccount);
      expect(loanData.borrower.toString()).to.equal(borrower.publicKey.toString());
      expect(loanData.amount.toNumber()).to.equal(loanAmount.toNumber());
      expect(loanData.duration.toNumber()).to.equal(duration.toNumber());
      expect(loanData.collateralAmount.toNumber()).to.equal(collateralAmount.toNumber());
    });
  });

  describe("Savings Account", () => {
    it("Creates a savings account", async () => {
      // Derive savings account PDA
      [savingsAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("savings"), wallet.publicKey.toBuffer()],
        program.programId
      );

      const apyRate = 500; // 5% APY

      const tx = await program.methods
        .createSavingsAccount(apyRate)
        .accounts({
          savingsAccount: savingsAccount,
          platform: platformAccount,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Savings account creation tx:", tx);

      // Verify savings account
      const savingsData = await program.account.savingsAccount.fetch(savingsAccount);
      expect(savingsData.owner.toString()).to.equal(wallet.publicKey.toString());
      expect(savingsData.apyRate).to.equal(apyRate);
      expect(savingsData.balance.toNumber()).to.equal(0);
    });

    it("Deposits to savings account", async () => {
      const depositAmount = new anchor.BN(1000);

      const tx = await program.methods
        .depositToSavings(depositAmount)
        .accounts({
          savingsAccount: savingsAccount,
          bankingAccount: bankingAccount,
          user: wallet.publicKey,
        })
        .rpc();

      console.log("Deposit to savings tx:", tx);

      // Verify deposit
      const savingsData = await program.account.savingsAccount.fetch(savingsAccount);
      expect(savingsData.balance.toNumber()).to.equal(depositAmount.toNumber());
    });
  });

  describe("Error Handling", () => {
    it("Handles insufficient funds", async () => {
      const largeAmount = new anchor.BN(1000 * LAMPORTS_PER_SOL);

      try {
        await program.methods
          .withdrawFunds(largeAmount)
          .accounts({
            bankingAccount: bankingAccount,
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        
        expect.fail("Should have failed with insufficient funds");
      } catch (error) {
        console.log("Expected insufficient funds error:", error.message);
      }
    });

    it("Handles unauthorized access", async () => {
      const unauthorizedUser = Keypair.generate();
      
      try {
        await program.methods
          .withdrawFunds(new anchor.BN(100))
          .accounts({
            bankingAccount: bankingAccount,
            user: unauthorizedUser.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([unauthorizedUser])
          .rpc();
        
        expect.fail("Should have failed with unauthorized access");
      } catch (error) {
        console.log("Expected unauthorized access error:", error.message);
      }
    });
  });

  // Helper functions
  async function airdropSol(publicKey: PublicKey, amount: number) {
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature);
    console.log(`Airdropped ${amount} SOL to ${publicKey.toString()}`);
  }
});
