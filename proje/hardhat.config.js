require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
