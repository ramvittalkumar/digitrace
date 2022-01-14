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
    $(document).on('click', '.create-invoice', App.createInvoice);
    console.log("Create Invoice event attached");
  },

  createInvoice: function(event) {
    event.preventDefault();
    console.log("Create Invoice button clicked");
    var customer_wallet = document.getElementById('inputCustomer').value;
    var invoice_amount = document.getElementById('inputAmount').value;
    var invoice_comments = document.getElementById('inputComments').value;

    var invoice_due_date_gregorian = document.getElementById('inputDueDate').value;
    var invoice_due_date_unix = (new Date(invoice_due_date_gregorian).getTime())/1000;
    

    var invoiceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        invoiceInstance = instance;
    
        // Execute createInvoice as a transaction by sending account
        return invoiceInstance.createInvoice(customer_wallet, invoice_amount, invoice_due_date_unix, invoice_comments, {from: account});
      }).catch(function(err) {
          console.log("Create Invoice error!!");
        console.log(err.message);
      });
    });
    
  },

  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
