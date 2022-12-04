const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Zeigt Informationen über den Server an!'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle("Serverinfo")
            .setColor("Random")
            .setTimestamp(new Date())
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "Name", value: `${interaction.guild.name}`, inline: true},
                {name: "ID", value: `${interaction.guild.id}`, inline: true},
                {name: "Erstellt", value: `<t:${convertIDtoUnix(interaction.guild.id)}:R>`, inline: true},
                {name: "Mitglieder", value: `${interaction.guild.memberCount}`, inline: true},
                {name: "Besitzer", value: `<@${interaction.guild.ownerId}>`, inline: true},
                {name: "Region", value: `${interaction.guild.region}`, inline: true},
                {name: "Boosts", value: `${interaction.guild.premiumSubscriptionCount}`, inline: true},
                {name: "Boost Level", value: `${interaction.guild.premiumTier}`, inline: true},
            )

        interaction.reply({embeds: [embed]});
    },
};

function convertIDtoUnix(id) {
    /* Note: id has to be str */
    var bin = (+id).toString(2);
    var unixbin = '';
    var unix = '';
    var m = 64 - bin.length;
    unixbin = bin.substring(0, 42 - m);
    unix = parseInt(unixbin, 2) + 1420070400000;
    return (unix / 1000).toString().split(".")[0];
}

