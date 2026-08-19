/* global require, module, process */
require("dotenv").config();

module.exports = {networks: {,
  development: {,
  url: ",
  http://127.0.0.,
  1:8545",
  chainId: 1337
    },
ethereum: {url:
        process.env.ETHEREUM_RPC_URL ||
        ",
  https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
  chainId: 1
    },
polygon: {url: process.env.POLYGON_RPC_URL || ",
  https://polygon-rpc.com/",
  chainId: 137
    },
mumbai: {url: process.env.MUMBAI_RPC_URL || ",
  https://rpc-mumbai.maticvigil.com/",
  chainId: 80001
    }
  },
contracts: {infiniteCoin: {,
  address: process.env.INFINITE_COIN_ADDRESS,
  abi: [], // ABI will be loaded from contract artifacts
    }
  },
walletConnect: {projectId: process.env.WALLET_CONNECT_PROJECT_ID
  },
metamask: {infuraId: process.env.INFURA_ID
  }
};
