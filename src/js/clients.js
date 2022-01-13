App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });;
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('ClientsContract.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var InvoiceContract = data;
      App.contracts.Adoption = TruffleContract(InvoiceContract);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.create-customer', App.createCustomer);
    console.log("Create Customer clicked");
  },

  createCustomer: function(event) {
    event.preventDefault();
    
    var customer_name = document.getElementById('customerName').value;
    var wallet_address = parseInt(document.getElementById('walletAddress').value);

    var invoiceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        invoiceInstance = instance;
    
        // Execute createInvoice as a transaction by sending account
        return invoiceInstance.createClient(customer_name, wallet_address, {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  },

  
};

$(function() {
  $(window).load(function() {
    console.log("tttttttttttttttttttttt");
    App.init();
  });
});
