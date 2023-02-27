import React, {FC} from 'react';
import {Car} from "../../interfaces/car";
import Card from "../card/card";
import css from './car-card.module.scss';
import classNames from "classnames";

interface CarCardProps {
    car: Car;
}

const CarCard: FC<CarCardProps> = ({car}) => {
    return (
        <Card className={classNames(css.root, "mb-2")}>
            <div className={css.content}>
                <div className={css.imageDiv}>
                    <img className={css.image} src={require("./../../assets/images/lamborgini.png")} alt="could not load"/>
                </div>
                <div className={css.carDetails}>
                    <div className="me-3">
                        <p><b>Chassis number: </b>{car.chassisNumber}</p>
                        <p><b>Mileage: </b>{car.mileage}</p>
                        <p><b>Price: </b>ETH {car.price}</p>
                        <p><b>License plate: </b>{car.licensePlate}</p>
                    </div>
                    <div>
                        <p><b>brand: </b>{car.brand}</p>
                        <p><b>Car type: </b>{car.carType}</p>
                        <p><b>Colour: </b>{car.colour}</p>
                        <p><b>For sale: </b>{car.isForSale ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CarCard;