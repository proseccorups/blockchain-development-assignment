// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./cardetails.sol";
import "./erc721.sol";
import "./safemath.sol";

contract CarOwnership is CarDetails, ERC721 {
    using SafeMath for uint256;

    mapping(uint => address) carApprovals;

    function balanceOf(address _owner) external override view returns (uint256) {
        return ownerCarCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external override view returns (address) {
        return carToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCarCount[_to] = ownerCarCount[_to].add(1);
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].sub(1);
        carToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external override payable {
        require(carToOwner[_tokenId] == msg.sender || carApprovals[_tokenId] == msg.sender, "You are not allowed to transfer this car");
        _transfer(_from, _to, _tokenId);
    }

    function payCar(uint _carId) payable public {
        uint price = cars[_carId].price;
        payable(msg.sender).transfer(price);
    }

    function approve(address _approved, uint256 _tokenId) external override payable onlyOwnerOf(_tokenId) {
        carApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}