
// Pull in libraries

// Express web framework (use it for REST API)
const express = require('express');

// How we interact with Twitch Chat
const tmi = require("tmi.js")

// Work with the filesystem
const fs = require("fs");

// CORS - Cross-Origin Resource Sharing (CORS)
const cors = require('cors')

// Declare App
const app = express();

app.use(express.json());

const messages = [];

var contents = fs.readFileSync("settings.json");
var jsonContent = JSON.parse(contents);
var channel = jsonContent.channel;

var config = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    // get yours at http://twitchapps.com/tmi
    identity: {
        username: jsonContent.username,
        password: jsonContent.clientkey
    },
    channels: [jsonContent.channel]
}

var client = new tmi.client(config)


client.connect();

app.use(cors())
//Request Handler
app.post('/api/messages', (req, res) => {

    const message = {
        title: req.body.title
    };
    messages.push(message);
    client.say(channel, req.body.title);
    res.send(message);
});



//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));