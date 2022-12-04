const { Events } = require('discord.js');
const DB = require('../utils/db/dbController.js');

module.exports = {
	name: Events.GuildDelete,
	async execute(guild) {
        const db = new DB();
        db.query("DELETE FROM guilds WHERE guildID = ?", [guild.id], (err, result) => {
            if (err) throw err;
        });
	},
};
