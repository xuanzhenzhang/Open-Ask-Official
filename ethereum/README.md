# Integration guide

Here are the workflows for using StandardBounties with OpenAsk:

- [Create a bounty](#create-a-question)
- [Fulfill a bounty](#fulfill-a-bounty)
- [Accept a fulfillment](#accept-a-fulfillment)
- [Kill a bounty](#kill-a-bounty)
- [Change bounty data](#change-bounty-data)
- [Change fulfillment data](#change-fulfillment-data)
- [Increase bounty payout](#increase-bounty-payout)
- [Increase fulfillment payout](#increase-fulfillment-payout)
- [Contribute to a bounty](#contribute-to-a-bounty)
- [Refund a contribution](#refund-a-contribution)
- [Refund a fulfillment](#refund-a-fulfillment)
- [Refund a bounty](#refund-a-bounty)
- [Activate a bounty](#activate-a-bounty)
- [Deactivate a bounty](#deactivate-a-bounty)
- [Transfer ownership of a bounty](#transfer-ownership-of-a-bounty)
- [Transfer ownership of a fulfillment](#transfer-ownership-of-a-fulfillment)
- [Change bounty fulfillment amount](#change-bounty-fulfillment-amount)
- [Change bounty deadline](#change-bounty-deadline)
- [Change bounty arbiter](#change-bounty-arbiter)
- [Change bounty contributor](#change-bounty-contributor)
- [Change bounty data](#change-bounty-data)

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