const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const {playerList} = require('../../util/playerList.js');
module.exports = {
    name: "stop",
    category: "music",
    description: "Stops music",
    run: async(client, message, args) => {
        try{
            message.delete();
        }catch(e){
            console.log(e);
        }
        const connection = getVoiceConnection(message.guild.id);
        if(connection) {
            connection.destroy()
            if(playerList.has(message.guild.id)){
                playerList.remove(message.guild.id);
            }
        }else{
            const answer = await message.channel.send("❌ Ich muss in einem voice channel sein um dies zu tun!");
            setTimeout(() => {
                answer.delete();
            }, 5000)
        }
        return;
    }
}