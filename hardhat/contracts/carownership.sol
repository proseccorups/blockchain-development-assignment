// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./erc721.sol";
import "./cardetails.sol";
import "./safemath.sol";
import "hardhat/console.sol";

contract CarOwnership is CarDetails, ERC721 {
    using SafeMath for uint256;
    using SafeMath32 for uint32;

    mapping(uint => address) carApprovals;
    mapping(address => uint32) wallets;

    function balanceOf(address _owner) external override view returns (uint256) {
        return ownerCarCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external override view returns (address) {
        return carToOwner[uint32(_tokenId)];
    }

    function getWalletBalance(address _address) external view returns (uint32) {
        return wallets[_address];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCarCount[_to] = ownerCarCount[_to].add(1);
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].sub(1);
        carToOwner[uint32(_tokenId)] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function addEtherToYourWallet() external payable {
        wallets[msg.sender] = wallets[msg.sender].add(uint32(msg.value));
    }

    function withdrawEtherFromWallet() external payable {
        uint32 amount = wallets[msg.sender];
        require(amount > 0, "You have no muney");
        wallets[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "withdrawal failed ouleh");
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external override payable {
        require(cars[_tokenId].isForSale,  "This car is not for sale");
        require(carToOwner[uint32(_tokenId)] != msg.sender, "You already own this car so you can not buy it");
        uint32 carPrice = cars[uint32(_tokenId)].price;
        require(carPrice > 0, "Price must be greater than zero");
        (bool success, ) = _from.call{value: carPrice * 1 ether}("");
        require(success, "Ether transfer failed.");
        wallets[msg.sender] = wallets[msg.sender].sub(uint32(carPrice * 1 ether));
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external override payable onlyOwnerOf(uint32(_tokenId)) {
        carApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}