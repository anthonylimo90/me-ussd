require("dotenv").config();
const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const Model = require("./models/model");

const mongoString = process.env.MONGO_URI;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Database connected...");
});

const utils = require("./utils/customer");
const customer = require("./utils/customer");
const controller = require("./utils/controller");

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const dataToSave = {};

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
        

        if (controller.queryUserData(phoneNumber) == {}) {
            response = "END User not registered. Kindly register with the service before proceeding";
        } else {
            const resp = await customer.customerQuery(phoneNumber);
            console.log(resp, phoneNumber);
            
            response = `
            CON Welcome to Nisome Bank 
            ${resp.firstName} ${resp.lastName} 
            User No ${resp.userNo}
            1. Check Balance
            2. Check KYC status
            3. Check Loan Limit`;

            await controller.saveInitialData(resp, phoneNumber);
        }

    } else if (text == "1") {
        // Fetch account balance from the wallet
        let balance;
        response = `END We currently cannot fetch your data.`;
    } else if (text == "2") {
        // Run through the customer KYC check API and response with the status
        let kycStatus;

        const data = await controller.queryUserData(phoneNumber);
        console.log(data);
        
        response = `END Your KYC status is ${data.kycStatus}`;
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