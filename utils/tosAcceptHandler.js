const DB = require('./db/dbController.js');

const {EmbedBuilder} = require('discord.js');

async function acceptTos(interaction){

    const member = interaction.member;
    const guild = interaction.guild;

    const db = new DB();
    let result = await db.query("SELECT * FROM guilds WHERE guildID = ? ", [guild.id]);
    if(result.length > 0){
        if(result[0].joinRole != null){
            const role = guild.roles.cache.get(result[0].joinRole);
            member.roles.add(role);
        }

        if(result[0].logChannel != null){
            const channel = guild.channels.cache.get(result[0].logChannel);
            const embed = new EmbedBuilder()
                .setTitle("Member hat Regeln akzeptiert")
                .setColor("Green")
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    {name: "User", value: member.user.username + "#" + member.user.discriminator},
                    {name: "ID", value: member.user.id},
                )
                .setTimestamp()
            channel.send({embeds: [embed]});
        }

    }
    interaction.reply({content: "Du hast die Regeln akzeptiert!", ephemeral: true});

}

module.exports = {acceptTos};