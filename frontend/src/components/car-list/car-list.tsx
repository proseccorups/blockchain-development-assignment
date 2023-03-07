import React, {FC} from 'react';
import {Car} from "../../interfaces/car";
import css from './car-list.module.scss';
import CarCard from "../car-card/car-card";

interface CarListProps {
    onClickCar: (car: Car) => void;
    activeCar?: Car;
    cars: Car[];
    editable: boolean;
    updatePrice: (carId: number, newMileage: number) => void;
    updateMileage: (carId: number, newMileage: number) => void;
}

const CarList: FC<CarListProps> = ({cars, onClickCar, activeCar, editable, updatePrice, updateMileage}) => {
    return (
        <div className={css.root}>
            {cars.map((car: Car) =>
                <CarCard
                    active={activeCar!! && activeCar.id === car.id}
                    onClick={(car) => onClickCar(car)}
                    key={car.id}
                    car={car}
                    editable={editable}
                    updatePrice={(newPrice: number) => updatePrice(car.id, newPrice)}
                    updateMileage={(newMileage: number) => updateMileage(car.id, newMileage)}
                />
            )}
        </div>
    );
};

export default CarList;