'use strict';
const BootBot = require('bootbot');
const config = require('config');
var schedule = require('node-schedule-tz');
var fetch = require("node-fetch");

function createReminder(userID, hour){
    var j = schedule.scheduleJob('0 ' + hour +' * * *', function(fireDate){
        bot.say(userID, "Go to sleep");
    });
    console.log("Job created!!");
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

const question = {
	text: `What is your target sleep time?`,
	quickReplies: ['9 PM', '10 PM', '11 PM', '12 AM']
};

const answer = (payload, convo) => {
	const text = payload.message.text;
  var hour = parseInt(text.replace(" PM", ""));
  createReminder(payload.sender.id, hour);
	convo.say(`Reminder created for ${text}`);
};

const callbacks = [
	{
		event: 'quick_reply',
		callback: () => { /* User replied using a quick reply */ }
	},
	{
		event: 'attachment',
		callback: () => { /* User replied with an attachment */ }
	},
	{
		pattern: ['black', 'white'],
		callback: () => { /* User said "black" or "white" */ }
	}
];

const options = {
	typing: true // Send a typing indicator before asking the question
};

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


bot.on('message', (payload, chat) => {
    const text = payload.message.text;
    if (text.includes("dog") || text.includes("puppy") || text.includes("puppies") || text.includes("pic") || text.includes("pictures")|| text.includes("pics") || text.includes("boys") || text.includes("good")) {
        sendGoodBoyes(payload.sender.id);
    }
    if (text.includes("reminder")) {
      chat.conversation((convo) => {
        convo.ask(question, answer);
      });
    }
    if (text.includes("tip")) {
      chat.say(tips[Math.floor(Math.random()*tips.length)]);
    }
});


bot.start();
