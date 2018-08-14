'use strict';
const BootBot = require('bootbot');
const config = require('config');
var fetch = require("node-fetch");

function sendReminder(){

}

function createReminder(){

}

function sendGoodBoyes(userID){
    bot.say(userID, 'Searching for the perfect gif...');
  fetch(GIPHY_URL + "Puppies")
    .then(res => res.json())
    .then(json => {
      bot.say(
        userID, 
      {
        attachment: 'image',
        url: json.data.image_url
      }, {
        typing: true
      });
    });
}

const bot = new BootBot({
    accessToken: config.get('access_token'),
    verifyToken: config.get('verify_token'),
    appSecret: config.get('app_secret'),
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi', 'hey', 'oi'], (payload, chat) => {
    chat.say("Hello again!");
});

const GIPHY_URL = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=`;


bot.hear(['cute', 'dog', '(pic)?tures', 'doggo'], (payload, chat) => {

});

bot.on('message', (payload, chat) => {
    const text = payload.message.text;
    if (text.includes("dog") || text.includes("puppy") || text.includes("puppies") || text.includes("pic") || text.includes("pictures")|| text.includes("pics") || text.includes("boys") || text.includes("good")) {
        sendGoodBoyes(payload.sender.id);
    }
});


bot.start();
