import React, {FC, useEffect, useState} from 'react';
import css from './purchase-car.module.scss';
import classNames from "classnames";
import {CAR_OWNERSHIP_ADDRESS} from "../../constants/addresses";
import CarOwnership from "../../artifacts/contracts/carownership.sol/CarOwnership.json";
import {Car} from "../../interfaces/car";
import CarList from "../../components/car-list/car-list";
import Button from "../../components/button/button";
import ethers from 'ethers';
import Web3 from "web3";

interface PurchaseCarProps {
    publicKey: string;
}

const PurchaseCar: FC<PurchaseCarProps> = ({publicKey}) => {
    const [cars, setCars] = useState<Car[]>([]);
    const [activeCar, setActiveCar] = useState<Car>();
    const [hasBalance, setHasBalance] = useState<boolean>(false);
    const [buyCarLoading, setBuyCarLoading] = useState<boolean>(false);

    const requestAccount = async () => {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }

    const handleBuyCar = async () => {
        if (typeof (window as any).ethereum !== "undefined" && activeCar) {
            setBuyCarLoading(true);
            await requestAccount();

            // Setting up the required values
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            const ownerAddress: string = await contract.getCarOwner(activeCar.id);
            const buyerAddress = await signer.getAddress();
            const carPrice = Web3.utils.toWei(activeCar.price.toString(), 'ether');

            // Retrieve the amount of ether that the buyer has already stored on the contract
            const contractBalance = await contract.getWalletBalance(buyerAddress);

            // If the buyer doesn't have enough ether, the required amount will be added.
            if (contractBalance < carPrice) {
               try {
                   const transaction = await contract.addEtherToYourWallet({value: carPrice});
                   transaction.wait();
               } catch (error) {
                   console.log(error);
                   setBuyCarLoading(false);
                   return;
               }

            }

            try {
                const transaction = await contract.transferFrom(ownerAddress, buyerAddress, activeCar.id);
                await transaction.wait();
            } catch (error) {
                console.log(error);
            }

            const balance = await contract.getWalletBalance(buyerAddress);
            setHasBalance(balance > 0);
            getCarsForSaleFromBlockchain();
            setBuyCarLoading(false);
        }
    }

    const getCarsForSaleFromBlockchain = async () => {
        if ((window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);

            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, provider);
            try {
                const data: Car[] = await contract.getCarsForSale(publicKey);
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

    const checkBalance = async () => {
        if (typeof (window as any).ethereum !== "undefined") {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            const balance = await contract.getWalletBalance(signer.getAddress());
            setHasBalance(balance > 0);
        }
    }

    const refundEtherFromContract = async () => {
        if (typeof (window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            try {
                const transaction = await contract.withdrawEtherFromWallet();
                transaction.wait();
                setHasBalance(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleClickCar = (car: Car) => {
        if (activeCar && activeCar.id === car.id) {
            setActiveCar(undefined);
        } else {
            setActiveCar(car);
        }
    }

    useEffect(() => {
        if (publicKey && publicKey !== '') {
            getCarsForSaleFromBlockchain();
            checkBalance();
        }
    }, [publicKey]);

    return (
        <div className={css.root}>
            <div className={css.limitWidth}>
                {hasBalance &&
                    <>
                        <h4 className={classNames(css.title, "mt-3", "mb-3")}>You currently already have funds on the contract</h4>
                        <Button onClick={refundEtherFromContract} type="button">Withdraw funds from contract</Button>
                    </>
                }
                <h2 className={classNames(css.title, "mt-3")}>Cars for sale</h2>
                <CarList
                    editable={false}
                    activeCar={activeCar}
                    onClickCar={handleClickCar}
                    cars={cars}
                    updateMileage={() => {}}
                    updatePrice={() => {}}
                />
                <Button loading={buyCarLoading} disabled={!activeCar || buyCarLoading} type="button" onClick={handleBuyCar}>Buy car</Button>
            </div>
        </div>
    )
}

export default PurchaseCar;