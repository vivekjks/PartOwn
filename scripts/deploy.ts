import { readFileSync } from "fs";
import { join } from "path";
import { Wallet, ContractFactory, JsonRpcProvider, formatEther } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC = process.env.POLYGON_AMOY_RPC || "";
const PK = process.env.PRIVATE_KEY || "";
const ARTIFACTS_DIR = join(process.cwd(), "artifacts", "contracts");

async function main() {
  console.log("Deploying contracts to Polygon Amoy testnet...");

  if (!RPC || !PK) {
    throw new Error("POLYGON_AMOY_RPC and PRIVATE_KEY must be set in .env");
  }

  const provider = new JsonRpcProvider(RPC);
  const deployer = new Wallet(PK, provider);
  console.log("Deploying with account:", deployer.address);

  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", formatEther(balance), "POL");

  console.log("\n1. Deploying MockUSDC...");
  const mockPath = join(ARTIFACTS_DIR, "MockUSDC.sol", "MockUSDC.json");
  const MockUSDCArtifact = JSON.parse(readFileSync(mockPath, "utf8"));
  const MockUSDCFactory = new ContractFactory(MockUSDCArtifact.abi, MockUSDCArtifact.bytecode, deployer);
  const usdc = await MockUSDCFactory.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("MockUSDC deployed to:", usdcAddress);

  console.log("\n2. Deploying PoolFactory...");
  const poolPath = join(ARTIFACTS_DIR, "PoolFactory.sol", "PoolFactory.json");
  const PoolFactoryArtifact = JSON.parse(readFileSync(poolPath, "utf8"));
  const PoolFactoryFactory = new ContractFactory(PoolFactoryArtifact.abi, PoolFactoryArtifact.bytecode, deployer);
  const factory = await PoolFactoryFactory.deploy(usdcAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("PoolFactory deployed to:", factoryAddress);

  console.log("\n✅ Deployment complete!");
  console.log("\nContract Addresses:");
  console.log("==================");
  console.log("MockUSDC:", usdcAddress);
  console.log("PoolFactory:", factoryAddress);
  
  console.log("\n📝 Save these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${usdcAddress}`);
  console.log(`NEXT_PUBLIC_POOL_FACTORY_ADDRESS=${factoryAddress}`);
  
  console.log("\n🔗 View on Polygonscan:");
  console.log(`USDC: https://amoy.polygonscan.com/address/${usdcAddress}`);
  console.log(`Factory: https://amoy.polygonscan.com/address/${factoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });