const { MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports = {
    name: "fact",
    category: "fun",
    aliases: ["facts", "fakt", "fakten"],
    description: "Tells a random fact",
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

        // const embed = new MessageEmbed()
        // .setColor("RANDOM")
        // .setTitle("Unnützer Fakt")
        // .setTimestamp()
        // .setAuthor(message.author.username, message.author.displayAvatarURL())
        // .setFooter("Bot made by: " + owner.user.username + "#" + owner.user.discriminator, owner.user.displayAvatarURL())
        // // .setThumbnail(client.user.displayAvatarURL())
        // .setDescription(fact.text)

        // .addField("General:", `**Bot Prefix:** ${confPrefix}\n**Help command:** ${confPrefix}help`, false)
        // .addField("Bot:", `**Username:** ${client.user.username}#${client.user.discriminator}\n**Created:** <t:${convertIDtoUnix(client.user.id)}:R>`, false)
        // .addField("Owner:", `**Bot made by:** ${owner.user.username}#${owner.user.discriminator}\n**Account created:** <t:${convertIDtoUnix(owner.user.id)}:R>\n**Joined Server:** <t:${(owner.joinedTimestamp/1000).toString().split(".")[0]}:R>`, false)
        // .setDescription(`Bot made by: ${owner.user.username}#${owner.user.discriminator}\nBot Prefix: ${confPrefix}\n\nHelp command: ${confPrefix}help`);

        const embed = {
            color: "RANDOM",
            title: "Unnützer Fakt",
            timestamp: new Date(),
            description: fact.text,
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            footer: {
                text: "Quelle: " + fact.source + " " + fact.source_url,
            }
        }


        message.channel.send({ embeds: [embed] });

        msg.delete();
    }
}