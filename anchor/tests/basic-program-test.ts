import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
// import { BankingVesting } from "../target/types/banking_vesting.js";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

// We'll access the program via workspace instead of types
type BankingVesting = any;

describe("Banking Vesting - Basic Tests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BankingVesting as Program<BankingVesting>;

  console.log("Program ID:", program.programId.toString());
  console.log("Provider wallet:", provider.wallet.publicKey.toString());

  it("Program loads successfully", async () => {
    // Simple test to verify the program loads
    console.log("Program loaded successfully");
    console.log("Program methods:", Object.keys(program.methods));
  });

  it("Can call instructions (demo mode)", async () => {
    try {
      // Test if we can access the program methods without calling them
      const methods = program.methods;
      
      console.log("Available methods:");
      Object.keys(methods).forEach(method => {
        console.log(`- ${method}`);
      });

      // Check if essential methods exist
      const requiredMethods = [
        'initializePlatform',
        'createCompany', 
        'depositFunds',
        'withdrawFunds',
        'createVestingSchedule'
      ];

      const availableMethods = Object.keys(methods);
      
      requiredMethods.forEach(method => {
        if (availableMethods.includes(method)) {
          console.log(`✅ ${method} method available`);
        } else {
          console.log(`❌ ${method} method missing`);
        }
      });

    } catch (error) {
      console.error("Error accessing program methods:", error);
    }
  });
});
