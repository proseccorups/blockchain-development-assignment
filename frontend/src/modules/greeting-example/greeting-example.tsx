import React, {ChangeEvent, FC, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import css from './greeting-example.module.scss';
import classNames from "classnames";
import Greeter from './../../artifacts/contracts/Greeter.sol/Greeter.json';
const ethers = require('ethers');

// credit to youtube toturial: https://www.youtube.com/watch?v=nNUpA0d6CFo

const greeterAddress = "0x1ee4e6726fE97CaF85512733b02157032eCeA838";

const GreetingExample: FC = () => {
    const [greetingMessage, setGreetingMessage] = useState<string>("");

    const requestAccount = async () => {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }

    const fetchGreeting = async () => {
        if ((window as any).ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
            try {
                const data = await contract.greet();
                console.log("data: ", data);
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    }

    const setGreeting = async () => {
        if (greetingMessage === "") return;

        // if Metamask exists
        if (typeof (window as any).ethereum !== "undefined") {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
            const transaction = await contract.setGreeting(greetingMessage);
            setGreetingMessage("");
            await transaction.wait();
            fetchGreeting();
        }
    }

    return(
        <Row>
            <Col>
                <div className={css.wrapper}>
                    <div className={css.greetingDiv}>
                        <div className={classNames(css.buttonsDiv, "mt-5")}>
                            <Button onClick={fetchGreeting} type="button" className="me-1">Fetch Greeting</Button>
                            <Button onClick={setGreeting} type="button" className="ms-1">Set Greeting</Button>
                        </div>
                        <Input
                            valid={true}
                            disabled={false}
                            placeholder="Set a greeting here"
                            type="text"
                            className="mt-2"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setGreetingMessage(event.target.value)}
                            value={greetingMessage}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default GreetingExample;