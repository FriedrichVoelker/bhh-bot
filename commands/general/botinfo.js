const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Zeigt Informationen über den Bot an!'),
	async execute(interaction, client) {

        interaction.author = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle("Botinfo")
            .setColor("Random")
            .setTimestamp(new Date())
            .setAuthor({name: interaction.author.username, iconURL: interaction.author.displayAvatarURL()})
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {name: "Username", value: `${client.user.username}#${client.user.discriminator}`, inline: true},
                {name: "ID", value: `${client.user.id}`, inline: true},
                {name: "Erstellt", value: `<t:${convertIDtoUnix(client.user.id)}:R>`, inline: true},
                {name: "Repository", value: "[GitHub](https://github.com/FriedrichVoelker/bhh-bot)"},
                {name: "Profilbild von", value: `<@465908135006175232>`, inline: true},
                {name: "Programmiert von", value: `<@268394842168623108>`},
                {name: "Programmiert mit", value: "[Node.js v16.9.1](https://nodejs.org/en/) und [discord.js v14.6.0](https://discord.js.org/#/)", inline: true},
                {name: "Version", value: `v${require('../../package.json').version}`, inline: true},


                // {name: "Bot:", value: `**Username:** ${client.user.username}#${client.user.discriminator}\n**Erstellt:** <t:${convertIDtoUnix(client.user.id)}:R>\n**Repository:** [GitHub](https://github.com/FriedrichVoelker/bhh-bot)\n**Profilbild von:** <@465908135006175232>\n**Version:** 2.0`, inline: false}
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