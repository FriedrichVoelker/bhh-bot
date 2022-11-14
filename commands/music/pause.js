const { AudioPlayerStatus, createAudioPlayer, getVoiceConnection  } = require('@discordjs/voice');
const {SlashCommandBuilder} = require('discord.js');
const {playerList} = require('../../utils/playerList.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the current song'),
    async execute(interaction, client) {
        const connection = getVoiceConnection(message.guild.id);
        if(!connection){
            await interaction.reply({content:"❌ Ich muss in einem voice channel sein um dies zu tun!", ephemeral: true});
        }   

        await interaction.deferReply({ephemeral: true});
        let player = createAudioPlayer();
        if(playerList.has(message.guild.id)){
            player = playerList.get(message.guild.id);
        }else{
            
            await interaction.reply({content: "❌ Es läuft derzeitig kein Audioplayer!", ephemeral: true});
            return
        }

            if(player.state.status == AudioPlayerStatus.Playing) {
                player.pause();
                await interaction.reply({content: "⏸️ Pausiert!", ephemeral: true});

            }else if(player.state.status == AudioPlayerStatus.Paused){
                player.unpause();
                await interaction.reply({content: "▶️ Fortgesetzt!", ephemeral: true});
            }


            return;
    }
}