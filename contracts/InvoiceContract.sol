pragma solidity ^0.8.0;

contract InvoiceContract {

struct Invoice { 
    uint invoiceId;
    string name;
    uint amount;
    uint dueDate;
    string comments;
    string status;
    address payment_to;
    string payment_from;
}

Invoice[] public invoices;
uint public nextinvoiceId = 1;

function createInvoice(string memory name, uint amt, uint _dueDate, string memory _comments) public {
  invoices.push(Invoice(nextinvoiceId, name, amt, _dueDate, _comments, "Pending", msg.sender, name));
  nextinvoiceId++;
}

function getInvoice(uint reqInvoiceId) public view returns (string memory name, uint amt, uint dueDate, string memory comments, string memory status) {
    uint wantedId = find(reqInvoiceId);
    return(invoices[wantedId].name, invoices[wantedId].amount, invoices[wantedId].dueDate, invoices[wantedId].comments, invoices[wantedId].status);
}

function updateInvoice(uint reqInvoiceId, string memory _status) public {
  uint wantedId = find(reqInvoiceId);
  invoices[wantedId].status = _status;
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