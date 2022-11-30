const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xkcd')
        .setDescription('Zeigt ein xkcd Comic an')
        .addStringOption(option => option.setName('comic').setDescription('Der Comic der angezeigt werden soll')),
    async execute(interaction, client) {
        let comic = interaction.options.getString('comic');
        if(comic === null){
            comic = "";
        }else{
            comic = "/" + comic;
        }
        const response = await fetch(`https://xkcd.com${comic}/info.0.json`);
        const body = await response.json();
        const embed = new EmbedBuilder()
            .setTitle(body.safe_title)
            .setImage(body.img)
            .setFooter({text: `xkcd.com/${body.num}`})
            .setTimestamp()
        interaction.reply({embeds: [embed]});
    }
}