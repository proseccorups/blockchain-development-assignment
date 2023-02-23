import React, {FC} from 'react';
import css from './navigation.module.scss';
import classNames from "classnames";
import Card from "../card/card";

interface NavigationProps {
    options: string[];
    selectedOption: string;
    onClickOption: (option: string) => void;
    className?: string;
}


const Navigation: FC<NavigationProps> = ({options, selectedOption, onClickOption, className}) => {
    return (
        <Card className={classNames(css.root, className && className)}>
            <>
                {options.map((option: string)  =>
                    <button onClick={() => onClickOption(option)} className={classNames(css.option, selectedOption === option && css.active)} key={option} type="button">
                        {option}
                    </button>
                )}
            </>
        </Card>
    );
}

export default Navigation;
