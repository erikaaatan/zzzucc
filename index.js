'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
    accessToken: 'EAAY2tIZCSiNUBAFwn1A9O7hbkQEEZBG9fJ8ILDce78TZBrMVvrxLbFY5kCNZCUWZCAZBZBLP5nrbubZBf63eOCefwZBvHY2rnOlDMSWGfCY429OQuqzDc8itZBrwdJzP0vCITSG29L7gZBKaYYFnZBv4cyEKfe8DCzFY7rnHzwrZANL3bZA9ioBo7rXx3ZA',
    verifyToken: 'Hello_Again',
    appSecret: '0eca666d2ecffc53d6a1ff1b53579471',
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi', 'hey', 'oi'], (payload, chat) => {
    chat.say("Hello again!");
});

bot.hear(('aryaman'), (payload, chat) => {
    chat.say("Don't say that name, I cri");
    chat.say({
        attachment: 'image',
        url : 'https://www.allkpop.com/upload/2018/08/content/nct_1533652276_20180807_nctc2.jpg'
    });
});

bot.hear(("erika"), (payload, chat) => {
    chat.say("환영 스파이");
    chat.say("핵폭탄 발사 : 워싱턴 D.C. 120 초");
});


bot.hear(("monbebe"), (payload, chat) => {
    chat.say("Gaybebe*");
});


bot.hear(("Oliver"), (payload, chat) => {
    chat.say("Aww-liver");
});


bot.hear(("Lily"), (payload, chat) => {
    chat.say("<3");
});

bot.hear(("NCT"), (payload, chat) => {
    chat.say(
        ["Choose what their sexual identity is?",
            '1. Gay',
            '2. !(!Gay)',
            '3. Radioactive bisexual alli-gay-tors',
            '4. North Korean poop sanitizing bacteria',
        ]
        
    );
    setTimeout(() => {
        chat.say({
            text: "Choice?",
            quickReplies: [
                '1', '2', '3', '4'
            ]
        })
    }, 2000);

    
});

bot.hear(("Monsta X"), (payload, chat) => {
    chat.say(
        ["Choose what their best couple is?",
            '1. Shownu x Hyungwon',
            "2. I.M x Hyungwon in choker porn NSFW don't click",
            '3. Jooheon x Jooheon in girl clothes',
            '4. Hyungwon x Starbucks',
        ]
        
    );
    setTimeout(() => {
        chat.say({
            text: "Choice?",
            quickReplies: [
                '1', '2', '3', '4'
            ]
        })
    }, 3000);


    
});

bot.hear((["Gay nation", "gay fight", "gay"]), (payload, chat) => {
    chat.say("hello gay nation! it's ya host sexually radioactive gay coyote here!");
});


bot.start();
