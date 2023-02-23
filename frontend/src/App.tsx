import React, {useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import './App.css';
import Navigation from "./components/navigation/navigation";
import Header from "./components/header/header";
import Input from "./components/input/input";
import Checkbox from "./components/checkbox/checkbox";
import css from './app-styles.module.scss';
import classNames from "classnames";
import Button from "./components/button/button";
import RegisterCar from "./modules/register-car/register-car";

function App() {
    const [selectedOption, setSelectedOption] = useState<string>("register-car");

    const handleClickOption = (option: string) => {
        setSelectedOption(option);
    }

    return (
        <>
            <Header/>
            <Container>
                <Row>
                    <Col>
                        <Navigation
                            className="mt-5"
                            options={["register-car", "transfer-car"]}
                            selectedOption={selectedOption}
                            onClickOption={handleClickOption}
                        />
                    </Col>
                </Row>
                {selectedOption === "register-car" &&  <RegisterCar/>}
                {selectedOption === "transfer-car" && <p>This is the transfer page</p>}
            </Container>
        </>
    );
}

export default App;
