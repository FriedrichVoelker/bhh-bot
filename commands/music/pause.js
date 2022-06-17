const { joinVoiceChannel, AudioPlayerStatus, AudioPlayer, createAudioPlayer, getVoiceConnection, PlayerSubscription,  } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const {playerList} = require('../../util/playerList.js');
module.exports = {
    name: "pause",
    category: "music",
    aliases: ["unpause"],
    description: "Pauses music",
    run: async(client, message, args) => {

        try{
            message.delete();
        }catch(e){
            console.log(e);
        }
        const connection = getVoiceConnection(message.guild.id);
        if(!connection){
            const answer = await message.channel.send("❌ Ich muss in einem voice channel sein um dies zu tun!");
            setTimeout(() => {
                answer.delete();
            },5000);
        }   

        let player = createAudioPlayer();
        if(playerList.has(message.guild.id)){
            player = playerList.get(message.guild.id);
        }else{
            
            const answer = await message.channel.send("❌ Es läuft derzeitig kein Audioplayer!");
            setTimeout(() => {
                answer.delete();
            },5000);
            return
        }

            if(player.state.status == AudioPlayerStatus.Playing) {
                player.pause();

            }else if(player.state.status == AudioPlayerStatus.Paused){
                player.unpause();
            }


            return;
    }
}