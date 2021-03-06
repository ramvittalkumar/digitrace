pragma solidity ^0.8.0;

contract ClientsContract {

struct Clients { 
      uint clientId;
      string name;
      string walletAddress;
      address owner; 
   }

Clients[] public clients;
uint public nextclientId = 1;

function createClient(string memory _name, string memory _walletAddress) public {
  clients.push(Clients(nextclientId, _name, _walletAddress, msg.sender));
  nextclientId++;
}

function getClient(uint clientId) public view returns (string memory name, string memory walletAddress,address owner) {
    uint wantedId = find(clientId);
    return(clients[wantedId].name, clients[wantedId].walletAddress, clients[wantedId].owner);
}

function find(uint id) view internal returns(uint) {
    for(uint i = 0; i < clients.length; i++) {
      if(clients[i].clientId == id) {
        return i;
      }
    }
    revert('Client does not exist!');
  }

}