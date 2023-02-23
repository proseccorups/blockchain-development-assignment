import React, {FC} from 'react';
import css from './checkbox.module.scss';
import classNames from "classnames";
import SvgIcon from "../svg-icon/svg-icon";

interface CheckboxProps {
    checked: boolean;
    onClick: () => void;
    className?: string;
}

const Checkbox: FC<CheckboxProps> = ({checked, className, onClick}) => {
    return (
        <button
            onClick={onClick}
            className={classNames(css.checkbox, className && className)}
            type="button"
        >
            {checked && <SvgIcon className={css.checkmark} name="checkmark"/>}
        </button>
    );
}

export default Checkbox;
