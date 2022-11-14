const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zeigt alle Befehle an'),
    async execute(interaction, client) {
        await interaction.reply({content: "Hilfe wird geladen...", ephemeral: true });
        const commands = client.commands;
        let help = "";
        commands.forEach(command => {
            help += `/${command.data.name} - ${command.data.description}\n`;
        });
        interaction.editReply({content: help});
    },
};