require('@nomiclabs/hardhat-ethers');
require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;
const sepoliaURL = process.env.SEPOLIA_URL;

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: sepoliaURL,
      accounts: [`0x${privateKey}`]
    }
  }
};
