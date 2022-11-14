const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle , ChannelType   } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Erstellt ein Ticket')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Erstellt ein Ticket')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Fügt einen Benutzer zu einem Ticket hinzu')
                .addUserOption(option => option.setName('user').setDescription('Der Benutzer der hinzugefügt werden soll').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Entfernt einen Benutzer von einem Ticket')
                .addUserOption(option => option.setName('user').setDescription('Der Benutzer der entfernt werden soll').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Schließt ein Ticket')
        )
        ,
        
	async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if(subcommand == "create"){
            const modal = new ModalBuilder()
                .setTitle('Ticket erstellen')
                .setCustomId('ticket_modal')


            const ticketInput = new TextInputBuilder()
                .setCustomId('ticketInput')
                .setLabel("Was möchtest du melden?")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new ActionRowBuilder().addComponents(ticketInput);

            // Add inputs to the modal
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        }else if(subcommand == "add"){
            const user = interaction.options.getUser('user');

            const currChannel = interaction.channel;
            const currChannelName = currChannel.name;
            if(currChannelName.startsWith("ticket-")){

                if(currChannelName != "ticket-" + interaction.user.username.toLowerCase() +  interaction.user.discriminator){
                    await interaction.reply({content: "Nur der Ersteller des Tickets kann andere Benutzer hinzufügen", ephemeral: true});
                    return;
                }
                const guild = interaction.guild;
                const member = guild.members.cache.get(user.id);
                await currChannel.permissionOverwrites.create(member, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
                await interaction.reply({content: "Der Benutzer " + user.username + " wurde dem Ticket hinzugefügt", ephemeral: true});
            }else{
                await interaction.reply("Dieser Befehl kann nur in einem Ticket verwendet werden!");
            }


        }else if(subcommand == "remove"){
            const user = interaction.options.getUser('user');

            const currChannel = interaction.channel;
            const currChannelName = currChannel.name;
            if(currChannelName.startsWith("ticket-")){

                if(currChannelName != "ticket-" + interaction.user.username.toLowerCase() +  interaction.user.discriminator){
                    await interaction.reply({content: "Nur der Ersteller des Tickets kann andere Benutzer entfernen", ephemeral: true});
                    return;
                }

                const guild = interaction.guild;
                const member = guild.members.cache.get(user.id);
                await currChannel.permissionOverwrites.delete(member);
                await interaction.reply({content: "Der Benutzer " + user.username + " wurde aus dem Ticket entfernt", ephemeral: true});
            }else{
                await interaction.reply("Dieser Befehl kann nur in einem Ticket verwendet werden!");
            }

        }else if(subcommand == "close"){
            const currChannel = interaction.channel;
            const currChannelName = currChannel.name;
            if(currChannelName.startsWith("ticket-")){

                if(currChannelName != "ticket-" + interaction.user.username.toLowerCase() +  interaction.user.discriminator){
                    await interaction.reply({content: "Nur der Ersteller des Tickets kann das Ticket schließen", ephemeral: true});
                    return;
                }

                await currChannel.delete();

                const ticketLogs = interaction.guild.channels.cache.find(c => c.name == "ticket-logs" && c.type == ChannelType.GuildText );
                if(!ticketLogs) return;
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

            }else{
                await interaction.reply("Dieser Befehl kann nur in einem Ticket verwendet werden!");
            }
        }
    }
}
