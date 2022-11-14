const { config } = require("dotenv");
const { Client, Collection, Events, REST, Routes, SlashCommandBuilder, GatewayIntentBits, ChannelType, PermissionFlagsBits, ActivityType, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const DB = require("./utils/db/dbController.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {generateRoleMenu, handleRoleMenu, handleRoleMenuRemove, handleClickAddButton, handleClickRemoveButton, updateRoleMenu} = require("./utils/roleMenuConfigHandler.js");
const {generateTicketChannel, closeTicket, adminCloseTicket} = require("./utils/ticketModalHandler.js");

config({
    path: __dirname + "/.env"
});

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, 
    // GatewayIntentBits.GuildMemberAdd, 
    // GatewayIntentBits.GuildMemberRemove,
    // GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.GuildMessageTyping,

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

// On guild join
client.on(Events.GuildCreate, async guild => {
    const db = new DB();
    db.query("SELECT * FROM guilds WHERE guildID = ?", [guild.id], (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            db.query("INSERT INTO guilds (guildID) VALUES (?)", [guild.id]);
        }
    });
});

// On guild leave
client.on(Events.GuildDelete, async guild => {
    const db = new DB();
    db.query("DELETE FROM guilds WHERE guildID = ?", [guild.id], (err, result) => {
        if (err) throw err;
    });
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

// Handle Select Menus
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isSelectMenu()) return;
    const menuArgs = interaction.customId.split(" : ");

    if(menuArgs[0] == "rolemenu_config") {

        generateRoleMenu(interaction, client);
        return;
    }

    if(menuArgs[0] == "rolemenu_picker") {
        handleRoleMenu(interaction, client);
        return;
    }

    if(menuArgs[0] == "rolemenu_picker_remove") {
        handleRoleMenuRemove(interaction, client);
        return;
    }

    if(menuArgs[0] == "rolemenu_config_update"){
        updateRoleMenu(interaction, client);
        return;
    }


});

// Handle Modals
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    if(interaction.customId == "ticket_modal") {
        generateTicketChannel(interaction, client);
    }
});

// Handle Buttons
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if(interaction.customId == "closeTicket") {
        closeTicket(interaction, client);
        return;
    }
    if(interaction.customId.startsWith("adminCloseTicket")) {
        adminCloseTicket(interaction, client);
        return;
    }

    if(interaction.customId.startsWith("rolemenu_button_add")) {
        handleClickAddButton(interaction, client);
        return;
    }

    if(interaction.customId.startsWith("rolemenu_button_remove")) {
        handleClickRemoveButton(interaction, client);
        return;
    }



});

// Handle Messages delete
// client.on(Events.MessageDelete, async message => {
//     if(message.author.bot) return;
//     if(message.channel.type == ChannelType.DM) return;
//     if(message.channel.type == ChannelType.GroupDM) return;


//     // console.log(message)
//     let result = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [message.guildId]);
//     if(result.length == 0) return;
//     if(result[0].logChannel == null) return;

//     const logChannel = message.guild.channels.cache.get(result[0].logChannel);
//     if(logChannel != null) {
//         console.log(message)
//         const sendChannel = message.guild.channels.cache.get(message.channelId);
//         const embed = new EmbedBuilder()
//             .setTitle("Message Deleted")
//             .setColor("#ff0000")
//             .setThumbnail(message.author.displayAvatarURL())
//             .addFields(
//                 {name: "Author", value: message.author.username + "#" + message.author.discriminator},
//                 {name: "Channel", value: sendChannel.name},
//                 {name: "Nachricht", value: message.content || "Keine Nachricht"}
//             )
//             .setTimestamp()
//         logChannel.send({ embeds: [embed] });
//     }
// });

// Handle Join Event
client.on(Events.GuildMemberAdd, async member => {
    let result = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [member.guild.id]);
    console.log(member)
    if(result.length == 0) return;

    if(result[0].joinRole != null) {
        try{
            member.roles.add(result[0].joinRole);
        }catch(e) {
            console.log(e);
        }
    }

    if(result[0].logChannel != null) {
        const logChannel = member.guild.channels.cache.get(result[0].logChannel);
        if(logChannel != null) {
            const embed = new EmbedBuilder()
                .setTitle("Member Joined")
                .setColor("#00ff00")
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    {name: "Member", value: (member.user.username + "#" + member.user.discriminator)},
                    {name: "Member ID", value: member.user.id},
                )
                .setTimestamp()
            logChannel.send({ embeds: [embed] });
        }
    }
});

// Handle Leave Event
client.on(Events.GuildMemberRemove, async member => {
    let result = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [member.guild.id]);
    if(result.length == 0) return;

    if(result[0].logChannel != null) {
        const logChannel = member.guild.channels.cache.get(result[0].logChannel);
        if(logChannel != null) {
            const embed = new EmbedBuilder()
                .setTitle("Member Left")
                .setColor("#ff0000")
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    {name: "Member", value: (member.user.username + "#" + member.user.discriminator)},
                    {name: "Member ID", value: member.user.id},
                )
                .setTimestamp()
            logChannel.send({ embeds: [embed] });
        }
    }
});


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