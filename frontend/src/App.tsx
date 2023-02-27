import React, {useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import './App.css';
import Navigation from "./components/navigation/navigation";
import Header from "./components/header/header";
import RegisterCar from "./modules/register-car/register-car";
import GreetingExample from "./modules/greeting-example/greeting-example";


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
                            options={["Register Car", "Transfer Car"]}
                            selectedOption={selectedOption}
                            onClickOption={handleClickOption}
                        />
                    </Col>
                </Row>
                {selectedOption === "Register Car" &&  <RegisterCar/>}
                {selectedOption === "Transfer Car" && <p>This is the transfer page</p>}
            </Container>
        </>
    );
}

export default App;
