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


function createInvoice(string memory name, uint amt, uint _dueDate, string memory _comments) public returns (uint){
  invoices.push(Invoice(nextinvoiceId, name, amt, _dueDate, _comments, "Pending", msg.sender, name));
  nextinvoiceId++;
  return nextinvoiceId-1;
}

function getInvoice(uint reqInvoiceId) public view returns (string memory name, uint amt, uint dueDate, string memory comments, string memory status) {
    uint wantedId = find(reqInvoiceId);
    return(invoices[wantedId].name, invoices[wantedId].amount, invoices[wantedId].dueDate, invoices[wantedId].comments, invoices[wantedId].status);
}

function getNextUnpaidInvoice() public view returns (uint invoiceId, string memory name, uint amt, uint dueDate, string memory comments, string memory status, address paymentTo, string memory paymentFrom) {
    uint wantedId = findFirstUnpaidInvoiceId();
    return(invoices[wantedId].invoiceId, invoices[wantedId].name, invoices[wantedId].amount, invoices[wantedId].dueDate, invoices[wantedId].comments, invoices[wantedId].status, invoices[wantedId].payment_to, invoices[wantedId].payment_from);
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

  function findFirstUnpaidInvoiceId() view internal returns(uint) {
    for(uint i = 0; i < invoices.length; i++) {
      string memory currentInvoiceStatus = invoices[i].status;
      string memory statusPending = "Pending";
      if(compareStringsbyBytes(currentInvoiceStatus, statusPending)) {
        return i;
      }
    }
    revert('No unpaid Invoice does not exist!');
  }

  function compareStringsbyBytes(string memory s1, string memory s2) public pure returns(bool){
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
}

}