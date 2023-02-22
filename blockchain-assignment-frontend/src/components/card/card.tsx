import React, {FC} from 'react';
import css from './card.module.scss';
import classNames from "classnames";

interface CardProps {
    children: JSX.Element
    className?: string
}

const Card: FC<CardProps> = ({children, className}) => {
    return (
        <div className={classNames(className && className, css.root)}>{children}</div>
    );
}

export default Card