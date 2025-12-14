import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Deploying with wallet:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "POL");

  const mockUSDCSource = fs.readFileSync(path.join("contracts", "MockUSDC.sol"), "utf-8");
  const partOwnPoolSource = fs.readFileSync(path.join("contracts", "PartOwnPool.sol"), "utf-8");
  const poolFactorySource = fs.readFileSync(path.join("contracts", "PoolFactory.sol"), "utf-8");

  console.log("\nContracts found. You'll need to compile and deploy manually.");
  console.log("\nTo deploy:");
  console.log("1. Install solc compiler");
  console.log("2. Compile contracts");
  console.log("3. Deploy using ethers.js or use Remix IDE");
  console.log("\nAlternatively, use these pre-deployed testnet addresses (existing USDC and factory):");
  console.log("Or deploy via Remix at https://remix.ethereum.org");
}

main().catch(console.error);
