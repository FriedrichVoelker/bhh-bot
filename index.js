const { Client, Collection, Intents, Permissions } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let configdata;


config({
    path: __dirname + "/.env"
});

if(process.env.DEV === "true"){
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

    if(configdata.factOfTheDay != null && configdata.factOfTheDay.enabled == true){
        sendFactOfTheDay()
        setInterval(() => {
            sendFactOfTheDay();
        }, 60000);
    }

    if(configdata.dailyMeme != null && configdata.dailyMeme.enabled == true){
        sendDailyMeme()
        setInterval(() => {
            sendDailyMeme();
        }, 60000);
    }

});

// Button Handler

client.on('interactionCreate', async interaction  => {
	if (!interaction.isButton()) return;
	if(interaction.customId.includes("RoleMenu:")){
        let id = interaction.customId.split("RoleMenu:")[1];
        if(!interaction.member._roles.includes(id)){
            try{
                await interaction.member.roles.add(id);
                await interaction.reply({content: "Du hast die Rolle <@&"+id+"> erhalten :)", ephemeral: true})
            }catch(e){
                await interaction.reply({content: "Fehler! Ich kann die Rolle <@&"+id+"> nicht vergeben", ephemeral: true})
            }
        }else{
            try{
                await interaction.member.roles.remove(id);
                await interaction.reply({content: "Dir wurde die Rolle <@&"+id+"> entfernt :)", ephemeral: true})
            }catch(e){
                await interaction.reply({content: "Fehler! Ich kann die Rolle <@&"+id+"> nicht entfernen", ephemeral: true})
            }
        }
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

    // args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
    const regex = /"[^"]+"|[^\s]+/g
    let args = message.content.slice(usedPrefix.length).trim().match(regex).map(e => e.replace(/"(.+)"/, "$1"));

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

    if(!configdata.factOfTheDay.channel || configdata.factOfTheDay.channel == "") return;
    if(!configdata.factOfTheDay.time || configdata.factOfTheDay.time == "") return;

    let currTime = (new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()) + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes());
    if(currTime == configdata.factOfTheDay.time){
        
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

    let channel = client.channels.cache.get(configdata.factOfTheDay.channel);

    if(channel == undefined) return;

    channel.send({ embeds: [embed] });

    }
}

async function sendDailyMeme() {
    if(!configdata.dailyMeme.channel || configdata.dailyMeme.channel == "") return;
    if(!configdata.dailyMeme.time || configdata.dailyMeme.time == "") return;

    let sub = configdata.dailyMeme.sub ? configdata.dailyMeme.sub : "ProgrammerHumour";
    let currTime = (new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()) + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes());
    if(currTime == configdata.dailyMeme.time){
        const meme = await getMeme(sub)

        console.log("Dailymeme: Sending")
        const embed = {
            color: "RANDOM",
            title: "Daily Meme: " + meme.title,
            timestamp: new Date(),
            image:{
                url: !meme.is_video ? meme.url : null
            },
            video: {
                url: meme.is_video ? meme.url : null
            },
            description: meme.media_only ? null : meme.selftext,
            url: "https://reddit.com" + meme.permalink,
            footer: {
                text: "Von: https://reddit.com/r/" + sub,
            }
        }

    let channel = client.channels.cache.get(configdata.dailyMeme.channel);

    if(channel == undefined) return;

    channel.send({ embeds: [embed] });
    }
}

async function getMeme(sub){
    const url = `https://www.reddit.com/r/${sub}/hot/.json?limit=100`
    const memes = await fetch(url).then(res => res.json())

    const children = memes.data.children
    let meme = children[Math.floor(Math.random() * children.length)].data
    if(meme.stickied){
        meme = await getMeme(sub)
    }
    return meme
}