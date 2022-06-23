const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const fs = require("fs");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async(client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return await getAll(client, message);
        }
    }
}

async function getAll(client, message) {

    let owner = await message.guild.members.fetch(process.env.BOT_OWNER_ID);
    const oldEembed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Help")
        .setTimestamp()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setFooter("Bot made by: " + owner.user.username + "#" + owner.user.discriminator, owner.user.displayAvatarURL());

    const embed = {
        color: "RANDOM",
        title: "Hilfe",
        timestamp: new Date(),
        author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL()
        },
        footer: {
            text: "Bot made by: " + owner.user.username + "#" + owner.user.discriminator,
            icon_url: owner.user.displayAvatarURL()
        },
    }

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }
    let index = client.categories.indexOf("dev")
    if(index !== -1){
        client.categories.splice(index, 1);
    }
    var info = client.categories
        .map(cat => stripIndents `**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);
    let rawdata = fs.readFileSync('config.json');
    let data = JSON.parse(rawdata);
    let prefix = data.prefix
    var confPrefix = (prefix == "" || prefix == null ? process.env.PREFIX : prefix);

    info = "**Prefix: " + confPrefix + "**\n\n" + info

    embed.description = info
    return message.channel.send({ embeds: [embed] });
}

function getCMD(client, message, input) {
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `Keine Informationen für Befehl **${input.toLowerCase()}**`;
    if (cmd === undefined) {
        const embed = {
            color: "RED",
            description: info,
            timestamp: new Date(),
        }
        return message.channel.send({ embeds: [embed]});
    }

    if (cmd.name) info = `**Command Name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliase**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Beschreibung**: ${cmd.description}`;

    const embed = {
        color: "GREEN",
        description: info,
        timestamp: new Date(),
    }

    if (cmd.usage) {
        info += `\n**Anwendung**: ${cmd.usage}`;
        embed.footer = `Syntax: <> = erfordert, [] = optional`;
    }
    return message.channel.send({ embeds: [embed] });
}