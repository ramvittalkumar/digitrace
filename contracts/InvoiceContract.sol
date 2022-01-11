pragma solidity ^0.8.0;

contract InvoiceContract {

struct Invoice { 
      uint invoiceId;
      string name;
      uint amount;
   }

Invoice[] public invoices;
uint public nextinvoiceId = 1;

function createInvoice(string memory name, uint amt) public {
  invoices.push(Invoice(nextinvoiceId, name, amt));
  nextinvoiceId++;
}

function getInvoice(uint reqInvoiceId) public view returns (string memory name, uint amt) {
    uint wantedId = find(reqInvoiceId);
    return(invoices[wantedId].name, invoices[wantedId].amount);
}

function find(uint id) view internal returns(uint) {
    for(uint i = 0; i < invoices.length; i++) {
      if(invoices[i].invoiceId == id) {
        return i;
      }
    }
    revert('Invoice does not exist!');
  }

}