import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: './../frontend/src/artifacts'
  },
  networks: {
    ganache: {
      url: process.env.PROVIDER_URL,
      // accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    hardhat: {
      chainId: 1337,
    },
  },
};

export default config;
