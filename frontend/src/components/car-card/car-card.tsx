import React, {ChangeEvent, FC, useState} from 'react';
import {Car} from "../../interfaces/car";
import Card from "../card/card";
import css from './car-card.module.scss';
import classNames from "classnames";
import {Pencil, XLg} from 'react-bootstrap-icons';
import Button from "../button/button";

interface CarCardProps {
    onClick: (car: Car) => void;
    active: boolean;
    car: Car;
    editable: boolean;
    updatePrice: (newPrice: number) => void;
    updateMileage: (newMileage: number) => void;
}

const CarCard: FC<CarCardProps> = ({car, onClick, active, editable, updatePrice, updateMileage}) => {
    const [editMileageMode, setEditMileageMode] = useState<boolean>(false);
    const [editPriceMode, setEditPriceMode] = useState<boolean>(false);
    const [newMileage, setNewMileage] = useState<number>(0);
    const [newPrice, setNewPrice] = useState<number>(0);

    const onClickEditMileage = () => {
        if (editPriceMode) {
            setEditPriceMode(false);
        }
        setEditMileageMode(true);
    }

    const onClickEditPrice = () => {
        if (editMileageMode) {
            setEditMileageMode(false);
        }
        setEditPriceMode(true);
    }

    const onUpdateMileage = () => {
        if ((!(newMileage > car.mileage))) return;
        setEditMileageMode(false);
        updateMileage(newMileage);
    }

    const onUpdatePrice = () => {
        setEditPriceMode(false);
        updatePrice(newPrice)
    }

    const handleClickCancel = () => {
        setEditMileageMode(false);
        setEditPriceMode(false);
        setNewPrice(0);
        setNewMileage(0);
    }

    return (
        <Card onClick={() => onClick(car)}
              className={classNames(css.root, active && css.active, !editable && css.hover)}>
            <>
                <div className={css.content}>
                    <div className={css.imageDiv}>
                        <img className={css.image} src={`http://localhost:8081/ipfs/${car.pictures[0]}`}
                        alt="could not load"/>
                    </div>
                    <div className={css.carDetails}>
                        <div className={classNames(css.carDetailsRight, "me-3")}>
                            <p><b>Chassis number: </b>{car.chassisNumber}</p>
                            <div className={css.editDiv}>
                                {!editMileageMode && <>
                                    <p><b>Mileage: </b>{car.mileage}</p>
                                    {editable && <Pencil onClick={onClickEditMileage} className={classNames(css.editIcon, "ms-1")}/>}
                                </>
                                }
                                {editMileageMode && <>
                                    <input
                                        type="number"
                                        placeholder={String(car.mileage)}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => setNewMileage(Number(event.target.value))}
                                    />
                                </>}
                            </div>
                            <div className={css.editDiv}>
                                {!editPriceMode && <>
                                    <p><b>Price: </b>ETH {car.price}</p>
                                    {editable && <Pencil onClick={onClickEditPrice} className={classNames(css.editIcon, "ms-1")}/>}
                                </>}
                                {editPriceMode && <>
                                    <input
                                        type="number"
                                        placeholder={`${String(car.price)} ETH`}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPrice(Number(event.target.value))}
                                    />
                                </>}
                            </div>
                            <p><b>License plate: </b>{car.licensePlate}</p>
                        </div>
                        <div className={css.carDetailsLeft}>
                            <p><b>brand: </b>{car.brand}</p>
                            <p><b>Car type: </b>{car.carType}</p>
                            <p><b>Colour: </b>{car.colour}</p>
                            <p><b>For sale: </b>{car.isForSale ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
                <div className={css.buttonDiv}>
                    {(editPriceMode || editMileageMode) && <Button onClick={handleClickCancel} className={css.cancelButton} type="button">
                        <XLg className={classNames(css.cancelIcon, "me-2")}/> Cancel
                    </Button>}
                    {editMileageMode && <Button disabled={newMileage === 0 || newMileage <= car.mileage} onClick={onUpdateMileage} className={css.editButton} type="button">Update Mileage</Button>}
                    {editPriceMode && <Button disabled={newPrice === 0 || newPrice === car.price} onClick={onUpdatePrice} className={css.editButton} type="button">Update Price</Button>}
                </div>
            </>
        </Card>
    )
}

export default CarCard;