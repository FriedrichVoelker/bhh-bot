const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
module.exports = {
    name: "rick",
    category: "fun",
    description: "Rick",
    run: async(client, message, args) => {
        if (message.member.voice.channel) {

            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.member.voice.channel.guild.id,
                adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
            });
            message.delete()
            const player = createAudioPlayer();
            player.on('error', console.error);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
            });
            const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter : 'audioonly' });
            const resource = createAudioResource(stream);
            await player.play(resource);
            connection.unsubscribe();
            connection.subscribe(player);
        }else{
            message.channel.send("❌ Du musst in einem voice channel sein um dies zu tun!");
        }
    }
}