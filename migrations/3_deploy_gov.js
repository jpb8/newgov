var GovernmentFactory = artifacts.require("./governments/GovernmentFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(GovernmentFactory);
};