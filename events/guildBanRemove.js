const { Events, EmbedBuilder } = require('discord.js');
const { sendToLog } = require('../utils/log.js');

module.exports = {
	name: Events.GuildBanRemove,
	async execute(guildBan) {    
        const user = guildBan.user;
        const guild = guildBan.guild;
        const embed = new EmbedBuilder()
            .setTitle("User entbannt")
            .setColor("Green")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                {name: "User", value: user.username + "#" + user.discriminator},
                {name: "ID", value: user.id},
                {name: "Entbannt von", value: guildBan.client.username + "#" + guildBan.client.discriminator}
            )
            .setTimestamp()
        sendToLog(guild, embed);
	},
};
