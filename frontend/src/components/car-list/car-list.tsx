import React, {FC} from 'react';
import {Car} from "../../interfaces/car";
import css from './car-list.module.scss';
import CarCard from "../car-card/car-card";

interface CarListProps {
    onClickCar: (car: Car) => void;
    activeCar?: Car;
    cars: Car[];
}

const CarList: FC<CarListProps> = ({cars, onClickCar, activeCar}) => {
    return (
        <div className={css.root}>
            {cars.map((car: Car) =>
                <CarCard
                    active={activeCar!! && activeCar.id === car.id}
                    onClick={(car) => onClickCar(car)}
                    key={car.id}
                    car={car}
                />
            )}
        </div>
    );
};

export default CarList;