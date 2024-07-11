const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const BOT_DEVELOPER_ID = "268394842168623108";
const BOT_ARTIST_ID = "465908135006175232";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Zeigt Informationen über den User an!')
        .addUserOption(option => option.setName('user').setDescription('Der User von dem du Informationen haben willst').setRequired(false)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

		let specials = [];

		if(member.id === BOT_DEVELOPER_ID) {
			specials.push("**Bot Developer**");
		}
		if(member.id === BOT_ARTIST_ID) {
			specials.push("**Bot Artist**");
		}
		if(member.permissions.toArray().includes("ADMINISTRATOR")) {
			specials.push("Administrator");
		}
		if(user.bot) {
			specials.push("Bot");
		}
		if(member.id === interaction.guild.ownerId) {
			specials.push("Server Owner");
		}



        const embed = new EmbedBuilder()
            .setTitle("Userinfo")
            .setColor("Random")
            .setTimestamp(new Date())
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                {name: "Name", value: `${user.username}`, inline: true},
                {name: "ID", value: `${user.id}`, inline: true},
                {name: "Erstellt", value: `<t:${convertIDtoUnix(user.id)}:R>`, inline: true},
                {name: "Nickname", value: `${member.nickname ? member.nickname : "Nichts"}`, inline: true},
                {name: "Farbe", value: `${member.displayHexColor}`, inline: true},
                {name: "Rollen", value: `${member.roles.cache.map(role => role.toString()).join(" ")}`, inline: true},
                {name: "Permissions", value: `${member.permissions.toArray().includes("Administrator") ? "Administrator" : member.permissions.toArray().join(", ")}`, inline: true},
            )

		if(specials.length > 0) {
			embed.addFields(
				{name: "Spezial", value: specials.join(",\n"), inline: true}
			)
		}

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