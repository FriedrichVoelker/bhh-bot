const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Sends a random meme')
        .addStringOption(option =>
            option.setName('subreddit')
                .setDescription('The subreddit to get the meme from')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        let sub = interaction.options.getString('subreddit') || "ProgrammerHumor"
        const channel = interaction.guild.channels.cache.get(interaction.channelId);
        // await interaction.deferReply();
        // const message = await interaction.fetchReply()

        await interaction.deferReply();
        const meme = await getMeme(sub)

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(meme.title)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setURL("https://reddit.com" + meme.permalink)
            .setFooter({text: "Von: https://reddit.com/r/" + sub})

        if(meme.is_video){
            embed.setImage(meme.media.reddit_video.fallback_url)
        } else {
            embed.setImage(meme.url)
        }


        await channel.send({ embeds: [embed] });
        // await interaction.followUp({ content: "Meme von: https://reddit.com/r/" + sub, ephemeral: true });
        await interaction.deleteReply();
    },

};

async function getMeme(sub){
    // https://www.reddit.com/r/ProgrammerHumor/hot/.json?limit=100
    const url = `https://www.reddit.com/r/${sub}/hot/.json?limit=100`
    const memes = await fetch(url).then(res => res.json())

    const children = memes.data.children
    let meme = children[Math.floor(Math.random() * children.length)].data
    if(meme.stickied){
        meme = await getMeme(sub)
    }
    return meme
}