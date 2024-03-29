import React, {FC, useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import classNames from "classnames";
import css from './register-car.module.scss';
import {Car} from "../../interfaces/car";
import CarOwnership from "../../artifacts/contracts/carownership.sol/CarOwnership.json";
import CarList from "../../components/car-list/car-list";
import {CAR_OWNERSHIP_ADDRESS} from "../../constants/addresses";
import ethers from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import {DEFAULT_CAR_STATE} from "../../constants/cars";
import CarForm from "../../components/car-form/car-form";

const ipfs = ipfsHttpClient({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
});

interface RegisterCarProps {
    publicKey: string;
}

const RegisterCar: FC<RegisterCarProps> = ({publicKey}) => {
    const [newCar, setNewCar] = useState<Car>(structuredClone(DEFAULT_CAR_STATE));
    const [cars, setCars] = useState<Car[]>([]);
    const [activeCar, setActiveCar] = useState<Car>();

    const [addCarLoading, setAddCarLoading] = useState<boolean>(false);

    const [ipfsFile, setIpfsFile] = useState<File | undefined>(undefined);

    const requestAccount = async () => {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }

    const handleAddCar = async () => {
        // if Metamask exists
        if (typeof (window as any).ethereum !== "undefined") {
            setAddCarLoading(true);
            await requestAccount();

            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);

            if (ipfsFile) {
                try {
                    const {path: imageHash} = await ipfs.add(ipfsFile);
                    newCar.pictures.push(imageHash);
                } catch (error: any) {
                    console.log(error.message);
                }
            }

            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            const transaction = await contract.createCar(
                newCar.chassisNumber, newCar.mileage, newCar.price, newCar.licensePlate,
                newCar.brand, newCar.carType, newCar.colour, newCar.pictures, newCar.isForSale
            );
            await transaction.wait();
            getCarsFromBlockchain();
        }
        setNewCar(structuredClone(DEFAULT_CAR_STATE));
        setAddCarLoading(false);
    }

    const getCarsFromBlockchain = async () => {
        if ((window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, provider);

            try {
                const data: Car[] = await contract.getAllCarsForOwner(publicKey);
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
                setCars([]);
            }
        }
    };

    const handleUpdateMileage = async (carId: number, newMileage: number) => {
        if ((window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            try {
                const transaction = await contract.updateMileage(carId, newMileage);
                await transaction.wait();
                getCarsFromBlockchain()
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    }

    const handleUpdatePrice = async (carId: number, newPrice: number) => {
        if ((window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            try {
                const transaction = await contract.updatePrice(carId, newPrice);
                await transaction.wait();
                getCarsFromBlockchain()
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    }

    useEffect(() => {
        getCarsFromBlockchain()
    }, [publicKey])

    return (
        <div className={css.center}>
            <div className={css.limitWidth}>
                <CarForm
                    newCar={newCar}
                    changeCarValues={setNewCar}
                    changeIpfsFile={setIpfsFile}
                    onSubmit={handleAddCar}
                    loading={addCarLoading}
                    buttonDisabled={publicKey === ""}
                />
                <h2 className={classNames(css.title, "mt-3")}>Your cars</h2>
                <Row>
                    <Col>
                        <CarList
                            editable={true}
                            onClickCar={() => {}}
                            activeCar={activeCar}
                            cars={cars}
                            updateMileage={handleUpdateMileage}
                            updatePrice={handleUpdatePrice}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default RegisterCar;