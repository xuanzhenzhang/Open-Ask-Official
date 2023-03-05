//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Eavesdrop is Ownable, ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(address => uint256) public eavesdropFee;
    mapping(address => uint256) public ethBalances;
    mapping(IERC20 => mapping(address => uint256)) public tokenBalances;

    event Purchased(string responseId, address listener);
    event Paid(address payee, uint256 amount);
    event PaidERC20(address payee, uint256 amount, IERC20 token);
    event ChangeFee(address token, uint256 fee);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function rewardsBalanceETH(address account) public view returns (uint256) {
        return ethBalances[account];
    }

    function rewardsBalanceERC20(address account, IERC20 token) public view returns (uint256) {
        return tokenBalances[token][account];
    }

    function eavesdropETH(string calldata responseId, address[] calldata _payees, uint256[] calldata _shares) public payable {
        require(_payees.length == _shares.length, "Payees and shares mismatch");
        require(_payees.length > 0, "No payees");
        require(_checkShares(_shares), "Shares don't add up to 100%");
        require(eavesdropFee[address(0)] > 0, "Ether is not supported");
        require(msg.value == eavesdropFee[address(0)], "Incorrect payment amount");

        for (uint256 i = 0; i < _payees.length; i++) {
            require(_payees[i] != address(0), "Payee is zero address");
            require(_shares[i] > 0, "Share is zero");
            ethBalances[_payees[i]] += (msg.value * _shares[i] / FEE_DENOMINATOR);
        }

        emit Purchased(responseId, msg.sender);
        _mint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    function eavesdropERC20(string calldata responseId, address[] calldata _payees, uint256[] calldata _shares, IERC20 token, uint256 amount) public {
        require(_payees.length == _shares.length, "Payees and shares mismatch");
        require(_payees.length > 0, "No payees");
        require(_checkShares(_shares), "Shares don't add up to 100%");
        require(eavesdropFee[address(token)] > 0, "Token is not supported");
        require(amount == eavesdropFee[address(token)], "Incorrect payment amount");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");

        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        for (uint256 i = 0; i < _payees.length; i++) {
            require(_payees[i] != address(0), "Payee is zero address");
            require(_shares[i] > 0, "Share is zero");
            tokenBalances[token][_payees[i]] += (amount * _shares[i] / FEE_DENOMINATOR);
        }

        emit Purchased(responseId, msg.sender);
        _mint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    function eavesdropAndPayETH(string calldata responseId, address[] calldata _payees, uint256[] calldata _shares) public payable {
        require(_payees.length == _shares.length, "Payees and shares mismatch");
        require(_payees.length > 0, "No payees");
        require(_checkShares(_shares), "Shares don't add up to 100%");
        require(eavesdropFee[address(0)] > 0, "Ether is not supported");
        require(msg.value == eavesdropFee[address(0)], "Incorrect payment amount");

        emit Purchased(responseId, msg.sender);

        for (uint256 i = 0; i < _payees.length; i++) {
            uint256 amount = (msg.value * _shares[i]) / FEE_DENOMINATOR;
            payable(_payees[i]).transfer(amount);
            emit Paid(_payees[i], amount);
        }

        _mint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    function eavesdropAndPayERC20(string calldata responseId, address[] calldata _payees, uint256[] calldata _shares, IERC20 token, uint256 amount) public {
        require(_payees.length == _shares.length, "Payees and shares mismatch");
        require(_payees.length > 0, "No payees");
        require(_checkShares(_shares), "Shares don't add up to 100%");
        require(eavesdropFee[address(token)] > 0, "Token is not supported");
        require(amount == eavesdropFee[address(token)], "Incorrect payment amount");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");

        for (uint256 i = 0; i < _payees.length; i++) {
            uint256 paymentAmount = (amount * _shares[i]) / FEE_DENOMINATOR;
            SafeERC20.safeTransferFrom(token, msg.sender, _payees[i], paymentAmount);
            emit PaidERC20(_payees[i], paymentAmount, token);
        }

        emit Purchased(responseId, msg.sender);
        _mint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    function withdrawETH(address account) public {
        uint256 amount = ethBalances[account];
        emit Paid(account, amount);
        payable(account).transfer(ethBalances[account]);
        ethBalances[account] = 0;
    }

    function withdrawERC20(address account, IERC20 token) public {
        uint256 amount = tokenBalances[token][account];
        emit PaidERC20(account, amount, token);
        SafeERC20.safeTransfer(token, account, amount);
        tokenBalances[token][account] = 0;
    }

    function changeEavesdropFee(address token, uint256 _eavesdropFee) public onlyOwner {
        eavesdropFee[token] = _eavesdropFee;
        emit ChangeFee(token, _eavesdropFee);
    }

    function _checkShares(uint256[] memory _shares) internal pure returns (bool) {
        uint256 sum = 0;
        for (uint256 i = 0; i < _shares.length; i++) {
            sum += _shares[i];
        }
        return sum == FEE_DENOMINATOR;
    }
}
