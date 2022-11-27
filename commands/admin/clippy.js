const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clippy')
        .setDescription('Lässt Clippy eine Nachricht schreiben')
        .setDefaultMemberPermissions( PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addStringOption(option => option.setName('message').setDescription('Die Nachricht die Clippy schreiben soll').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('Der Channel in dem Clippy schreiben soll').setRequired(false))
        .addStringOption(option => option.setName('title').setDescription('Titel der Nachricht (Standard: Clippy)').setRequired(false)),
    async execute(interaction) {
        interaction.deferReply();
        const message = interaction.options.getString('message');
        const title = interaction.options.getString('title') || "Clippy";
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor("#00eaff")
            .setDescription(message)
            .setTimestamp()

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const webhooks = await channel.fetchWebhooks();

        let webhook = webhooks.find(webhook => webhook.name === "Clippy");
        if(!webhook) {
            webhook = await channel.createWebhook({
                name: "Clippy",
                avatar: './static/images/Clippy.jpeg',
            });
        }
        webhook.send({
            embeds: [embed],
        });
        await interaction.deleteReply();
    },
};
