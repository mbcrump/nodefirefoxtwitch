const tmi = require('tmi.js')
const fs = require('fs')

module.exports = async function (context, req) {

var message = (req.query.text || (req.body && req.body.text));

var contents = fs.readFileSync("settings.json");
var jsonContent = JSON.parse(contents);

var channel = jsonContent.channel;

const client = new tmi.Client({
    connection: { 
        secure: true,
        reconnect: true
    },
    // get yours at http://twitchapps.com/tmi
    identity: {
        username: jsonContent.username,
        password: jsonContent.clientkey
    },
    channels: [jsonContent.channel]
});

client.on('connected', async () => {
    try {
      await client.say(channel, message);
    } catch (error) {
      context.log('Error sending message:', error.message);
      context.log(error);
      await client.disconnect();
    }
  });

  await client.connect();
};