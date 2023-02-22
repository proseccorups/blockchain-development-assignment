import React, {FC} from 'react';
import css from './header.module.scss';

const Header: FC = () => {
    return (
        <header className={css.header}>
            <h1>Car Assignment</h1>
        </header>
    )
}

export default Header;
