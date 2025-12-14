// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PartOwnPool.sol";

contract PoolFactory {
    address public immutable usdc;
    address[] public allPools;
    mapping(address => address[]) public poolsByCreator;
    
    event PoolCreated(
        address indexed poolAddress,
        address indexed creator,
        string name,
        uint256 totalShares,
        uint256 sharePrice
    );
    
    constructor(address _usdc) {
        usdc = _usdc;
    }
    
    function createPool(
        string memory name,
        string memory symbol,
        string memory metadataCID,
        uint256 totalShares,
        uint256 sharePrice,
        uint256 maintenancePct
    ) external returns (address) {
        PartOwnPool pool = new PartOwnPool(
            msg.sender,
            name,
            symbol,
            metadataCID,
            totalShares,
            sharePrice,
            usdc,
            maintenancePct
        );
        
        address poolAddress = address(pool);
        allPools.push(poolAddress);
        poolsByCreator[msg.sender].push(poolAddress);
        
        emit PoolCreated(poolAddress, msg.sender, name, totalShares, sharePrice);
        
        return poolAddress;
    }
    
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
    
    function getPoolsByCreator(address creator) external view returns (address[] memory) {
        return poolsByCreator[creator];
    }
    
    function getPoolCount() external view returns (uint256) {
        return allPools.length;
    }
}
