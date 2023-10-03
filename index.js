const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log(`Hey hey 😊`);
});

app.post("/ussd", (req, res) => {
    const serviceCode = req.body.serviceCode;
    const phoneNumber = req.body.phoneNumber;
    const sessionId = req.body.sessionId;
    let text = req.body.text;

    console.log(`${sessionId}, ${phoneNumber}, ${text}`);

    let response = "";

    if(text == "") {
        response = `CON What would you like to check?
        1. Account Balance
        2. KYC Status`
    }

    res.set("Content-Type: text/plain");
    res.send(response);
});

app.listen(3000, () => {
    console.log("Running...");
});