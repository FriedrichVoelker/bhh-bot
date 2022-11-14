const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {SlashCommandBuilder} = require('discord.js');
const ytdl = require('ytdl-core');

const {playerList} = require('../../utils/playerList.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Spielt Musik ab')
        .addStringOption(option => option.setName('url').setDescription('URL des Videos').setRequired(true)),
    async execute(interaction, client) {

        if(interaction.options.getString("url") == null){
            interaction.reply({content:"❌ Du musst einen Link zu einem Video angeben!", ephemeral: true});
            return;
        }
        await interaction.deferReply({ephemeral: true});

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
            });

            player.on('disconnect', () => {
                connection.destroy();
            })
            const stream = ytdl(interaction.options.getString("url") , { filter : 'audioonly' });
            const resource = createAudioResource(stream);
            await player.play(resource);
            connection.subscribe(player);
            // interaction.reply({content: "Musik wird abgespielt!", ephemeral: true});
            await interaction.deleteReply();
        }else{
            interaction.reply({content:"❌ Du musst in einem voice channel sein um dies zu tun!", ephemeral: true});
        }
    }
}