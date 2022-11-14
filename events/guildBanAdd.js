const { Events, EmbedBuilder } = require('discord.js');
const { sendToLog } = require('../utils/log.js');

module.exports = {
	name: Events.GuildBanAdd,
	async execute(guildBan) {    
        const user = guildBan.user;
        const guild = guildBan.guild;
        const embed = new EmbedBuilder()
            .setTitle("User gebannt")
            .setColor("Red")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                {name: "User", value: user.username + "#" + user.discriminator},
                {name: "ID", value: user.id},
                {name: "Gebannt von", value: guildBan.client.username + "#" + guildBan.client.discriminator},
                {name: "Grund", value: guildBan.reason || "Kein Grund angegeben"},
            )
            .setTimestamp()
        sendToLog(guild, embed);
	},
};
