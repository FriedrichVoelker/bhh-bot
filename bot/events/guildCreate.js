const { Events } = require('discord.js');
const DB = require('../utils/db/dbController.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild) {    
        const db = new DB();
        db.query("SELECT * FROM guilds WHERE guildID = ?", [guild.id], (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                db.query("INSERT INTO guilds (guildID) VALUES (?)", [guild.id]);
            }
        });
	},
};
