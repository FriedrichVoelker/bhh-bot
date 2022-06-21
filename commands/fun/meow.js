const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const {playerList} = require('../../util/playerList.js');
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
            const resource = createAudioResource(require("path").join(__dirname, "../../static/sounds/meow.mp3"));
            await player.play(resource);
            connection.subscribe(player);
        }else{
            message.channel.send("❌ Du musst in einem voice channel sein um dies zu tun!");
        }
    }
}
