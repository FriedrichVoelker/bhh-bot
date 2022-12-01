const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xkcd')
        .setDescription('Zeigt ein xkcd Comic an')
        .addStringOption(option => option.setName('comic').setDescription('Der Comic der angezeigt werden soll'))
        .addBooleanOption(option => option.setName('current').setDescription('Zeigt den neusten Comic')),
    async execute(interaction, client) {
        let queryString = "";

        if(interaction.options.getBoolean('current')){
            queryString = "https://xkcd.com/info.0.json";
        } else if(interaction.options.getString('comic')){
            queryString = "https://xkcd.com/" + interaction.options.getString('comic') + "/info.0.json";
        } else {
            const currentComic = await fetch("https://xkcd.com/info.0.json").then(response => response.json());
            const randomComic = randomInt(currentComic.num);
            queryString = "https://xkcd.com/" + randomComic + "/info.0.json";
        }

        
        
        const response = await fetch(queryString);
        if(response.status != 200){
            interaction.reply({content: "Der Comic konnte nicht gefunden werden", ephemeral: true});
            return;
        }
        
        
        
        const body = await response.json();
        const embed = new EmbedBuilder()
            .setTitle(body.safe_title)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setImage(body.img)
            .setURL("https://xkcd.com/" + body.num)
            .setFooter({text: `https://xkcd.com/${body.num}`})
            .setTimestamp()
        interaction.reply({embeds: [embed]});
    }
}

function randomInt(max) {
    return Math.floor(Math.random() * (max - 1 + 1)) + 1;
}