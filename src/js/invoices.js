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
    console.log("event attachment entry");
    $(document).on('click', '.get-next-unpaid-invoice', App.getNextUnpaidInvoice);
    $(document).on('click', '.create-invoice', App.createInvoice);
    $(document).on('click', '.pay-invoice', App.payInvoice);
    console.log("Inside invoices.js attached");
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

  getNextUnpaidInvoice: function(event) {
    event.preventDefault();
    var getInvoiceInstance;
    console.log("getting Unpaid Invoices");
    //const invoiceId = parseInt(document.getElementById('invoiceId').value);

    App.contracts.Adoption.deployed().then(function(instance) {
      getInvoiceInstance = instance;
      return getInvoiceInstance.getNextUnpaidInvoice();
    }).then(result => {
      document.getElementById('inputInvoiceId').value =  `${result[0]}`;
      document.getElementById('inputCustomer').value =  `${result[1]}`;

      const weiValue = `${result[2]}`; //web3.fromWei(`${result[2]}`, 'ether');
      document.getElementById('inputAmount').value =  weiValue;

//      document.getElementById('inputDueDate').value =  `${result[3]}`;
      document.getElementById('inputComments').value =  `${result[4]}`;

      document.getElementById('inputPayFrom').value =  `${result[7]}`;
      document.getElementById('inputPayTo').value =  `${result[6]}`;

    })
    .catch(_e => {
      document.getElementById('inputInvoiceId').value = "";
      document.getElementById('inputCustomer').value =  "";

      const weiValue = `${result[2]}`; //web3.fromWei(`${result[2]}`, 'ether');
      document.getElementById('inputAmount').value =  "";

//      document.getElementById('inputDueDate').value =  `${result[3]}`;
      document.getElementById('inputComments').value = "";

      document.getElementById('inputPayFrom').value =  "";
      document.getElementById('inputPayTo').value = "";
    }); 
  },

  payInvoice: function(event) {
    event.preventDefault();
    console.log("Pay Invoice button clicked");
    var customer_wallet = document.getElementById('inputCustomer').value;
    var invoice_amount = document.getElementById('inputAmount').value;
    var invoice_payment_To = document.getElementById('inputPayTo').value;
    var invoice_id = document.getElementById('inputInvoiceId').value;

    const weiValue = web3.toWei(invoice_amount, 'ether');
    console.log(weiValue);

    var invoice_comments = document.getElementById('inputComments').value;
    //var invoice_due_date_gregorian = document.getElementById('inputDueDate').value;
    //var invoice_due_date_unix = (new Date(invoice_due_date_gregorian).getTime())/1000;
    
    var invoiceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];

      console.log("from:"+customer_wallet+" To:"+account);
    
      App.contracts.Adoption.deployed().then(function(instance) {
        invoiceInstance = instance;

      //Initiate sendTransaction
      var tx = web3.eth.sendTransaction({ 
        from: account,
        gasPrice: "20000000000",
        gas: "21000",
        to: invoice_payment_To, 
        value: weiValue,
        data: ""
       }, function(err, transactionHash) {
        if (!err) 
        console.log("Txn Hash"+transactionHash);
      })
      App.contracts.Adoption.deployed().then(function(instance) {
        getInvoiceInstance = instance;
        return getInvoiceInstance.updateInvoice(invoice_id, "Completed", {from: account});
      }).then(result => {
        document.getElementById('paymentStatus').innerHTML =  'Payment Successful!';
  
      })
      .catch(_e => {
        document.getElementById('paymentStatus').innerHTML = _e;
      }); 
      }).catch(function(err) {
          console.log("Pay Invoice error!!");
        console.log(err.message);
      });

    });
    
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
