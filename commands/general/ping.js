const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	async execute(interaction, client) {
        const now = Date.now();
		await interaction.reply({content: "🏓 Pinging....", ephemeral: true });
            interaction.editReply({content: `🏓 Pong!
                Latency is ${Math.floor(Date.now() - now)}ms
                API Latency is ${Math.round(client.ws.ping)}ms`});
	},
};
