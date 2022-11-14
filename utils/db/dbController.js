const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

let connection = null;

module.exports = class DB {

    connect(){
        connection = mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD ||"",
            database: process.env.DB_DATABASE || "bhhbot"
        });
    }

    async checkGuildExists(guildid){
        let resp = await this.query("SELECT * FROM guilds WHERE guildID = ?", [guildid]);
        if(resp.length == 0){
            await this.query("INSERT INTO guilds (guildID) VALUES (?)", [guildid]);
            return;
        }
        return;
    }

    async query(query, values){
        if(!connection){
            this.connect();
        }
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}