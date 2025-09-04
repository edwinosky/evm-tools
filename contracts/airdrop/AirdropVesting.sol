// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AirdropVesting is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public airdropToken;
    uint256 public airdropEndTime;
    bool public isAirdropSetup;
    
    // Vesting configuration
    uint256 public vestingDuration; // Duration of vesting period in seconds
    uint256 public vestingStartTime; // When vesting starts
    
    mapping(address => uint256) public allocations;
    mapping(address => uint256) public released; // Tokens released to each beneficiary
    
    uint256 public totalTokensAllocated;
    uint256 public totalTokensClaimed;
    
    event AirdropSetup(address indexed token, uint256 endTime);
    event VestingConfigured(uint256 startTime, uint256 duration);
    event AllocationAdded(address indexed beneficiary, uint256 amount);
    event AllocationBatchAdded(uint256 count);
    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event UnclaimedTokensWithdrawn(address indexed to, uint256 amount);
    event EmergencyTokensWithdrawn(address indexed tokenAddress, address indexed to, uint256 amount);

    constructor(
        address _tokenAddress,
        uint256 _endTime,
        uint256 _startTime,
        uint256 _duration
    ) Ownable(msg.sender) {
        // Setup Airdrop
        airdropToken = IERC20(_tokenAddress);
        airdropEndTime = _endTime;
        isAirdropSetup = true;
        emit AirdropSetup(_tokenAddress, _endTime);

        // Configure Vesting
        vestingStartTime = _startTime;
        vestingDuration = _duration;
        emit VestingConfigured(_startTime, _duration);
    }

    function addAllocations(address[] calldata _beneficiaries, uint256[] calldata _amounts) external onlyOwner {
        require(_beneficiaries.length == _amounts.length, "Airdrop: Arrays length mismatch");
        require(_beneficiaries.length > 0, "Airdrop: No beneficiaries provided");
        require(isAirdropSetup, "Airdrop: Not setup yet");
        
        uint256 total = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            require(_beneficiaries[i] != address(0), "Airdrop: Invalid beneficiary address");
            require(_amounts[i] > 0, "Airdrop: Amount must be greater than zero");
            require(allocations[_beneficiaries[i]] == 0, "Airdrop: Beneficiary already has an allocation");
            
            allocations[_beneficiaries[i]] = _amounts[i];
            total += _amounts[i];
            emit AllocationAdded(_beneficiaries[i], _amounts[i]);
        }
        
        totalTokensAllocated += total;
        emit AllocationBatchAdded(_beneficiaries.length);
    }

    function claimVest() external nonReentrant {
        require(isAirdropSetup, "Airdrop: Not setup yet");
        require(block.timestamp <= airdropEndTime || airdropEndTime == 0, "Airdrop: Claim period has ended");
        
        uint256 totalAllocation = allocations[msg.sender];
        require(totalAllocation > 0, "Airdrop: No allocation for this address");

        uint256 vestedAmount = _getVestedAmount(msg.sender);
        require(vestedAmount > released[msg.sender], "Airdrop: No tokens available to claim");

        uint256 claimableAmount = vestedAmount - released[msg.sender];
        
        released[msg.sender] += claimableAmount;
        totalTokensClaimed += claimableAmount;
        
        airdropToken.safeTransfer(msg.sender, claimableAmount);
        emit TokensClaimed(msg.sender, claimableAmount);
    }

    function _getVestedAmount(address _beneficiary) internal view returns (uint256) {
        uint256 totalAllocation = allocations[_beneficiary];
        if (block.timestamp < vestingStartTime) {
            return 0;
        }
        if (block.timestamp >= vestingStartTime + vestingDuration) {
            return totalAllocation;
        }
        return (totalAllocation * (block.timestamp - vestingStartTime)) / vestingDuration;
    }

    function getClaimableAmount(address _user) external view returns (uint256) {
        uint256 totalAllocation = allocations[_user];
        if (totalAllocation == 0) return 0;

        uint256 vestedAmount = _getVestedAmount(_user);
        return vestedAmount - released[_user];
    }

    function hasClaimed(address _user) external view returns (bool) {
        return allocations[_user] > 0 && released[_user] == allocations[_user];
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
