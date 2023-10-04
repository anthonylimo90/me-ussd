require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    console.log(`Hey hey 😊`);
});

const generateRandomNumber = () => {
    let randomNumber = Math.floor(Math.random * 20);
    let randomNumberString = randomNumber.toString();
    return randomNumberString;
};

const getCurrentDate = () => {
    let date = new Date();
    return date.toISOString().substring(0, 10);
};

const removeThePlus = (phoneNumber) => {
    let correctPhoneNumber = phoneNumber.substring(1);
    return correctPhoneNumber;
};

const postData = async (url = "", data = {}) => {
    const response = await fetch(
        url,
        {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type":"application/json",
                "Bearer": process.env.LOOP_TOKEN
            },
            body: JSON.stringify(data)
        },
    );
};

app.post("/ussd", (req, res) => {

    console.log(req.body);

    const serviceCode = req.body.serviceCode;
    const phoneNumber = req.body.phoneNumber;
    const sessionId = req.body.sessionId;
    let text = req.body.text;

    console.log(`${sessionId}, ${phoneNumber}, ${text}`);

    let response = "";

    if(text == "") {
        // To show this menu a customer has to be registred
        // Perform a customer query check before proceeding
        // If not registered, show a menu asking the customer to register

        axios.post(
            "https://sandbox.loop.co.ke/v1/customer/query",
            {
                "requestDateTime": getCurrentDate(),
                "requestId": generateRandomNumber(),
                "userIdType": "P",
                "reserve1": "",
                "reserve2": "",
                "requestChannel": "APP",
                "userId": removeThePlus(phoneNumber),
                "partnerId": "LOOP",
                "productSet": "LOOP"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LOOP_TOKEN}`
                }
            }
        )
        .then(data => {
            console.log(data);
            response = `CON Welcome ${data.firstName} What would you like to check?
            1. Account Balance
            2. KYC Status
            3. Check Loan Limit`;
        }).catch(error => {
            console.error(error);
            response = "END You are not a registered customer";
        });
    } else if (text == "1") {
        // Fetch account balance from the wallet
        let balance;
        response = `END Your account balance is ${balance}`;
    } else if (text == "2") {
        // Run through the customer KYC check API and response with the status
        let kycStatus;
        response = `END Your KYC status is ${kycStatus}`;
    } else if (text == "3") {
        // Check loan limit for a user who has a loan limit
        // Check loan query API
        let limit;
        response `END Your loan limit is ${limit}`;
    } else {
        response = `END You have selected the wrong input`;
    }

    res.set("Content-Type: text/plain");
    res.send(response);
});

app.listen(port, () => {
    console.log("Running...");
});