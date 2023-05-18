const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
client.messages.create({
    from: +12708106315,
    to: +918056771482,
    body: "veliya paruda mental"
}).then((message) => console.log(message.sid));


  //process.env.TWILIO_PHONE_NUMBER