const {PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

async function generateTicketChannel(interaction, client){
    
    // find category for tickets
    let category = interaction.guild.channels.cache.find(c => c.name == "Tickets" && c.type == ChannelType.GuildCategory );
    if(!category) {
        // create category
        category = await interaction.guild.channels.create( {
            name: "Tickets",
            type: ChannelType.GuildCategory ,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });

        await interaction.guild.channels.create( {
            name: "ticket-logs",
            type: ChannelType.GuildText ,
            parent: category,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });
    }

    // // find support role
    // const supportRole = interaction.guild.roles.cache.find(r => r.name == "Support");
    // if(!supportRole) return interaction.reply({content: "Support role not found", ephemeral: true});

    // create channel

    const ticketInput = interaction.fields.getTextInputValue("ticketInput");
    const ticketChannel = await interaction.guild.channels.create( {
        name: `ticket-${interaction.user.username}#${interaction.user.discriminator}`,
        type: ChannelType.GuildText,
        parent: category,

    });

    const pingEveryone = ticketChannel.send({content: "@everyone"});
    pingEveryone.then(msg => msg.delete());

    // sync permissions with category
    await ticketChannel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true });

    const embed = new EmbedBuilder()
        .setTitle("Ticket erstellt")
        .setColor("Random")
        .setTimestamp()
        // .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
        .setDescription(`Dein Ticket wurde erstellt. Wir werden uns so schnell wie möglich darum kümmern.`)
        .addFields(
            { name: "Ticket erstellt von:", value: `<@${interaction.user.id}>`, inline: true },
            { name: "Ticket Nachricht:", value: `${ticketInput}`, inline: true },
            {name: "\u200B", value: "\u200B", inline: true},
            { name: "Commands:", value: `/ticket add <user> - fügt einen Nutzer hinzu`, inline: true },
            { name: "\u200B", value: "/ticket remove <user> - entfernt einen Nutzer wieder", inline: true },
        )
        // .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        // .addField("Deine Nachricht:", ticketInput)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Schließen")
                .setCustomId("closeTicket")
        )



    await ticketChannel.send({embeds: [embed], components: [row]});
    await interaction.reply({content: "Ticket erstellt!", ephemeral: true});

    
    const ticketLogs = interaction.guild.channels.cache.find(c => c.name == "ticket-logs" && c.type == ChannelType.GuildText );
    if(!ticketLogs) return;

    const logEmbed = new EmbedBuilder()
        .setTitle("Ticket erstellt")
        .setColor("Green")
        .setTimestamp()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Ticket wurde erstellt.`)
        .addFields(
            { name: "Ticket erstellt von:", value: `<@${interaction.user.id}>`, inline: true },
            { name: "Ticket Nachricht:", value: `${ticketInput}`, inline: true },
        )
    const adminRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Schließen")
                .setCustomId("adminCloseTicket : " + ticketChannel.id)
        )
    await ticketLogs.send({embeds: [logEmbed], components: [adminRow]});
}

async function closeTicket(interaction, client){
    const ticketChannel = interaction.channel;

    const user = interaction.user

    if(interaction.channel.name != `ticket-${user.username.toLowerCase()}${user.discriminator}`) return interaction.reply({content: "Du kannst nur dein eigenes Ticket schließen!", ephemeral: true});


    await ticketChannel.delete();



    const ticketLogs = interaction.guild.channels.cache.find(c => c.name == "ticket-logs" && c.type == ChannelType.GuildText );
    if(!ticketLogs) return

    const embed = new EmbedBuilder()
        .setTitle("Ticket geschlossen")
        .setColor("DarkRed")
        .setTimestamp()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Ticket wurde geschlossen.`)
        .addFields(
            { name: "Ticket geschlossen von:", value: `<@${interaction.user.id}>`, inline: true },
            {name: "Channel Name:", value: `${ticketChannel.name}`, inline: true},
        )
    
    await ticketLogs.send({embeds: [embed]});

    // await interaction.reply({content: "Ticket geschlossen!", ephemeral: true});
}

async function adminCloseTicket(interaction, client){
    const ticketChannelId = interaction.customId.split(" : ")[1];
    const ticketChannel = client.channels.cache.get(ticketChannelId);

    if(!ticketChannel) return interaction.reply({content: "Ticket nicht gefunden!", ephemeral: true});

    await ticketChannel.delete();
    interaction.reply({content: "Ticket geschlossen!", ephemeral: true});
    const ticketLogs = interaction.guild.channels.cache.find(c => c.name == "ticket-logs" && c.type == ChannelType.GuildText );
    if(!ticketLogs) return

    const embed = new EmbedBuilder()
        .setTitle("Ticket geschlossen")
        .setColor("DarkRed")
        .setTimestamp()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Ticket wurde von einem Admin geschlossen.`)
        .addFields(
            { name: "Ticket geschlossen von:", value: `<@${interaction.user.id}>`, inline: true },
            {name: "Channel Name:", value: `${ticketChannel.name}`, inline: true},
        )
    
    await ticketLogs.send({embeds: [embed]});
}




module.exports = {
    generateTicketChannel,
    closeTicket,
    adminCloseTicket
};