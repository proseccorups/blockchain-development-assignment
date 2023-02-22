import {FC} from "react";
import css from "./button.module.scss";
import {Spinner} from "react-bootstrap";
import classNames from "classnames";

interface ButtonProps {
    children: any;
    type: 'submit' | 'reset' | 'button' | undefined;
    loading?: boolean
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

const Button: FC<ButtonProps> = ({children, type, loading, disabled, onClick, className}) => {
    return (
        <button disabled={disabled} onClick={onClick} className={classNames(css.button, loading && css.loading, className && className)} type={type}>
            {loading &&
                <Spinner className={css.spinner} animation="border"/>
            }
            {children}
        </button>
    );
};

export default Button;
