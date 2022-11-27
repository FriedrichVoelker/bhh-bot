const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webhook')
        .setDescription('Sendet eine Nachricht über einen Webhook')
        .setDefaultMemberPermissions( PermissionFlagsBits.ManageWebhooks)
        .setDMPermission(false)
        .addStringOption(option => option.setName('message').setDescription('Die Nachricht die der Webhook schreiben soll').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('Der Name des Webhooks').setRequired(false))
        .addChannelOption(option => option.setName('channel').setDescription('Der Channel in dem der Webhook schreiben soll').setRequired(false))
        .addStringOption(option => option.setName("color").setDescription("Die Farbe des Embeds (Standard: #00eaff)").setRequired(false))
        .addStringOption(option => option.setName("avatar").setDescription("Der Avatar des Webhooks").setRequired(false))
        .addStringOption(option => option.setName('title').setDescription('Titel der Nachricht (Standard: Information)').setRequired(false)),
    async execute(interaction, client) {
        interaction.deferReply();
        const message = interaction.options.getString('message');
        const title = interaction.options.getString('title') || "Information";
        const color = interaction.options.getString('color') || "#00eaff";
        const avatar = interaction.options.getString('avatar') || client.user.displayAvatarURL();
        const name = interaction.options.getString('name') || client.user.username;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(message)
            .setTimestamp()

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const webhooks = await channel.fetchWebhooks();

        let webhook = webhooks.find(webhook => webhook.token && webhook.name === name);
        if(!webhook) {
            webhook = await channel.createWebhook({
                name: name,
                avatarURL: avatar,
            });
        }
        await webhook.send({
            embeds: [embed],
            avatarURL: avatar,
            name: name,
        });
        await webhook.delete();
        await interaction.deleteReply();
    }
};