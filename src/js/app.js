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
    $.getJSON('InvoiceContract.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var InvoiceContract = data;
      App.contracts.Adoption = TruffleContract(InvoiceContract);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-getInvoice', App.getInvoice);
    $(document).on('click', '.btn-createInvoice', App.createInvoice);
  },

  createInvoice: function(event) {
    event.preventDefault();
    
    var name = parseInt(document.getElementById('name').value);
    var amount = parseInt(document.getElementById('amount').value);

    var invoiceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        invoiceInstance = instance;
    
        // Execute createInvoice as a transaction by sending account
        return invoiceInstance.createInvoice(name, amount, {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  },

  getInvoice: function(event) {
    event.preventDefault();
    var getInvoiceInstance;
    const invoiceId = parseInt(document.getElementById('invoiceId').value);

    App.contracts.Adoption.deployed().then(function(instance) {
      getInvoiceInstance = instance;
      return getInvoiceInstance.getInvoice(invoiceId);
    }).then(result => {

      document.getElementById('read-result').innerHTML =  `Name: ${result[0]} Amount: ${result[1]}`;
    })
    .catch(_e => {
      document.getElementById('read-result').innerHTML = _e;
    }); 
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
