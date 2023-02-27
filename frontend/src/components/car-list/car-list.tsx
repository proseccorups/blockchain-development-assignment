import React, {FC} from 'react';
import {Car} from "../../interfaces/car";
import css from './car-list.module.scss';
import CarCard from "../car-card/car-card";

interface CarListProps {
    onClickCard: (car: Car) => void;
    activeCar?: Car;
    cars: Car[];
}

const CarList: FC<CarListProps> = ({cars, onClickCard, activeCar}) => {
    return (
        <div className={css.root}>
            {cars.map((car: Car) =>
                <CarCard active={activeCar!! && activeCar.licensePlate === car.licensePlate} onClick={(car) => onClickCard(car)} key={car.licensePlate} car={car}/>
            )}
        </div>
    );
};

export default CarList;