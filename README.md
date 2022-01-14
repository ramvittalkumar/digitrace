# digitrace
Simple, Easy, Fast application to make your invoice payments using Crypto.

## Description
An invoice management system based on truffle , web3.js and ganache.

## Dependencies
* Node.js
* Truffle
* Ganache
* Metamask extension in browser

## Installing

* Clone the digitrace repo location
```
git clone https://github.com/ramvittalkumar/digitrace.git
```
* Open the digitrace folder into Visual Studio Code (or your preferred editor)
* Truffle compile the smart contracts 
```
truffle compile
```
* Truffle migrate the smart contracts into chain
```
truffle migrate --reset
```
* Install lite-server
```
npm install lite-server --save-dev
```
* Start lite-server
```
npm run dev
```
* Import couple of test accounts into metamask using their private keys from Ganache 

## Run
* After the lite-server is up and running, acccess the below url
```
http://localhost:3000/
```
* Congratulations, you have made it to landing page of digitrace!
* Connect your metamask to login (using test account1)
* Add new client from digitrace (using test account1)
* Create a new invoice for the client (using test account1) 
* Open a new browser, login with metamask(using test account2)
* Pay Invoice amount using ETH to testaccount1 wallet address

## Limitations
ETH is the only crypto supported in Digitrace

## Developers
Kaushik (kaushik.mrl@gmail.com)
Ram Vittal (ramvittal@gmail.com)
Sajith Mohideen (sajith.wanderer@gmail.com)
Sayan Mohideen (sayan.wander@gmail.com)

## Acknowledgements
* [truffle](https://trufflesuite.com/tutorial/)
* [eattheblocks](https://github.com/jklepatch/eattheblocks)


