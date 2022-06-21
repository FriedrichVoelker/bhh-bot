const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const {playerList} = require('../../util/playerList.js');
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
            try{
                message.delete();
            }catch(e){
                console.log(e);
            }
            let player = createAudioPlayer();

            if(playerList.has(message.guild.id)){
                player = playerList.get(message.guild.id);
            }else{
                playerList.add(message.guild.id, player);
            }
            player.on('error', console.error);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
                connection.destroy();
                if(playerList.has(message.guild.id)){
                    playerList.remove(message.guild.id);
                }
            });

            player.on('disconnect', () => {
                connection.destroy();
                if(playerList.has(message.guild.id)){
                    playerList.remove(message.guild.id);
                }
            })

            const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter : 'audioonly' });
            const resource = createAudioResource(stream);
            await player.play(resource);
            connection.subscribe(player);
        }else{
            message.channel.send("❌ Du musst in einem voice channel sein um dies zu tun!");
        }
    }
}
