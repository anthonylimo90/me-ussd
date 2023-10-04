require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const utils = require("./utils/customer");
const customer = require("./utils/customer");

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    console.log(`Hey hey 😊`);
});

app.post("/ussd", async (req, res) => {

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
        const resp = await customer.customerQuery(phoneNumber);
        console.log(resp);
        if(resp.responseCode == "IASP0000") {
            response = `CON Welcome to Nisome Bank 
            ${resp.firstName} ${resp.lastName} 
            User No ${resp.userNo}
            1. Check Balance
            2. Check KYC status
            3. Check Loan Limit`;
        } else if (resp.responseCode == "IASP4002") {
            response = `END You are not a registred customer. Kindly register for the service and try again`
        } else {
            response = `END Something went wrong with our systems. Kindly try again.`    
        }
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