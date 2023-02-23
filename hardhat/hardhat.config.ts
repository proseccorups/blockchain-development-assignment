import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: './../frontend/src/artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};

export default config;
