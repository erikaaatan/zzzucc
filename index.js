'use strict';
const BootBot = require('bootbot');
const config = require('config');
var fetch = require("node-fetch");
var schedule = require('node-schedule');

function getTimeZone(userID){
    console.log(userID);
    // https://graph.facebook.com/<PSID>?fields=first_name,last_name,profile_pic&access_token=<PAGE_ACCESS_TOKEN>
    let FB_API = "https://graph.facebook.com/";
    fetch(FB_API + userID + '?fields=timezone&access_token=' + config.get('access_token'))
    .then(res => res.json())
    .then(json => {
        
    })
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
var tips = [
  "Sleep polyphasically: divide your sleep into smaller blocks per day instead of in one big block. This will reduce the amount of sleep you need per day and help you wake up feeling more alert.",
  "Keep your hands and feet warm at night-wear socks!",
  "People tend to sleep better in cooler settings. Set your room temperature to 60-67 degrees Fahrenheit or 15-19 degrees Celsius.",
  "Exercise regularly, but do it at least a couple hours before bedtime so you can cool down.",
  "Resist the habit of thinking in bed and clear your mind before bedtime.",
  "Take a hot bath before you go to bed tonight. It won't just help you fall asleep faster, but it'll also help you get higher quality sleep too!",
  "Get out of bed if you can't sleep-otherwise, your body will be accustomed to doing nothing while awake in bed.",
  "Try using another pillow tonight!"
];

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

bot.hear(['tip'], (payload, chat) => {
    chat.say(tips[Math.floor(Math.random()*tips.length)]);
});

const GIPHY_URL = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=`;


bot.hear(['cute', 'dog', '(pic)?tures', 'doggo'], (payload, chat) => {

});

bot.on('message', (payload, chat) => {
    const text = payload.message.text;
    if (text.includes("dog") || text.includes("puppy") || text.includes("puppies") || text.includes("pic") || text.includes("pictures")|| text.includes("pics") || text.includes("boys") || text.includes("good")) {
        sendGoodBoyes(payload.sender.id);
        getTimeZone(payload.sender.id);
    }
});


bot.start();
