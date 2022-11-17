const { Events, EmbedBuilder } = require('discord.js');
const DB = require('../utils/db/dbController.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        let result = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [member.guild.id]);
        if(result.length == 0) return;
        

        if(result[0].tos == null || result[0].tos == 0) {
            if(result[0].joinRole != null) {
                try{
                    member.roles.add(result[0].joinRole);
                }catch(e) {
                    console.log(e);
                }
            }
        }

        if(result[0].logChannel != null) {
            const logChannel = member.guild.channels.cache.get(result[0].logChannel);
            if(logChannel != null) {
                const embed = new EmbedBuilder()
                    .setTitle("Member Joined")
                    .setColor("#00ff00")
                    .setThumbnail(member.user.displayAvatarURL())
                    .addFields(
                        {name: "Member", value: (member.user.username + "#" + member.user.discriminator)},
                        {name: "Member ID", value: member.user.id},
                    )
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            }
        }
    },
};