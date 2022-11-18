const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

const gifs = require('../../static/json/gifs.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('peitsche')
        .setDescription('Peitscht jemanden aus')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers | PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName('user').setDescription('Der zu peitschende Nutzer')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const whipGifs = gifs.whips;

        const randomGif = whipGifs[Math.floor(Math.random() * whipGifs.length)];

        const embed = new EmbedBuilder()
            .setTitle('Peitsche')
            .setDescription(`<@${interaction.user.id}> peitscht${user ? " <@" + user.id + "> aus" : ""}!`)
            .setImage(randomGif)
            .setColor('Random')
            .setTimestamp()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        
        await interaction.reply({embeds: [embed]});
    },
};