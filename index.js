const { Client, Collection, Intents, Permissions } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");

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
    let rawdata = fs.readFileSync('config.json');
    let data = JSON.parse(rawdata);
    prefix = data.prefix
    var confPrefix = (prefix == "" || prefix == null ? process.env.PREFIX : prefix);
    prefixVariable = confPrefix
    setInterval(() => {
        pickStatus();
    }, 60000);

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
    let status = [
        {
            type: "PLAYING",
            text: "with my friends"
        },
        {
            type: "WATCHING",
            text: "deinen Haufen an",
        },
        {
            type: "WATCHING",
            text: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
            type: "LISTENING",
            text: prefixVariable + "help",
        }
    ]
    let pickedStatus = status[Math.floor(Math.random() * status.length)];
    client.user.setActivity(pickedStatus.text, { type: pickedStatus.type });
}
