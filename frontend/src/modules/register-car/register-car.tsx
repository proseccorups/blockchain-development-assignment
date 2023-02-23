import React, {FC, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import Input from "../../components/input/input";
import classNames from "classnames";
import css from './register-car.module.scss';
import Checkbox from "../../components/checkbox/checkbox";
import Button from "../../components/button/button";
import {Car} from "../../interfaces/car";
import {ChangeEventType} from "../../types/global.types";

const RegisterCar: FC = () => {
    const [newCar, setNewCar] = useState<Car>({
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

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        console.log(newCar);
    }

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

    return (
        <Row>
            <Col>
                <form onSubmit={handleSubmit}>
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
                                <Button type="submit">Submit</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        </Row>
    )
}

export default RegisterCar;