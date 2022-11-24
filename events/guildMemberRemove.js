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
                    {name: "Member", value: `<@${member.user.id}>`},
                    {name: "Name", value: (member.user.username + "#" + member.user.discriminator), inline: true},
                    {name: "Member ID", value: member.user.id, inline: true},
                )
                .setTimestamp()
            sendToLog(member.guild, embed);
    },
};