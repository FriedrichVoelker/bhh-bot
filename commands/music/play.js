const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const {playerList} = require('../../util/playerList.js');

module.exports = {
    name: "play",
    category: "music",
    description: "Plays music",
    usage: "command <link>",
    run: async(client, message, args) => {

        if(args.length === 0){
            const answer = await message.channel.send("❌ Du musst einen Link zu einem Video angeben!");
            setTimeout(() => {
                try{
                message.delete();
                answer.delete();
                }catch(e){
                    console.log(e);
                }
            }, 5000);
            return;
        }

        if (message.member.voice.channel) {

            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.member.voice.channel.guild.id,
                adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
            });
            message.delete()
            let player = createAudioPlayer();

            if(playerList.has(message.guild.id)){
                player = playerList.get(message.guild.id);
            }else{
                playerList.add(message.guild.id, player);
            }

            player.on('error', console.error);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
            });

            player.on('disconnect', () => {
                connection.destroy();
            })
            const stream = ytdl(args[0], { filter : 'audioonly' });
            const resource = createAudioResource(stream);
            await player.play(resource);
            connection.subscribe(player);
        }else{
            const answer = await message.channel.send("❌ Du musst in einem voice channel sein um dies zu tun!");
            setTimeout(() => {
                message.delete();
                answer.delete();
            }, 5000);
        }
    }
}