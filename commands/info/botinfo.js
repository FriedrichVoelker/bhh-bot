const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const fs = require("fs");

module.exports = {
    name: "botinfo",
    aliases: ["bi", "boti", "binfo"],
    category: "info",
    description: "Returns information about the Bot",
    usage: "[command | alias]",
    run: async(client, message, args) => {
        let owner = await message.guild.members.fetch(process.env.BOT_OWNER_ID);
        let rawdata = fs.readFileSync('config.json');
        let data = JSON.parse(rawdata);
        let prefix = data.prefix
        var confPrefix = (prefix == "" || prefix == null ? process.env.PREFIX : prefix);
        const embed = {
            title: "Botinfo",
            color: "RANDOM",
            timestamp: new Date(),
            author: {
                "name": message.author.username,
                "icon_url": message.author.displayAvatarURL()
            },
            thumbnail: {
                "url": client.user.displayAvatarURL()
            },
            footer: {
                "text": "Bot made by: " + owner.user.username + "#" + owner.user.discriminator,
                "icon_url": owner.user.displayAvatarURL()
            },
            fields: [{
                    "name": "Allgemein:",
                    "value": `**Bot Prefix:** ${confPrefix}\n**Help command:** ${confPrefix}help`,
                    "inline": false
                },
                {
                    "name": "Bot:",
                    "value": `**Username:** ${client.user.username}#${client.user.discriminator}\n**Erstellt:** <t:${convertIDtoUnix(client.user.id)}:R>\n**Repository:** [GitHub](https://github.com/FriedrichVoelker/discord-bot)\n**Profilbild von:** <@465908135006175232>`,
                    "inline": false
                },
                {
                    "name": "Ersteller:",
                    "value": `**Bot erstellt von:** ${owner.user.username}#${owner.user.discriminator}\n**Account erstellt:** <t:${convertIDtoUnix(owner.user.id)}:R>\n**Server betreten:** <t:${(owner.joinedTimestamp/1000).toString().split(".")[0]}:R>`,
                    "inline": false
                }],
            };
        message.channel.send({ embeds: [embed] });
    }
}


function convertIDtoUnix(id) {
    /* Note: id has to be str */
    var bin = (+id).toString(2);
    var unixbin = '';
    var unix = '';
    var m = 64 - bin.length;
    unixbin = bin.substring(0, 42 - m);
    unix = parseInt(unixbin, 2) + 1420070400000;
    return (unix / 1000).toString().split(".")[0];
}