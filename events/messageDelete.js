const { Events, EmbedBuilder, ChannelType } = require('discord.js');

const { sendToLog } = require('../utils/log.js');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if(message.author.bot) return;
        if(message.channel.type == ChannelType.DM) return;
        if(message.channel.type == ChannelType.GroupDM) return;
    
        const sendChannel = message.guild.channels.cache.get(message.channelId);
        const embed = new EmbedBuilder()
            .setTitle("Nachricht gelöscht")
            .setColor("#ff0000")
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                {name: "Autor", value: message.author.username + "#" + message.author.discriminator},
                {name: "Channel", value: sendChannel.name},
                {name: "Nachricht", value: message.content || "Keine Nachricht"},
            )
            .setTimestamp()
        sendToLog(message.guild, embed);
    },
};