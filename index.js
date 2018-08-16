"use strict";
const BootBot = require("bootbot");
const config = require("config");
var schedule = require("node-schedule-tz");
var fetch = require("node-fetch");
var moment = require("moment-timezone");
var geoTz = require("geo-tz");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ users: [], count: 0 }).write();

var timezone = "";

function newUser(userID, timezone, sleep, wakeup) {
  let user = db
    .get("users")
    .find({ id: userID })
    .value();

  if (user == null) {
    db.get("users")
      .push({ id: userID, timezone: timezone, sleep: sleep, wakeup: wakeup })
      .write();

    db.update("count", n => n + 1).write();
  } else {
    db.get("users")
      .find({ id: userID })
      .assign({ id: userID, timezone: timezone, sleep: sleep, wakeup: wakeup })
      .write();
  }
}

function getUserInfo(userID) {
  return db
    .get("users")
    .find({ id: userID })
    .value();
}

function sleepCycle(userID) {
  let timez = getUserInfo(userID).timezone;
  var currentTime = moment.tz(timez);
  var firstWake = moment.tz(timez).add(1.75, "hours");
  var secondWake = moment.tz(timez).add(3 + 1.75, "hours");
  var thirdWake = moment.tz(timez).add(3 + 1.75 + 1.5, "hours");
  var fourthWake = moment.tz(timez).add(3 + 1.75 + 1.5 + 1.5, "hours");

  return {
    text:
      "Keeping sleep cycles in mind, you'll want to wake up at these times if you sleep now",
    quickReplies: [
      firstWake.format("h:mm A"),
      secondWake.format("h:mm A"),
      thirdWake.format("h:mm A"),
      fourthWake.format("h:mm A")
    ]
  };
}

function createWakeupReminder(userID, text){
  createReminder(userID, text, "Wake Up!");
}

function createReminder(userID, text, msg) {
  var time = moment(text, 'HH:mm a')
  var j = schedule.scheduleJob("" + time.format('mm') + " " + time.format('HH') + " * * *", function(
    fireDate
  ) {
    bot.say(userID, msg);
  });
  console.log("Job created!!");
}

function sendGoodBoyes(userID) {
  bot.say(userID, "Searching for the perfect gif...");
  fetch(GIPHY_URL + "Puppies")
    .then(res => res.json())
    .then(json => {
      bot.say(
        userID,
        {
          attachment: "image",
          url: json.data.image_url
        },
        {
          typing: true
        }
      );
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

const questionWakeup9 = {
  text: `When would you like to receive wake-up reminders?`,
  quickReplies: ["6:15 AM", "7:45 AM", "9:15 AM"]
};

const questionWakeup10 = {
  text: `When would you like to receive wake-up reminders?`,
  quickReplies: ["5:45 AM", "7:15 AM", "8:45 AM"]
};

const questionWakeup11 = {
  text: `When would you like to receive wake-up reminders?`,
  quickReplies: ["6:45 AM", "8:15 AM", "9:45 AM"]
};

const questionWakeup12 = {
  text: `When would you like to receive wake-up reminders?`,
  quickReplies: ["7:45 AM", "9:15 AM", "10:45 AM"]
};

const question = {
  text: `What is your target sleep time?`,
  quickReplies: ["9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"]
};

const bot = new BootBot({
  accessToken: config.get("access_token"),
  verifyToken: config.get("verify_token"),
  appSecret: config.get("app_secret")
});

bot.setGreetingText(
  "ZZZucc: A Facebook Messenger bot that helps you catch more ZZZs (sends personal reminders for going to sleep on time)"
);
bot.setGetStartedButton((payload, chat) => {
  chat.say(
    'This is ZZZucc, your personal reminder bot for going to sleep on time. Features include:\
      \nReminders to go to sleep\nA system of spam alerts to wake you up at an optimal time, according to your sleep cycle (type "cycle")\
      \nTips and tricks for getting a better night\'s sleep (type "tip")\nFree dog gifs ^_^ (type "dog")'
  );
  setTimeout(() => chat.say("Please send a hello to get started!"), 2000);
});
bot.on("message", (payload, chat) => {
  const text = payload.message.text;
  console.log(`The user said: ${text}`);
});

/*
bot.hear(['hello', 'hi', 'hey', 'oi'], (payload, chat) => {
    chat.say("Hello again!");
});*/

const GIPHY_URL = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=`;
const locationQuestion = {
  text: "Please share your location so I can find your timezone",
  quickReplies: [{ content_type: "location" }]
};
bot.hear("location", (payload, chat) => {
  chat.conversation(convo => {
    convo.ask(locationQuestion, (payload, convo) => {
      const coords = payload.coordinates;
      console.log(coords);
      timezone = geoTz(coords.lat, coords.long);
    });
  });
});

bot.hear("cycle", (payload, chat) => {
  let reply = sleepCycle(payload.sender.id);
  console.log(reply);
  chat.conversation(convo =>
    convo.ask(reply, (payload, convo) => {
      let wakeup = payload.message.text;
      createWakeupReminder(payload.sender.id, wakeup);
      convo.say(`Reminder created for ${wakeup}`);
    })
  );
  // chat.say(reply);
});

bot.on("message", (payload, chat) => {
  const text = payload.message.text.toLowerCase();
  if (
    text.includes("dog") ||
    text.includes("puppy") ||
    text.includes("puppies") ||
    text.includes("pic") ||
    text.includes("pictures") ||
    text.includes("pics") ||
    text.includes("boys") ||
    text.includes("good")
  ) {
    sendGoodBoyes(payload.sender.id);
  }
  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("oi") ||
    text.includes("hola") 
  ) {
    var coords = [];
    var sleep = "";
    var wakeup = "";
    chat.conversation(convo => {
      convo.ask(locationQuestion, (payload, convo) => {
        let coordinates = payload.message.attachments[0].payload.coordinates;
        coords.push(coordinates.lat);
        coords.push(coordinates.long);
        var timezone = geoTz(coords[0], coords[1]);
        convo.ask(question, (payload, convo) => {
          sleep = payload.message.text;
          //var hour = parseInt(sleep.replace(" PM", ""));
          var hour = moment(sleep, 'HH:mm a').format('HH');
          createReminder(payload.sender.id, payload.message.text, "Go to Sleep!");
          //convo.say(`Reminder created for ${text}`);
          if (hour == "21") {
            convo.ask(questionWakeup9, (payload, convo) => {
              wakeup = payload.message.text;
              createWakeupReminder(payload.sender.id, wakeup);
              convo.say(`Reminder created for ${wakeup}`);
              newUser(payload.sender.id, timezone, sleep, wakeup);
            });
          } else if (hour == "22") {
            convo.ask(questionWakeup10, (payload, convo) => {
              wakeup = payload.message.text;
              createWakeupReminder(payload.sender.id, wakeup);
              convo.say(`Reminder created for ${wakeup}`);
              newUser(payload.sender.id, timezone, sleep, wakeup);
            });
          } else if (hour == "23") {
            convo.ask(questionWakeup11, (payload, convo) => {
              wakeup = payload.message.text;
              createWakeupReminder(payload.sender.id, wakeup);
              convo.say(`Reminder created for ${wakeup}`);
              newUser(payload.sender.id, timezone, sleep, wakeup);
            });
          } else if (hour == "00") {
            convo.ask(questionWakeup12, (payload, convo) => {
              wakeup = payload.message.text;
              createWakeupReminder(payload.sender.id, wakeup);
              convo.say(`Reminder created for ${wakeup}`);
              newUser(payload.sender.id, timezone, sleep, wakeup);
            });
          }
          console.log(wakeup);
        });
      });
    });
  }
  if (
    text.includes("tip") ||
    text.includes("trick") ||
    text.includes("advice") ||
    text.includes("help") ||
    text.includes("guidance")
  ) {
    chat.say(tips[Math.floor(Math.random() * tips.length)]);
  }
});

bot.start();
