import React, {FC} from 'react';
import css from './card.module.scss';
import classNames from "classnames";

interface CardProps {
    children: JSX.Element
    onClick?: () => void;
    className?: string
}

const Card: FC<CardProps> = ({children, className, onClick}) => {
    return (
        <div onClick={onClick} className={classNames(className && className, css.root)}>{children}</div>
    );
}

export default Card