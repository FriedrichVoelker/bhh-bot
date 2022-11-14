const { Events, EmbedBuilder, ChannelType } = require('discord.js');
const { sendToLog } = require('../utils/log.js');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;
        if(oldMessage.channel.type == ChannelType.DM) return;
        if(oldMessage.channel.type == ChannelType.GroupDM) return;
        
        if(oldMessage.content == newMessage.content) return;

        const sendChannel = oldMessage.guild.channels.cache.get(oldMessage.channelId);
        const embed = new EmbedBuilder()
            .setTitle("Message Edited")
            .setColor("Orange")
            .setThumbnail(oldMessage.author.displayAvatarURL())
            .addFields(
                {name: "Autor", value: oldMessage.author.username + "#" + oldMessage.author.discriminator},
                {name: "Channel", value: sendChannel.name},
                {name: "Vorher", value: oldMessage.content || "Keine Nachricht"},
                {name: "Nachher", value: newMessage.content || "Keine Nachricht"},
            )
            .setTimestamp()
        sendToLog(oldMessage.guild, embed);
    },
};