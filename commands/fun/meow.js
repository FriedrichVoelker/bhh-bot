const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: "meow",
    category: "fun",
    description: "Meow",
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
            const resource = createAudioResource(require("path").join(__dirname, "../../static/sounds/meow.mp3"));
            await player.play(resource);
            connection.subscribe(player);
        }else{
            message.channel.send("❌ Du musst in einem voice channel sein um dies zu tun!");
        }
    }
}