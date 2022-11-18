const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const gifs = require('../../static/json/gifs.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tomato')
        .setDescription('Werfe eine Tomate')
        .addUserOption(option => option.setName('user').setDescription('Der zu bewerfende Nutzer')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const tomatoGifs = gifs.throwTomatoes;

        const randomGif = tomatoGifs[Math.floor(Math.random() * tomatoGifs.length)];

        const embed = new EmbedBuilder()
            .setTitle('Tomate')
            .setDescription(`<@${interaction.user.id}> wirft eine Tomate${user ? " auf <@" + user.id + "> " : ""}!`)
            .setImage(randomGif)
            .setColor('Random')
            .setTimestamp()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        
        await interaction.reply({embeds: [embed]});
    }
};