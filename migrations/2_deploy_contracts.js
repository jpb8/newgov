var MiniMeTokenFactory = artifacts.require("./tokens/MiniMeTokenFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(MiniMeTokenFactory);
};
