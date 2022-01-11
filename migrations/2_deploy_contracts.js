var InvoiceContract = artifacts.require("InvoiceContract");

module.exports = function(deployer) {
  deployer.deploy(InvoiceContract);
};
