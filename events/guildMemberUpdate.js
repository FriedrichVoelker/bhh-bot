const { Events, EmbedBuilder } = require('discord.js');
const { sendToLog } = require('../utils/log.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {

        if(oldMember.user.bot) return;
        if(oldMember.nickname == newMember.nickname) return;
        const embed = new EmbedBuilder()
            .setTitle("Nickname Geändert")
            .setColor("Orange")
            .setThumbnail(oldMember.user.displayAvatarURL())
            .addFields(
                {name: "Member", value: `<@${oldMember.user.id}>`},
                {name: "Name", value: (oldMember.user.username + "#" + oldMember.user.discriminator), inline: true},
                {name: "Member ID", value: oldMember.user.id, inline: true},
                {name: "Vorher", value: oldMember.nickname || "Kein Nickname"},
                {name: "Nachher", value: newMember.nickname || "Kein Nickname"},
            )
            .setTimestamp()
        sendToLog(oldMember.guild, embed);
    },
};