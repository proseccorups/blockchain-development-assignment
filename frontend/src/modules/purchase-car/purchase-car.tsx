import React, {FC, useEffect, useState} from 'react';
import css from './purchase-car.module.scss';
import classNames from "classnames";
import {CAR_OWNERSHIP_ADDRESS} from "../../constants/addresses";
import CarOwnership from "../../artifacts/contracts/carownership.sol/CarOwnership.json";
import {Car} from "../../interfaces/car";
import CarList from "../../components/car-list/car-list";
import Button from "../../components/button/button";
import ethers from 'ethers';

interface PurchaseCarProps {}

const PurchaseCar: FC<PurchaseCarProps> = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [activeCar, setActiveCar] = useState<Car>();

    const requestAccount = async () => {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }

    const handleBuyCar = async () => {
        if (typeof (window as any).ethereum !== "undefined" && activeCar) {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            const ownerAddress: string = await contract.getCarOwner(activeCar.id);
            const buyerAddress = await signer.getAddress();
            console.log(ownerAddress);
            console.log(buyerAddress);
            const transaction = await contract.transferFrom(ownerAddress, buyerAddress, activeCar.id);
            await transaction.wait();
            getCarsForSaleFromBlockchain();
        }
    }

    const getCarsForSaleFromBlockchain = async () => {
        if ((window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, provider);
            try {
                const data: Car[] = await contract.getCarsForSale();
                const newCars: Car[] = [];
                data.forEach((c: Car) => {
                    const car: Car = {
                        id: c.id,
                        chassisNumber: c.chassisNumber,
                        mileage: c.mileage,
                        price: c.price,
                        licensePlate: c.licensePlate,
                        brand: c.brand,
                        carType: c.carType,
                        colour: c.colour,
                        pictures: c.pictures,
                        isForSale: c.isForSale
                    }
                    newCars.push(car);
                })
                setCars((newCars));
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    };

    const handleClickCar = (car: Car) => {
        if (activeCar && activeCar.id === car.id) {
            setActiveCar(undefined);
        } else {
            setActiveCar(car);
        }
    }

    useEffect(() => {
        getCarsForSaleFromBlockchain();
    }, []);

    return (
        <div className={css.root}>
            <div className={css.limitWidth}>
                <h2 className={classNames(css.title, "mt-3")}>Cars for sale</h2>
                <CarList
                    editable={false}
                    activeCar={activeCar}
                    onClickCar={handleClickCar}
                    cars={cars}
                    updateMileage={() => {}}
                    updatePrice={() => {}}
                />
                <Button disabled={!activeCar} type="button" onClick={handleBuyCar}>Buy car</Button>
            </div>
        </div>
    )
}

export default PurchaseCar;