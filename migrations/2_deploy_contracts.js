var InvoiceContract = artifacts.require("InvoiceContract");
var ClientsContract = artifacts.require("ClientsContract");

module.exports = function(deployer) {
  deployer.deploy(InvoiceContract);
  deployer.deploy(ClientsContract);
};

