const { config } = require("dotenv");
const { Client, Collection, Events, REST, Routes, SlashCommandBuilder, GatewayIntentBits, ChannelType, PermissionFlagsBits, ActivityType, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const DB = require("./utils/db/dbController.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require("path");


config({
    path: __dirname + "/.env"
});

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.MessageContent,

] });

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.commands = new Collection();
// let dbGuilds = [];

client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    // new DB().query("SELECT * FROM guilds", (err, result) => {
    //     if(err) throw err;
    //     dbGuilds = result;
    // });


    pickStatus()
    setInterval(() => {
        pickStatus();
    }, 60000);

    sendFactOfTheDay()
    setInterval(() => {
        sendFactOfTheDay();
    }, 60000);

    const slashCommands = [];


    readdirSync("./commands/").forEach(async dir =>  {
        const commands = readdirSync("./commands/" + dir + "/").filter(f => f.endsWith(".js"));

        for (let file of commands) {
            let command = require('./commands/' + dir + '/' + file);

            
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                slashCommands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    });

    const eventFiles = readdirSync("./events").filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require('./events/' + file);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }


    (async () => {
        try {
            console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashCommands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();

});


// Handle Commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


// Handle Rename User
// client.on(Events.Guild, async (oldMember, newMember) => {
//     if(oldMember.user.bot) return;
//     if(oldMember.nickname == newMember.nickname) return;

//     let result = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [oldMember.guildId]);
//     if(result.length == 0) return;
//     if(result[0].logChannel == null) return;

//     const logChannel = oldMember.guild.channels.cache.get(result[0].logChannel);
//     if(logChannel != null) {
//         const embed = new EmbedBuilder()
//             .setTitle("Nickname Changed")
//             .setColor("#ff0000")
//             .setThumbnail(oldMember.user.displayAvatarURL())
//             .addFields(
//                 {name: "Autor", value: oldMember.user.username + "#" + oldMember.user.discriminator},
//                 {name: "Vorher", value: oldMember.nickname || oldMember.user.username},
//                 {name: "Nachher", value: newMember.nickname || newMember.user.username},
//             )
//             .setTimestamp()
//         logChannel.send({ embeds: [embed] });
//     }
// });



async function sendFactOfTheDay(){

    let currTime = (new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()) + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes());


    new DB().query("SELECT * FROM guilds", (err, result) => {
        if (err) throw err;
        result.forEach(guild => {
            if(guild.factTime != null && guild.factChannel != null) {
                if(currTime == guild.factTime) {
                    client.channels.fetch(guild.factChannel).then(async channel => {
                        channel.send("Fact of the day");
                        const fact = await fetch("https://uselessfacts.jsph.pl/today.json?language="+(guild.factLang || "de")).then(res => res.json());
                        const embed = new EmbedBuilder()
                            .setColor("Random")
                            .setTitle("Unnützer Fakt")
                            .setTimestamp()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setDescription(fact.text + "\n\nQuelle: [" + fact.source + "](" + fact.source_url + ")")
                            .setURL(fact.permalink)
                            .setFooter({text: "Permalink: " + fact.permalink})
            
            
            
                        channel.send({ embeds: [embed] });
                    });
                }
            }
        });
    });
}


function pickStatus() {
    let status = require("./static/json/status.json");
    let pickedStatus = status.stati[Math.floor(Math.random() * status.stati.length)];

    let type;

    switch(pickedStatus.type) {
        case "PLAYING":
            type = ActivityType.Playing;
            break;
        case "WATCHING":
            type = ActivityType.Watching;
            break;
        case "LISTENING":
            type = ActivityType.Listening;
            break;
        case "STREAMING":
            type = ActivityType.Streaming;
            break;
        default:
            type = ActivityType.Playing;
            break;
    }

    client.user.setActivity(pickedStatus.text, { type: type });


}


client.login(process.env.DISCORD_TOKEN);