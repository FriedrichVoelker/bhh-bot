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
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Help")
        .setTimestamp()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setFooter("Bot made by: " + owner.user.username + "#" + owner.user.discriminator, owner.user.displayAvatarURL()); // "https://cdn.discordapp.com/avatars/" + owner.id + "/" + owner.avatar + ".webp?size=80");


    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }

    var info = client.categories
        .map(cat => stripIndents `**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);
    let rawdata = fs.readFileSync('config.json');
    let data = JSON.parse(rawdata);
    let prefix = data.prefix
    var confPrefix = (prefix == "" || prefix == null ? process.env.PREFIX : prefix);

    info = "**Prefix: " + confPrefix + "**\n\n" + info

    embed.setDescription(info)
    return message.channel.send({ embeds: [embed] });
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }
    embed.setColor("GREEN").setDescription(info)
    return message.channel.send({ embeds: [embed] });
}