// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AirdropStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public airdropToken;
    uint256 public airdropEndTime;
    bool public isAirdropSetup;
    
    // Staking contract address
    // Removed stakingContract and snapshotBlock as they are unnecessary
    
    mapping(address => uint256) public allocations;
    mapping(address => bool) public claimed;
    
    uint256 public totalTokensAllocated;
    uint256 public totalTokensClaimed;
    
    event AirdropSetup(address indexed token, uint256 endTime);
    // Removed StakingConfigured event
    event AllocationAdded(address indexed beneficiary, uint256 amount);
    event AllocationBatchAdded(uint256 count);
    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event UnclaimedTokensWithdrawn(address indexed to, uint256 amount);
    event EmergencyTokensWithdrawn(address indexed tokenAddress, address indexed to, uint256 amount);

    constructor(address _tokenAddress, uint256 _endTime, address _stakingContract, uint256 _snapshotBlock) Ownable(msg.sender) {
        airdropToken = IERC20(_tokenAddress);
        airdropEndTime = _endTime;
        // Removed stakingContract and snapshotBlock initialization
        isAirdropSetup = true; // Set to true immediately after construction
        emit AirdropSetup(_tokenAddress, _endTime);
        // Removed StakingConfigured event emission
    }

    function addAllocations(address[] calldata _beneficiaries, uint256[] calldata _amounts) external onlyOwner {
        require(_beneficiaries.length == _amounts.length, "Airdrop: Arrays length mismatch");
        require(_beneficiaries.length > 0, "Airdrop: No beneficiaries provided");
        require(isAirdropSetup, "Airdrop: Not setup yet");
        
        uint256 total = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            require(_beneficiaries[i] != address(0), "Airdrop: Invalid beneficiary address");
            require(_amounts[i] > 0, "Airdrop: Amount must be greater than zero");
            require(!claimed[_beneficiaries[i]], "Airdrop: Beneficiary already claimed");
            
            allocations[_beneficiaries[i]] = _amounts[i];
            total += _amounts[i];
            emit AllocationAdded(_beneficiaries[i], _amounts[i]);
        }
        
        totalTokensAllocated += total;
        emit AllocationBatchAdded(_beneficiaries.length);
    }

    function claimStaking() external nonReentrant {
        require(isAirdropSetup, "Airdrop: Not setup yet");
        require(block.timestamp <= airdropEndTime || airdropEndTime == 0, "Airdrop: Claim period ended");
        require(!claimed[msg.sender], "Airdrop: Already claimed");
        
        // Removed snapshot block verification logic
        uint256 amount = allocations[msg.sender];
        require(amount > 0, "Airdrop: No allocation for beneficiary");
        
        claimed[msg.sender] = true;
        totalTokensClaimed += amount;
        
        airdropToken.safeTransfer(msg.sender, amount);
        emit TokensClaimed(msg.sender, amount);
    }

    function getClaimableAmount(address _user) external view returns (uint256) {
        if (claimed[_user]) return 0;
        return allocations[_user];
    }

    function hasClaimed(address _user) external view returns (bool) {
        return claimed[_user];
    }

    function withdrawUnclaimedTokens() external onlyOwner {
        require(airdropEndTime > 0 && block.timestamp > airdropEndTime, "Airdrop: Claim period not ended");
        uint256 unclaimed = totalTokensAllocated - totalTokensClaimed;
        require(unclaimed > 0, "Airdrop: No unclaimed tokens");
        
        airdropToken.safeTransfer(owner(), unclaimed);
        emit UnclaimedTokensWithdrawn(owner(), unclaimed);
    }

    function emergencyWithdrawTokens(address _tokenContractAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenContractAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "Airdrop: No tokens to withdraw");
        
        token.safeTransfer(owner(), balance);
        emit EmergencyTokensWithdrawn(_tokenContractAddress, owner(), balance);
    }
}
