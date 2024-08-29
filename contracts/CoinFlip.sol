// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoinFlip {
    address public owner;

    event BetPlaced(address indexed user, bool choice, uint256 amount);
    event Result(address indexed user, bool win, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool _choice) public payable {
        uint256 _amount = msg.value; // Use the amount sent with the transaction
        uint256 MIN_BET_AMOUNT = 0.001 ether;

        require(_amount >= MIN_BET_AMOUNT, "Amount must be greater than or equal to minimum bet amount");
        require(address(this).balance >= _amount * 2, "Insufficient balance in contract");

        // Emit an event for the placed bet
        emit BetPlaced(msg.sender, _choice, _amount);

        // Generate randomness
        uint256 randomness = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)));
        bool win = (randomness % 2 == 0);

        if (win == _choice) {
            // Double the amount and send it back to the user if they win
            payable(msg.sender).transfer(_amount * 2);
            // Emit the result of the coin flip
            emit Result(msg.sender, true, _amount);
        } else {
            // Optionally emit an event to log the loss
            emit Result(msg.sender, false, _amount);
        }
    }


    // Allow the owner to withdraw funds from the contract
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to receive Ether directly
    receive() external payable {}
}