// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AssignmentToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event TokensMinted(address indexed minter, address indexed to, uint256 amount);
    event TokensBurned(address indexed burner, uint256 amount);
    event AirdropClaimed(address indexed user, uint256 amount);

    mapping(address => bool) public airdropClaimed;
    uint256 public constant AIRDROP_AMOUNT = 100 * 10**18; // 100 Tokens

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount* 10**18);
        emit TokensMinted(msg.sender, to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount* 10**18);
        emit TokensBurned(msg.sender, amount);
    }

    function grantMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
    }

    function claimAirdrop() external {
        require(!airdropClaimed[msg.sender], "Airdrop already claimed!");
        airdropClaimed[msg.sender] = true;
        _mint(msg.sender, AIRDROP_AMOUNT);
        emit AirdropClaimed(msg.sender, AIRDROP_AMOUNT);
    }

    function getUserRole(address account) public  view returns (uint8) {
        if (hasRole(DEFAULT_ADMIN_ROLE, account)) {
            return 2;
        } else if (hasRole(MINTER_ROLE, account)) {
            return 1;
        } else {
            return 0;
        }
    }
}
