const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const {SlashCommandBuilder} = require('discord.js');
const ytdl = require('ytdl-core');
const {playerList} = require('../../utils/playerList.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop Musik'),
    async execute(interaction, client) {
        await interaction.deferReply({ephemeral: true});
        const connection = getVoiceConnection(interaction.guild.id);
        if(connection) {
            connection.disconnect()
            if(playerList.has(interaction.guild.id)){
                playerList.remove(interaction.guild.id);
            }
            // await interaction.reply({content: "⏹️ Gestoppt!", ephemeral: true});
        await interaction.deleteReply();
        }else{
           interaction.reply({content: "❌ Ich muss in einem voice channel sein um dies zu tun!", ephemeral: true});
        }
        return;
    }
}