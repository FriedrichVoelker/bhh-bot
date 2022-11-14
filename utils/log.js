const DB = require('./db/dbController.js');


async function sendToLog(guild, embed){
    let result = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [guild.id]);
    if(result.length == 0) return;
    if(result[0].logChannel == null) return;

    const logChannel = guild.channels.cache.get(result[0].logChannel);
    if(logChannel != null) {
        logChannel.send({ embeds: [embed] });
    }
}

module.exports = {
    sendToLog
}