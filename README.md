## Mee USSD (Alpha Build)

This is a simple USSD app for a tutorial on building on Financial Infrastructure.

Featuring:
- Africa's Talking USSD
- LOOP Fabric API
- MongoDB
- (Optional) Render

## Getting Started

## How to run this app
This app is built with Node 20.8. To run it:
- Run `npm install`
- Run `node index.js`

To test this app using the africa's talking platform, you will need a callback URL. There are several options:
- Ngrok - tunnels your localhost and gives you and endpoint that's available over the interwebs
- Render (Or any similar service) - this allows you to deploy your app to github and automatically trigger deployments that you can access via the interwebs. A lot easier and more configurable

### TODO:
- Clean up the architecture
- Configure a state machine to handle USSD states