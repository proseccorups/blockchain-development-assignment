// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ownable.sol";
import "./safemath.sol";
import "hardhat/console.sol";

contract CarDetails is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewCar(Car car);

    struct Car {
        uint32 id;
        uint32 chassisNumber;
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

    mapping(uint32 => address) public carToOwner;
    mapping(address => uint) ownerCarCount;

    modifier onlyOwnerOf(uint32 _carId) {
        require(msg.sender == carToOwner[_carId], "That's not yo car");
        _;
    }

    function createCar(uint32 _chassisNumber, uint32 _mileage, uint32 _price, string memory _licensePlate, string memory _brand, string memory _carType, string memory _colour, string[] memory _pictures, bool _isForSale) external {
        Car memory newCar = Car(uint32(cars.length), _chassisNumber, _mileage, _price, _licensePlate, _brand, _carType, _colour, _pictures, _isForSale);
        cars.push(newCar);
        carToOwner[newCar.id] = msg.sender;
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].add(1);
        emit NewCar(newCar);
    }

    function updateMileage(uint _carId, uint32 _newMileage) external onlyOwner {
        require(_newMileage > cars[_carId].mileage, "The new milage must be higher OULEH");
        cars[_carId].mileage = _newMileage;
    }

    function updatePrice(uint _carId, uint32 _newPrice) external onlyOwner {
        cars[_carId].price = _newPrice;
    }

    function getCar(uint _carId) external view returns (Car memory) {
        return cars[_carId];
    }

    function _getOwnerCarCount(address _owner) private view returns (uint) {
        uint result = 0;
        for (uint i = 0; i < cars.length; i++) {
            if (carToOwner[uint32(cars[i].id)] == _owner) {
                result++;
            }
        }
        return result;
    }

    function getAllCarsForOwner(address _owner) external view  returns (Car[] memory) {
        Car[] memory result = new Car[](_getOwnerCarCount(_owner));
        uint counter = 0;
        for (uint i = 0; i < cars.length; i++) {
            if (carToOwner[uint32(i)] == _owner) {
                result[counter] = cars[i];
                counter++;
            }
        }
        return result;
    }

    function _calculateForSaleCarCount() private view returns (uint) {
        uint result = 0;
        for (uint i = 0; i < cars.length; i++) {
            if (carToOwner[uint32(i)] != msg.sender && cars[i].isForSale) {
                result++;
            }
        }
        return result;
    }

    function getCarsForSale() external view returns (Car[] memory) {
        Car[] memory result = new Car[](_calculateForSaleCarCount());
        uint counter = 0;
        for (uint i = 0; i < cars.length; i++) {
            if (carToOwner[uint32(i)] != msg.sender && cars[i].isForSale) {
                result[counter] = cars[i];
                counter++;
            }
        }
        return result;
    }

    function getCarOwner(uint32 _carId) external view returns (address ownerAddress) {
        return carToOwner[_carId];
    }

    function deleteCar(uint32 _carId) external onlyOwnerOf(_carId) {
        for (uint i = 0; i < cars.length; i++) {
            if (cars[i].id == _carId) {
                delete cars[i];
            }
        }
    }

    function toggleSaleState(uint _carId) external onlyOwner {
        cars[_carId].isForSale = !cars[_carId].isForSale;
    }

}