// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./erc721.sol";
import "./cardetails.sol";
import "./safemath.sol";
import "hardhat/console.sol";

contract CarOwnership is CarDetails, ERC721 {
    using SafeMath for uint256;

    mapping(uint => address) carApprovals;

    function balanceOf(address _owner) external override view returns (uint256) {
        return ownerCarCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external override view returns (address) {
        return carToOwner[uint32(_tokenId)];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCarCount[_to] = ownerCarCount[_to].add(1);
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].sub(1);
        carToOwner[uint32(_tokenId)] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external override payable {
        require(cars[_tokenId].isForSale,  "This car is not for sale");
        require(carToOwner[uint32(_tokenId)] != msg.sender, "You already own this car so you can not buy it");
        payable(_from).transfer(cars[_tokenId].price);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external override payable onlyOwnerOf(uint32(_tokenId)) {
        carApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}