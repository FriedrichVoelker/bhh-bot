const playerListMap = {};


const playerList = {
    get(guild) {
        return playerListMap[guild];
    },
    add(guild, player) {
        playerListMap[guild] = player;
    },
    remove(guild) {
        playerListMap[guild] = undefined;
    },
    has(guild){
        return playerListMap[guild] !== undefined;
    }
}
module.exports = { playerList }