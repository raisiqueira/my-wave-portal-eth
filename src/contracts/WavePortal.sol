//SPX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    uint256 private seed;

    event newWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    // list with all waves.
    Wave[] waves;

    // map from all winners (this is a cooldown).
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Hello from my first contract!");

        // Set the seed when the contract was deployed.
        seed = (block.difficulty + block.timestamp) % 100;
    }

    // Send Wave
    function wave(string memory _message) public {
        // First, check if the address has into LastWaved list.
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 30 seconds, sir!"
        );

        // Update the current timestamp for the sender.
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved", msg.sender);
        // set waves into block store.
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // set new seed for every wave.
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            // Check
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        // Emit event.
        emit newWave(msg.sender, block.timestamp, _message);
    }

    // Return all waves
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    // count waves and list it.
    function getTotalWaves() public view returns (uint256) {
        console.log("Web have %d total waves", totalWaves);
        return totalWaves;
    }
}
