const {SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Erstellt eine Nachricht zum akzeptieren der Regeln')
        .setDefaultMemberPermissions( PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageWebhooks)
        .setDMPermission(false)
        .addChannelOption(option => option.setName('channel').setDescription('Der Channel in dem die Nachricht angezeigt werden soll').setRequired(false))
    ,
    async execute(interaction) {

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        
        const embed = new EmbedBuilder()
            .setTitle("Regeln")
            .setColor("Green")
            .setDescription("Klicke auf den Button um die Regeln zu akzeptieren")
            .setTimestamp()
            const buttonsRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`tos_accept_button`)
                .setLabel("Akzeptieren")
                .setStyle(ButtonStyle.Success),
        )
        interaction.reply({content: "Regeln Nachricht wurde erstellt", ephemeral: true});
        channel.send({embeds: [embed], components: [buttonsRow]});
    },
};