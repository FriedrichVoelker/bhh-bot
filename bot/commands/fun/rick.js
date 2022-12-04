const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {SlashCommandBuilder} = require('discord.js');
const ytdl = require('ytdl-core');
const {playerList} = require('../../utils/playerList.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rick')
		.setDescription('Plays Never gonna give you up by Rick Astley'),
    async execute(interaction, client) {
        if (interaction.member.voice.channel) {

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.voice.channel.guild.id,
                adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
            });
            let player = createAudioPlayer();

            if(playerList.has(interaction.guild.id)){
                player = playerList.get(interaction.guild.id);
            }else{
                playerList.add(interaction.guild.id, player);
            }
            player.on('error', console.error);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
                connection.destroy();
                if(playerList.has(interaction.guild.id)){
                    playerList.remove(interaction.guild.id);
                }
            });

            player.on('disconnect', () => {
                connection.disconnect();
                connection.destroy();
                if(playerList.has(interaction.guild.id)){
                    playerList.remove(interaction.guild.id);
                }
            })

            const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter : 'audioonly' });
            const resource = createAudioResource(stream);
            await player.play(resource);
            connection.subscribe(player);
            interaction.reply({content: "Never gonna give you up!", ephemeral: true});
        }else{
            interaction.reply({content: "❌ Du musst in einem voice channel sein um dies zu tun!", ephemeral: true});
        }
    }
}
