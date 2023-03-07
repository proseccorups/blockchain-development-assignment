import React, {ChangeEvent, FC, Dispatch, SetStateAction, SyntheticEvent} from 'react';
import {Car} from "../../interfaces/car";
import Input from "../input/input";
import classNames from "classnames";
import css from "../../modules/register-car/register-car.module.scss";
import {Col, Row} from "react-bootstrap";
import Checkbox from "../checkbox/checkbox";
import Button from "../button/button";
import {Buffer} from "buffer";

interface CarFormProps {
    newCar: Car;
    changeCarValues: Dispatch<SetStateAction<Car>>;
    changeIpfsFile: Dispatch<SetStateAction<File | undefined>>
    onSubmit: () => void;
    onChangePublicKey: (key: string) => void;
    loading: boolean;
    buttonDisabled: boolean;
}
const CarForm: FC<CarFormProps> = ({newCar, changeCarValues, changeIpfsFile, onSubmit, onChangePublicKey, loading, buttonDisabled}) => {

    const handleChanges = (event: ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case "Chassis Number": changeCarValues({...newCar, chassisNumber: +event.target.value}); break;
            case "Mileage": changeCarValues({...newCar, mileage: +event.target.value}); break;
            case "Price": changeCarValues({...newCar, price: +event.target.value}); break;
            case "License Plate": changeCarValues({...newCar, licensePlate: event.target.value}); break;
            case "Brand": changeCarValues({...newCar, brand: event.target.value}); break;
            case "Car Type": changeCarValues({...newCar, carType: event.target.value}); break;
            case "Colour": changeCarValues({...newCar, colour: event.target.value}); break;
        }
    }

    const retrieveFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const data = event.target.files[0];
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(data);
            reader.onloadend = () => {
                // @ts-ignore
                changeIpfsFile(Buffer(reader.result));
            }
        }

        event.preventDefault();
    }

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        const form: HTMLFormElement = event.target as HTMLFormElement;
        form.reset();
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input
                className="mt-3"
                valid={true}
                disabled={false}
                label="Public key:"
                onChange={(event: ChangeEvent<HTMLInputElement>) => onChangePublicKey(event.target.value)}
            />
            <h2 className={classNames(css.title, "mt-3")}>Submit car details</h2>
            <Row className="mt-3">
                <Col sm={12} md={6} lg={6}>
                    <Input
                        value={String(newCar.chassisNumber)}
                        name="Chassis Number"
                        valid={true}
                        disabled={false}
                        label="Chassis Number"
                        type="number"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                    <Input
                        value={String(newCar.mileage)}
                        name="Mileage"
                        valid={true}
                        disabled={false}
                        label="Mileage"
                        type="number"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                    <Input
                        value={String(newCar.price)}
                        name="Price"
                        valid={true}
                        disabled={false}
                        label="Price"
                        type="number"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                    <Input
                        value={newCar.licensePlate}
                        name="License Plate"
                        valid={true}
                        disabled={false}
                        label="License Plate"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                    <Input
                        value={newCar.brand}
                        name="Brand"
                        valid={true}
                        disabled={false}
                        label="Brand"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                </Col>
                <Col sm={12} md={6} lg={6}>
                    <Input
                        value={newCar.carType}
                        name="Car Type"
                        valid={true}
                        disabled={false}
                        label="Car Type"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                    <Input
                        value={newCar.colour}
                        name="Colour"
                        valid={true}
                        disabled={false}
                        label="Colour"
                        className="mb-2"
                        onChange={handleChanges}
                    />
                    <div className={classNames(css.forSaleDiv, "mt-5")}>
                        <p className="me-2 mb-4">Is the car for sale?</p>
                        <Checkbox
                            checked={newCar.isForSale}
                            onClick={() => changeCarValues({...newCar, isForSale: !newCar.isForSale})}
                        />
                    </div>
                    <Input
                        label="Picture"
                        name="Picture"
                        valid={true}
                        disabled={false}
                        type="file"
                        onChange={retrieveFile}
                    />
                    <Button disabled={buttonDisabled} loading={loading} type="submit">Submit</Button>
                </Col>
            </Row>
        </form>
    )
}

export default CarForm;
