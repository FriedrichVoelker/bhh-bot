const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const {playerList} = require('../../util/playerList.js');

const {queue} = require('../../util/queueManager.js');

module.exports = {
    name: "queue",
    category: "music",
    description: "Plays music",
    usage: "command <link>",
    run: async(client, message, args) => {
        // Todo: queue
        try {
            message.delete();
        }catch(e){console.log(e)}
            message.channel.send("👷‍♂️ Coming soon");
            setTimeout(() => {
                message.delete();
            }, 5000);
    }
}