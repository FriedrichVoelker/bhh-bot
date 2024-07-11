const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Syntax /poll <Frage> <Option1> ... <OptionN> [Emoji1] ... [EmojiN] [Zeit]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Erstelle eine Umfrage')
		.addStringOption(option => option.setName('frage').setDescription('Die Frage, die gestellt werden soll').setRequired(true))
		.addStringOption(option => option.setName('optionen').setDescription('Die Optionen, die zur Auswahl stehen (getrennt durch "|")').setRequired(true))
		.addStringOption(option => option.setName('emojis').setDescription('Die Emojis, die für die Optionen verwendet werden sollen').setRequired(false))
		.addIntegerOption(option => option.setName('zeit').setDescription('Die Zeit, die die Umfrage laufen soll').setRequired(false)),
	async execute(interaction, client) {
		const question = interaction.options.getString('frage');
		const options = interaction.options.getString('optionen').split('|');
		const emojis = interaction.options.getString('emojis') ? interaction.options.getString('emojis').split(' ') : ['🔵', '🔴', '🟢', '🟡', '🟣', '🟤', '⚪', '⚫', '🟠', '🟦'];
		const time = interaction.options.getInteger('zeit');

		if (options.length > emojis.length) {
			return await interaction.reply({content: 'Es wurden mehr Optionen als Emojis angegeben.', ephemeral: true});
		}

		let fields = []

		for (let i = 0; i < options.length; i++) {
			fields.push({name: options[i].trim() , value:  emojis[i], inline: true });
		}

		const channel = interaction.channel;

		await interaction.reply({content: "Umfrage erstellt", ephemeral: true});


		const description = `**${question}**` +(time != null ? `\n\nDie Umfrage endet <t:${Math.floor((new Date().getTime() + (time * 1000) )/1000)}:R>` : '');
		const embed = new EmbedBuilder()
			.setTitle('Umfrage')
			.setDescription(description)
			.setColor('Random')
			.setTimestamp()
			.setFooter({text: 'Umfrage von <@' + interaction.user.username, iconURL: interaction.user.displayAvatarURL()});


		embed.addFields(fields);

		//const message = await interaction.reply({embeds: [embed]});

		const message = await channel.send({embeds: [embed]});

		for (let i = 0; i < options.length; i++) {
			await message.react(emojis[i]);
		}

		if (time) {
			setTimeout(async () => {
				const reactedMessage = await message.fetch();
				const reactions = reactedMessage.reactions.cache;

				const results = [];

				for (let i = 0; i < options.length; i++) {
					results.push(reactions.get(emojis[i]).count - 1);
				}

				const resultEmbed = new EmbedBuilder()
					.setTitle('Ergebnisse')
					.setDescription(`**${question}**` + `\n\nDie Umfrage endete <t:${Math.floor(new Date().getTime()/1000)}:R>`)
					.setColor('Random')
					.setTimestamp()
					.setFooter({text: 'Umfrage von ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL()});

				let resultFields = [];

				for (let i = 0; i < options.length; i++) {
					resultFields.push({name: options[i], value: `${results[i]}`, inline: true });
				}

				console.log(resultFields);

				resultEmbed.addFields(resultFields);

				await message.edit({embeds: [resultEmbed]});
				
			}, time * 1000);
		}

	},
};
