# part 1 
Solidity code of smart contract for ERC 20 
/hardhat_test/contracts/AssignmentToken.sol

# part 2

I would have chose hyperledger fabric for the same since we need permissioned blockchain hyperledger fabric would be the best suitable option as ethereum L2 is public and substrate need more implementation for the same

How consensus will be handled?
there is no need to add other concensus since in permissioned blockchain we use **leader based concensus**

How privacy and selective transaction visibility will be ensured?
hyperledger uses a Channels for selective and private transaction.

What role smart contracts play in your design?
Validating transactions before committing them to the ledger, ensuring integrity and compliance.

# part 3

rust wallet

1️⃣ Clone the Git Repository
```
git clone <repository-url>
cd wallet
```
2️⃣ Build the Project
```
cargo build
```
3️⃣ Run the Wallet Application
### Generate a Wallet
```
cargo run -- generate
```
### Display Public Key

```
cargo run -- show
```
### Sign a Message
``` 
cargo run -- sign "<your message>"
```
### Verify a Signature
``` 
cargo run -- sign "<your message>" <signature-from-previous-command> <your-private-key>
```

# part 4

in substrate-code-template

# part 5

```
cd token_dapp
npm i
```
create a .env file 
REACT_APP_CONTRACT_ADDRESS=0xcd88DC46b0D3F6a9dAB133075F3fDf90854C03B4
use this for testing purpose

```
npm run start 
```
check the logs on blockexplorer by pasting the same contract 

# part 6

buggy solidity code

following are the three bugs I can observe
1. no solidity version and license
2. no require statement message
3. constructor visibility is not needed
4. and contract does not emit any event duw to which it can not track the transaction

fixed code
```
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract BuggyToken {
    uint256 public totalSupply;
    mapping(address => uint256) public balances; //this will optimize gas as we dont need extra getter function
    constructor(uint256 _initialSupply) {
        balances[msg.sender] = totalSupply = _initialSupply;  // this will optimize gas
    }
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount,"insufficint balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}



```
