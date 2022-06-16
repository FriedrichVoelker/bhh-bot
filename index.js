const { Client, Collection, Intents, Permissions } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let configdata;

if(process.env.DEV == true){
    let rawdata = fs.readFileSync('config.dev.json');
    configdata = JSON.parse(rawdata);
}else{
    let rawdata = fs.readFileSync('config.json');
    configdata = JSON.parse(rawdata);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ] });

let prefixVariable = "";

// Collections
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


client.once('ready', () => {
    console.log('I am online, my name is ' + client.user.username + "#" + client.user.discriminator + " (ID: " + client.user.id + ")");
    client.user.setActivity(process.env.ACTIVITY_STATUS, { type: process.env.ACTIVITY_TYPE });
    
    let prefix = ""
    prefix = configdata.prefix
    var confPrefix = (prefix == "" || prefix == null ? process.env.PREFIX : prefix);
    prefixVariable = confPrefix
    pickStatus()
    setInterval(() => {
        pickStatus();
    }, 60000);

    if(configdata.factOfTheDay == true){
        sendFactOfTheDay()
        setInterval(() => {
            sendFactOfTheDay();
        }, 60000);
    }

});

client.on("messageCreate", async message => {
    confPrefix = prefixVariable
    let prefixes = [confPrefix, "bhhbot", `<@!${client.user.id}> `, `<@${client.user.id}> `]

    var usedPrefix = ""

    function hasPrefix(str) {
        for (let pre of prefixes) {
            if (str.startsWith(pre.toLowerCase())) {
                usedPrefix = pre;
                return true;
            }
        }
        return false;
    }


    if (message.author.bot) return;
    if (!message.guild) return;
    // if (message.content.startsWith("<@" + client.user.id + ">")) console.log(message.content.startsWith("<@" + client.user.id + ">"));
    if (!hasPrefix(message.content)) return;

    // If message.member is uncached, cache it.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    var args = ""
    args = message.content.slice(usedPrefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command)
        command.run(client, message, args);
});

client.login(process.env.TOKEN);




function pickStatus() {
    let status = require("./static/json/status.json");
    let pickedStatus = status.stati[Math.floor(Math.random() * status.stati.length)];
    pickedStatus.text = pickedStatus.text.replaceAll("%prefix%", prefixVariable);
    client.user.setActivity(pickedStatus.text, { type: pickedStatus.type });
}

async function sendFactOfTheDay(){

    if(!configdata.factOfTheDayChannel || configdata.factOfTheDayChannel == "") return;
    if(!configdata.factOfTheDayTime || configdata.factOfTheDayTime == "") return;

    let currTime = (new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()) + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes());
    if(currTime == configdata.factOfTheDayTime){
        
     const fact = await fetch("https://uselessfacts.jsph.pl/today.json?language=de").then(res => res.json());
     const embed = {
        color: "RANDOM",
        title: "Unnützer Fakt des Tages",
        timestamp: new Date(),
        description: fact.text + "\n\nQuelle: [" + fact.source + "](" + fact.source_url + ")",
        author: {
            name: client.user.username,
            icon_url: client.user.displayAvatarURL()
        },
        footer: {
            text: "Permalink: " + fact.permalink,
        }
    }

    let channel = client.channels.cache.get(configdata.factOfTheDayChannel);

    if(channel == undefined) return;

    channel.send({ embeds: [embed] });

    }
}
