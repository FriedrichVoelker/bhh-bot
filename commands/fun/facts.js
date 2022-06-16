const { MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports = {
    name: "fact",
    category: "fun",
    aliases: ["facts", "fakt", "fakten"],
    description: "Tells a random fact",
    usage: "command [en/de]",
    run: async(client, message, args) => {
        const msg = await message.channel.send(`Fetching a random fact...`);
        let owner = await message.guild.members.fetch(process.env.BOT_OWNER_ID);
        let lang = "de"

        if(args.length > 0) {
            switch(args[0].toLowerCase()) {
                case "en":
                case "englisch":
                case "english":
                    lang = "en"
                    break;
                case "de":
                case "deutsch":
                case "deutschland":
                    lang = "de"
                    break;
                default:
                    lang = "de"
                    break;
                }
        }

        const fact = await fetch("https://uselessfacts.jsph.pl/random.json?language="+lang).then(res => res.json());

        const embed = {
            color: "RANDOM",
            title: "Unnützer Fakt",
            timestamp: new Date(),
            description: fact.text + "\n\nQuelle: [" + fact.source + "](" + fact.source_url + ")",
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            footer: {
                text: "Permalink: " + fact.permalink,
            }
        }


        message.channel.send({ embeds: [embed] });

        msg.delete();
    }
}