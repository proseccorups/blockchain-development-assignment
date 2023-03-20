import React, {ChangeEvent, useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import './App.css';
import Navigation from "./components/navigation/navigation";
import Header from "./components/header/header";
import RegisterCar from "./modules/register-car/register-car";
import PurchaseCar from "./modules/purchase-car/purchase-car";
import Input from "./components/input/input";

function App() {
    const [selectedOption, setSelectedOption] = useState<string>("register-car");
    const [publicKey, setPublicKey] = useState<string>("");

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
                            options={["Register Car", "Purchase Car"]}
                            selectedOption={selectedOption}
                            onClickOption={handleClickOption}
                        />
                    </Col>
                </Row>
                <Input
                    className="mt-3"
                    valid={true}
                    disabled={false}
                    label="Public key:"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPublicKey(event.target.value)}
                />
                {selectedOption === "Register Car" &&  <RegisterCar publicKey={publicKey}/>}
                {selectedOption === "Purchase Car" && <PurchaseCar publicKey={publicKey}/>}
            </Container>
        </>
    );
}

export default App;
