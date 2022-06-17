const queueList = {};

const queue = {
    add(guild, song){
        if(!queueList[guild]){
            queueList[guild] = [];
        }
        queueList[guild].push(song);
    },
    has(guild, song){
        if(!queueList[guild]){
            return false;
        }
        return queueList[guild].includes(song);
    },
    remove(guild, song){
        if(!queueList[guild]){
            return false;
        }
        const index = queueList[guild].indexOf(song);
        if(index === -1){
            return false;
        }
    },
    getNextSong(guild){
        if(!queueList[guild]){
            return null;
        }
        return queueList[guild].shift();
    },
    clear(guild){
        queueList[guild] = [];
    }
}

module.exports = { queue };