# Integration guide

Here are the workflows for using StandardBounties with OpenAsk:

- [Create a question](#create-a-question)
- [Answer a question and withdraw amount](#answer-a-question-and-withdraw-amount)
- [Withdraw funds if the question is not answered and the deadline has passed](#withdraw-funds-if-the-question-is-not-answered-and-the-deadline-has-passed)
- [Eavesdrop](#eavesdrop)


### Create a question
To create a question, a user will need to sign a transaction with the following parameters:
```solidity
function issueAndContribute(
    address payable _sender,
    address payable[] memory _issuers,
    address[] memory _approvers,
    string memory _data,
    uint _deadline,
    address _token,
    uint _tokenVersion,
    uint _depositAmount)
    public
    payable
    returns(uint)
```
- `_sender` is the address of the user who is creating the question
- `_issuers` is the list of addresses which have control over the question in the smart contract side. They'll be able to do things like add new issuers, add new approvers, change the data of the question, change the deadline, withdraw from the bounty amount (even before the deadline has lapsed!). If you want the user to have control over this, then set this to the questioner's address. If not, then set it to your server's address. You could also set it to the 0x0 address if you want no one to have these admin powers.
- `_approvers` is the list of addresses that can approve the submission to claim the reward. Any approver can approve the submission. You should set this to the Sensei if you want them to claim the reward by themself without any need of further approval (just for the hackathon). Later on, it should point to a multisig wallet which requires a signature from both the Sensei and OpenAsk.
- `_data` is the link to the question. It is intended to be an ipfs hash that follows the json schema [here](https://github.com/Bounties-Network/StandardBounties/blob/master/docs/standardSchemas.md). This can be done in the future.
- `_deadline` is the unix timestamp of the deadline for the question. If the question is not answered by this time, then the questioner can cancel the question and get their deposit back.
- `_token` is the address of the token that the questioner is using to pay for the question. If the questioner is paying in ETH, then this should be set to the 0x0 address (It doesn't actually matter what address it is set to).
- `_tokenVersion` is the currency that the questioner is using to pay for the question. If the questioner is paying in ETH, then this should be set to 0. If using ERC20, it should be set to 20. If using ERC721, it should be set to 721.
- `_depositAmount` is the amount of tokens that the questioner is paying for the question. If the questioner is paying in ETH, then this should be set to the amount of ETH that they are paying (measured in wei).
- `returns(uint)` is the id of the question (bounty in the smart contract) that was created.
- payable -> submit ETH as part of the transaction if intending to fund the question in ETH. Otherwise, leave the amount as 0.

### Answer a question and withdraw amount
To answer a question, a Sensei will need to sign a transaction with the following parameters:
```solidity
function fulfillAndAccept(
    address _sender,
    uint _bountyId,
    address payable[] memory _fulfillers,
    string memory _data,
    uint _approverId,
    uint[] memory _tokenAmounts)
    public
    senderIsValid(_sender)
```

- `_sender` is the address of the Sensei who is answering the question
- `_bountyId` is the id of the question (from the smart contract) that the Sensei is answering
- `_fulfillers` is the list of addresses who should receive the payment. This should be set to the Sensei's address. In the future, you can do things like have joint answers, and pay out the reward to multiple addresses, or take a fee by having the Sensei's address as one of the fulfillers.
- `_data` is the link to the answer/submission. It is intended to be an ipfs hash that follows the json schema [here](https://github.com/Bounties-Network/StandardBounties/blob/master/docs/standardSchemas.md). This can be done in the future.
- `_approverId` is the index of the approver in the list of approvers that is approving the submission. This should be set to 0 since there is only one approver.
- `_tokenAmounts` is the list of amounts of tokens that should be paid out, corresponding with the same indices as the fulfillers array. If the approver is paying in ETH, then this should be set to the amount of ETH that they are paying (measured in wei).

### Withdraw funds if the question is not answered and the deadline has passed
When a user's question has not been answered within the deadline, they can withdraw their deposit. If they don't withdraw their deposit, then the questioner will lose their deposit. To withdraw the deposit, a user will need to sign a transaction with the following parameters:
```solidity
function refundMyContributions(
    address _sender,
    uint _bountyId,
    uint[] memory _contributionIds)
    public
    senderIsValid(_sender)
```

- `_sender` is the address of the user who is withdrawing their deposit
- `_bountyId` is the id of the question (from the smart contract) that the user is withdrawing their deposit from.
- `_contributionIds` is the list of indices of contributions a user has made to a question. This should just be the index 0 when there is only one contribution, which is the case at the start, and for most of the time.

### Eavesdrop

### [Optional] Change question data

### [Optional] Contribute to reward pool

# Testing

To run tests, run the command 
```bash
forge test -vv --fork-url https://cloudflare-eth.com/    
```
Other rpc urls are available. See https://ethereumnodes.com/ for the list.

# Deployment

To deploy the contracts, run the command:
```bash
npx hardhat run scripts/deploy.ts --network NETWORK_NAME
```
where `NETWORK_NAME` is the name of the network you want to deploy to. For example, `optimism` or `mainnet`.

To verify the contracts, run:
```bash
npx hardhat verify --network NETWORK_NAME DEPLOYED_CONTRACT_ADDRESS "CONSTRUCTOR_ARGUMENTS"
```

# Networks
The Standard Bounties contract is deployed at:
- Goerli [0x5AE8138B79ad83184Eb484Ba3C0889F297820482](https://goerli.etherscan.io/address/0x5AE8138B79ad83184Eb484Ba3C0889F297820482)
- Base [0x34141bE35aC2aB6568D9cD7a23281101Fe79edb3](https://goerli.basescan.org/address/0x34141bE35aC2aB6568D9cD7a23281101Fe79edb3)


The Eavesdrop contract is deployed at:
- Goerli [0x71eF71145a1C2cb479A1289703A306D17338821B](https://goerli.etherscan.io/address/0x71eF71145a1C2cb479A1289703A306D17338821B)
- Base [0xD836288Df42e0Df860ec683F2c78702d05eceF02](https://goerli.basescan.org/address/0xD836288Df42e0Df860ec683F2c78702d05eceF02)