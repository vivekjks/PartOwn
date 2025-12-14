// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PartOwnPool is ERC20, ReentrancyGuard, Ownable {
    IERC20 public immutable usdc;
    
    string public metadataCID;
    uint256 public sharePrice;
    uint256 public maintenancePct;
    uint256 public maintenanceFund;
    uint256 public totalRevenue;
    uint256 public claimedRevenue;
    
    struct Booking {
        address user;
        uint256 start;
        uint256 end;
        uint256 deposit;
        bool active;
        bool completed;
        string preUseCID;
        string postUseCID;
        string damageReportCID;
    }
    
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    mapping(bytes32 => Booking) public bookings;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    mapping(address => uint256) public claimablePayouts;
    
    event SharesPurchased(address indexed buyer, uint256 shares, uint256 cost);
    event BookingCreated(bytes32 indexed bookingId, address indexed user, uint256 start, uint256 end);
    event DepositLocked(bytes32 indexed bookingId, uint256 amount);
    event CheckIn(bytes32 indexed bookingId, string preUseCID);
    event CheckOut(bytes32 indexed bookingId, string postUseCID);
    event DamageReported(bytes32 indexed bookingId, address indexed reporter, string damageCID);
    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event PayoutDistributed(uint256 amount, uint256 timestamp);
    event PayoutClaimed(address indexed user, uint256 amount);
    
    constructor(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _metadataCID,
        uint256 _totalShares,
        uint256 _sharePrice,
        address _usdc,
        uint256 _maintenancePct
    ) ERC20(_name, _symbol) Ownable(_creator) {
        metadataCID = _metadataCID;
        sharePrice = _sharePrice;
        usdc = IERC20(_usdc);
        maintenancePct = _maintenancePct;
        
        _mint(_creator, _totalShares);
    }
    
    function purchaseShares(uint256 shares) external nonReentrant {
        uint256 cost = shares * sharePrice;
        require(usdc.transferFrom(msg.sender, address(this), cost), "Payment failed");
        
        _transfer(owner(), msg.sender, shares);
        
        emit SharesPurchased(msg.sender, shares, cost);
    }
    
    function createBooking(
        bytes32 bookingId,
        uint256 start,
        uint256 end,
        uint256 deposit
    ) external nonReentrant {
        require(bookings[bookingId].user == address(0), "Booking exists");
        require(balanceOf(msg.sender) > 0, "Must own shares");
        
        if (deposit > 0) {
            require(usdc.transferFrom(msg.sender, address(this), deposit), "Deposit failed");
        }
        
        bookings[bookingId] = Booking({
            user: msg.sender,
            start: start,
            end: end,
            deposit: deposit,
            active: false,
            completed: false,
            preUseCID: "",
            postUseCID: "",
            damageReportCID: ""
        });
        
        emit BookingCreated(bookingId, msg.sender, start, end);
        if (deposit > 0) {
            emit DepositLocked(bookingId, deposit);
        }
    }
    
    function confirmCheckIn(bytes32 bookingId, string memory preUseCID) external {
        Booking storage booking = bookings[bookingId];
        require(booking.user == msg.sender, "Not booking owner");
        require(!booking.active, "Already active");
        
        booking.active = true;
        booking.preUseCID = preUseCID;
        
        emit CheckIn(bookingId, preUseCID);
    }
    
    function confirmCheckOut(bytes32 bookingId, string memory postUseCID) external {
        Booking storage booking = bookings[bookingId];
        require(booking.user == msg.sender, "Not booking owner");
        require(booking.active, "Not active");
        
        booking.active = false;
        booking.completed = true;
        booking.postUseCID = postUseCID;
        
        if (booking.deposit > 0) {
            require(usdc.transfer(msg.sender, booking.deposit), "Refund failed");
            booking.deposit = 0;
        }
        
        emit CheckOut(bookingId, postUseCID);
    }
    
    function reportDamage(bytes32 bookingId, string memory damageCID) external {
        Booking storage booking = bookings[bookingId];
        require(balanceOf(msg.sender) > 0, "Must own shares");
        
        booking.damageReportCID = damageCID;
        
        emit DamageReported(bookingId, msg.sender, damageCID);
    }
    
    function createProposal(string memory description) external returns (uint256) {
        require(balanceOf(msg.sender) > 0, "Must own shares");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.description = description;
        proposal.deadline = block.timestamp + 7 days;
        
        emit ProposalCreated(proposalId, description);
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 weight = balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit Voted(proposalId, msg.sender, support, weight);
    }
    
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.deadline, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
    }
    
    function distributeRevenue(uint256 amount) external onlyOwner nonReentrant {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        uint256 maintenanceAmount = (amount * maintenancePct) / 10000;
        maintenanceFund += maintenanceAmount;
        
        uint256 distributableAmount = amount - maintenanceAmount;
        totalRevenue += distributableAmount;
        
        emit PayoutDistributed(distributableAmount, block.timestamp);
    }
    
    function claimPayout() external nonReentrant {
        uint256 userShares = balanceOf(msg.sender);
        require(userShares > 0, "No shares");
        
        uint256 totalShares = totalSupply();
        uint256 userShare = (totalRevenue * userShares) / totalShares;
        uint256 claimable = userShare - claimablePayouts[msg.sender];
        
        require(claimable > 0, "Nothing to claim");
        
        claimablePayouts[msg.sender] += claimable;
        claimedRevenue += claimable;
        
        require(usdc.transfer(msg.sender, claimable), "Payout failed");
        
        emit PayoutClaimed(msg.sender, claimable);
    }
    
    function getClaimableAmount(address user) external view returns (uint256) {
        uint256 userShares = balanceOf(user);
        if (userShares == 0) return 0;
        
        uint256 totalShares = totalSupply();
        uint256 userShare = (totalRevenue * userShares) / totalShares;
        return userShare - claimablePayouts[user];
    }
}
