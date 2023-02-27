// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ownable.sol";
import "./safemath.sol";

contract CarDetails is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewCar(Car car);

    struct Car {
        uint chassisNumber;
        uint32 mileage;
        uint32 price;
        string licensePlate;
        string brand;
        string carType;
        string colour;
        string[] pictures;
        bool isForSale;
    }

    Car[] public cars;

    mapping(uint => address) public carToOwner;
    mapping(address => uint) ownerCarCount;

    modifier onlyOwnerOf(uint _carId) {
        require(msg.sender == carToOwner[_carId], "That's not yo car");
        _;
    }

    function createCar(uint _chassisNumber, uint32 _mileage, uint32 _price, string memory _licensePlate, string memory _brand, string memory _carType, string memory _colour, string[] memory _pictures, bool _isForSale) external {
        Car memory newCar = Car(_chassisNumber, _mileage, _price, _licensePlate, _brand, _carType, _colour, _pictures, _isForSale);
        cars.push(newCar);
        uint id = cars.length - 1;
        carToOwner[id] = msg.sender;
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].add(1);
        emit NewCar(newCar);
    }

    function updateMileage(uint _carId, uint32 _newMileage) external onlyOwner {
        require(_newMileage > cars[_carId].mileage, "The new milage must be higher OULEH");
        cars[_carId].mileage = _newMileage;
    }

    function getCar(uint _carId) external view returns (Car memory) {
        return cars[_carId];
    }

    function getAllCarsForOwner(address _owner) external view returns (Car[] memory) {
        Car[] memory result = new Car[](ownerCarCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < cars.length; i++) {
            if (carToOwner[i] == _owner) {
                result[counter] = cars[i];
                counter++;
            }
        }
        return result;
    }

    function toggleSaleState(uint _carId) external onlyOwner {
        cars[_carId].isForSale = !cars[_carId].isForSale;
    }

    function updatePrice(uint _carId, uint32 _newPrice) external onlyOwner {
        cars[_carId].price = _newPrice;
    }

}
