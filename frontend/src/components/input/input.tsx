import React, {ChangeEvent, FC, HTMLInputTypeAttribute, useState} from 'react';
import css from './input.module.scss';
import classNames from "classnames";

interface InputProps {
    label?: string;
    name?: string;
    type?: HTMLInputTypeAttribute;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    valid: boolean;
    disabled: boolean;
    value?: string;
    className?: string;
    inputClassName?: string;
    autoComplete?: string
    placeholder?: string
}

// This input has 3 different forms, it can be used as a country select, a textarea or a regular input field depending on the props
const Input: FC<InputProps> = ({
                                   label,
                                   name,
                                   type,
                                   onChange,
                                   valid,
                                   disabled,
                                   value,
                                   className,
                                   inputClassName,
                                   autoComplete,
                                   placeholder,
                               }) => {
    const [blurred, setBlurred] = useState<boolean>(false);

    return (
        <div className={classNames(css.input, className && className)}>
            {label && <label className={classNames(css.label, 'mb-1')}>{label}</label>}
            <input
                disabled={disabled}
                onChange={onChange}
                type={type}
                name={name}
                className={classNames((!valid && blurred) && css.error, inputClassName && inputClassName)}
                onBlur={() => setBlurred(true)}
                onFocus={() => setBlurred(false)}
                autoComplete={autoComplete}
                value={value}
                placeholder={placeholder}
            />
            {(!valid && blurred) && <p className={css.errorMessage}>Please enter a valid {label}</p>}
        </div>
    );
};

export default Input;
