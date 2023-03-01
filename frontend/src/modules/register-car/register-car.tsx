import React, {FC, useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import Input from "../../components/input/input";
import classNames from "classnames";
import css from './register-car.module.scss';
import Checkbox from "../../components/checkbox/checkbox";
import Button from "../../components/button/button";
import {Car} from "../../interfaces/car";
import {ChangeEventType} from "../../types/global.types";
import CarOwnership from "../../artifacts/contracts/carownership.sol/CarOwnership.json";
import CarList from "../../components/car-list/car-list";
import {CAR_OWNERSHIP_ADDRESS} from "../../constants/addresses";
import ethers from 'ethers';

const RegisterCar: FC = () => {
    const [newCar, setNewCar] = useState<Car>({
        id: 0,
        chassisNumber: 0,
        mileage: 0,
        price: 0,
        licensePlate: "",
        brand: "",
        carType: "",
        colour: "",
        pictures: [],
        isForSale: false
    });
    const [cars, setCars] = useState<Car[]>([]);
    const [activeCar, setActiveCar] = useState<Car>();

    const [mileageLoading, setMileageLoading] = useState<boolean>(false);
    const [addCarLoading, setAddCarLoading] = useState<boolean>(false);

    const [publicKey, setPublicKey] = useState<string>("");

    const requestAccount = async () => {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        // if Metamask exists
        if (typeof (window as any).ethereum !== "undefined") {
            setAddCarLoading(true);
            await requestAccount();

            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner(publicKey);

            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            const transaction = await contract.createCar(
                newCar.chassisNumber, newCar.mileage, newCar.price, newCar.licensePlate,
                newCar.brand, newCar.carType, newCar.colour, newCar.pictures, newCar.isForSale
            );
            await transaction.wait();
            getCarsFromBlockchain();
        }
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
                        pictures: [],
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

    const handleChassisChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, chassisNumber: +event.target.value}
        })
    }

    const handleMileageChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, mileage: +event.target.value}
        })
    }

    const handlePriceChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, price: +event.target.value}
        })
    }

    const handleLicensePlateChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, licensePlate: event.target.value}
        })
    }

    const handleBrandChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, brand: event.target.value}
        })
    }

    const handleCarTypeChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, carType: event.target.value}
        })
    }

    const handleColourChange = (event: ChangeEventType) => {
        setNewCar((prevState) => {
            return {...prevState, colour: event.target.value}
        })
    }

    const handleToggleForSale = () => {
        setNewCar((prevState) => {
            return {...prevState, isForSale: !newCar.isForSale}
        })
    }

    const handleClickCar = (car: Car) => {
        if (activeCar && activeCar.id === car.id) {
            setActiveCar(undefined);
        } else {
            setActiveCar(car);
        }
    }

    const handleUpdateMileage = async () => {
        if (activeCar && (window as any).ethereum !== "undefined") {
            setMileageLoading(true);
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CAR_OWNERSHIP_ADDRESS, CarOwnership.abi, signer);
            try {
                await contract.updateMileage(activeCar.id, newCar.mileage);
                // getCarsFromBlockchain();
            } catch (error) {
                console.log('Error: ', error);
            }
            setMileageLoading(false);
        }
    }

    useEffect(() => {
        getCarsFromBlockchain()
    }, [publicKey])

    return (
        <form onSubmit={handleSubmit}>
            <div className={css.center}>
                <div className={css.limitWidth}>
                    <Input
                        className={classNames(css.publicKey, "mt-3")}
                        valid={true}
                        disabled={false}
                        label="Public key:"
                        onChange={(event: ChangeEventType) => setPublicKey(event.target.value)}
                    />
                    <h2 className={classNames(css.title, "mt-3")}>Submit car details</h2>
                    <Row className="mt-3">
                        <Col sm={12} md={6} lg={6}>
                            <Input
                                valid={true}
                                disabled={false}
                                label="Chassis Number"
                                type="number"
                                className="mb-2"
                                onChange={handleChassisChange}
                            />
                            <Input
                                valid={true}
                                disabled={false}
                                label="Mileage"
                                type="number"
                                className="mb-2"
                                onChange={handleMileageChange}
                            />
                            <Input
                                valid={true}
                                disabled={false}
                                label="Price"
                                type="number"
                                className="mb-2"
                                onChange={handlePriceChange}
                            />
                            <Input
                                valid={true}
                                disabled={false}
                                label="License Plate"
                                className="mb-2"
                                onChange={handleLicensePlateChange}
                            />
                            <Input
                                valid={true}
                                disabled={false}
                                label="Brand"
                                className="mb-2"
                                onChange={handleBrandChange}
                            />
                        </Col>
                        <Col sm={12} md={6} lg={6}>
                            <Input
                                valid={true}
                                disabled={false}
                                label="Car Type"
                                className="mb-2"
                                onChange={handleCarTypeChange}
                            />
                            <Input
                                valid={true}
                                disabled={false}
                                label="Colour"
                                className="mb-2"
                                onChange={handleColourChange}
                            />
                            <div>
                                <div className={classNames(css.forSaleDiv, "mt-5")}>
                                    <p className="me-2 mb-4">Is the car for sale?</p>
                                    <Checkbox
                                        checked={newCar.isForSale}
                                        onClick={handleToggleForSale}
                                    />
                                </div>
                                <Button disabled={publicKey === ""} loading={addCarLoading} type="submit">Submit</Button>
                            </div>
                        </Col>
                    </Row>
                    <h2 className={classNames(css.title, "mt-3")}>Your cars</h2>
                    <Row>
                        <Col>
                            <CarList activeCar={activeCar} onClickCar={handleClickCar} cars={cars}/>
                            {cars.length > 0 && <Button loading={mileageLoading} disabled={!activeCar} type="button" onClick={handleUpdateMileage}>Update Mileage</Button>}
                        </Col>
                    </Row>
                </div>
            </div>
        </form>
    )
}

export default RegisterCar;