require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('hardhat-abi-exporter');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  abiExporter: {
    path: './abi',
    clear: false,
    flat: true,
  },
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
