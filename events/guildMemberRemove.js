const { Events, EmbedBuilder } = require('discord.js');
const { sendToLog } = require('../utils/log.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
            const embed = new EmbedBuilder()
                .setTitle("Member Left")
                .setColor("#ff0000")
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    {name: "Member", value: (member.user.username + "#" + member.user.discriminator)},
                    {name: "Member ID", value: member.user.id},
                )
                .setTimestamp()
            sendToLog(member.guild, embed);
    },
};