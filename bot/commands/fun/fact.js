const { SlashCommandBuilder, CommandInteractionOptionResolver, EmbedBuilder } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports = {
    data: new SlashCommandBuilder()
        .setName("fact")
        .setDescription("Tells a random fact")
        .addStringOption(option => 
            option.setName("sprache")
                .setDescription("Sprache")
                .setRequired(false)
                .addChoices(
                    {name: "Deutsch", value: "de"},
                    {name: "Englisch", value: "en"},
                )
            ),
    async execute(interaction, client) {
        let lang = interaction.options.getString("sprache") || "de";

        const channel = interaction.guild.channels.cache.get(interaction.channelId);

        // API: https://uselessfacts.jsph.pl/

        await interaction.deferReply();
        const fact = await fetch("https://uselessfacts.jsph.pl/random.json?language="+lang).then(res => res.json());

        // const embed = {
        //     color: 0x00ff00,
        //     title: "Unnützer Fakt",
        //     timestamp: new Date(),
        //     description: fact.text + "\n\nQuelle: [" + fact.source + "](" + fact.source_url + ")",
        //     author: {
        //         name: message.author.username,
        //         icon_url: message.author.displayAvatarURL()
        //     },
        //     footer: {
        //         text: "Permalink: " + fact.permalink,
        //     }
        // }

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Unnützer Fakt")
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(fact.text + "\n\nQuelle: [" + fact.source + "](" + fact.source_url + ")")
            .setURL(fact.permalink)
            .setFooter({text: "Permalink: " + fact.permalink})



        await channel.send({ embeds: [embed] });
        await interaction.deleteReply();
    }
}