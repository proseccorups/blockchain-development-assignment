import React, {FC} from 'react';
import {Car} from "../../interfaces/car";
import css from './car-list.module.scss';
import CarCard from "../car-card/car-card";


interface CarListProps {
    cars: Car[];
}

const CarList: FC<CarListProps> = ({cars}) => {
    return (
        <div className={css.root}>
            {cars.map((car: Car) =>
                <CarCard car={car}/>
            )}
        </div>
    )
}

export default CarList;