const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports = {
    name: "meme",
    category: "fun",
    aliases: ["randommeme"],
    description: "Gets a random meme from a subreddit",
    usage: "command [subreddit] (Standard: ProgrammerHumour)",
    run: async(client, message, args) => {
        let sub = "ProgrammerHumor"

        try{
            await message.delete()
        }catch(e){
            console.log(e)
        }

        if(args.length > 0) {
            sub = args[0]
        }
        const msg = await message.channel.send(`Fetching a random meme from r/${sub}...`);

        const url = `https://www.reddit.com/r/${sub}/hot/.json?limit=100`
        const memes = await fetch(url).then(res => res.json())

        const children = memes.data.children
        const meme = children[Math.floor(Math.random() * children.length)].data

        const embed = {
            color: "RANDOM",
            title: meme.title,
            timestamp: new Date(),
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            image:{
                url: meme.url
            },
            url: "https://reddit.com" + meme.permalink,
            footer: {
                text: "Von: https://reddit.com/r/" + sub,
            }
        }


        message.channel.send({ embeds: [embed] });

        msg.delete();
    }
}