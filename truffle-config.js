module.exports = {
    networks: {
         development: {
               host: "localhost",
               port: 8545,
               network_id: "*", // Match any network id
               gas: 6721975, //from ganache-cli output
               gasPrice: 1000000000, //From ganache-cli output  
          }
     },
     compilers: {
          solc: {
               version: "0.6.6",
               settings: {
                    optimizer: {
                    enabled: true, // Default: false
                    runs: 1000 // Default: 200
                    },
                    evmVersion: "homestead" // Default: "byzantium"
               }
          }
     }
};
