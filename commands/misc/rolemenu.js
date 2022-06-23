const { MessageActionRow, MessageButton, Permissions  } = require("discord.js");
let botMsg = null;
module.exports = {
  name: "rolemenu",
  category: "misc",
  description: "Creates a rolemenu",
  run: async (client, message, args) => {
    if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)){
        try{
            message.delete();
        }catch(e){
            console.log(e);
        }
        const answer = await message.channel.send("❌ Du brauchst die Berechtigung `MANAGE_ROLES` oder Admin Rechte für diesen Befehl")
        setTimeout(function () {
            answer.delete();
          }, 5000);
        return;
    }

    if (args.length == 0) {
      try {

        try{
            message.delete();
        }catch(e){
            console.log(e);
        }

        botMsg = await message.channel.send("**Starte Einstellung des Rollenmenüs. Du kannst jederzeit mit** `cancel` **abbrechen**")
        let roles = [];
        let channel = await askQuestion("Welcher Channel?", message);
        await botMsg.edit(botMsg.content + "\nChannel: " + channel)
        let title = await askQuestion("Welcher Titel?", message);
        await botMsg.edit(botMsg.content + "\nTitel: " + title)
        let roleAmount = await askQuestion("Wieviele Rollen?", message);

        roleAmount = await checkAmount(roleAmount, message);
        botMsg.edit(botMsg.content + "\nRollen: ")

        for (let i = 0; i < roleAmount; i++) {
          let role = await askQuestion("Welche Rolle?", message);
        //   roles.push(role.split("<@&")[1].split(">")[0]);
          if(role.startsWith("<@&")){
              roles.push(role.split("<@&")[1].split(">")[0]);
          }else if(!isNaN(role) && role > 0){
              roles.push(role)
          }
          let proccesing = await message.channel.send("Lade....");
          await botMsg.edit(botMsg.content + " -" + message.guild.roles.cache.find((r) => r.id === role.startsWith("<@&") ? role.split("<@&")[1].split(">")[0] : role).name);
          try{
            proccesing.delete()
          }catch(e){}
        }
        channel = message.guild.channels.cache.get(
          channel.split("<#")[1].split(">")[0]
        );
        let description = "";
        roles.forEach((role) => {
          description += "<@&" + role + ">\n";
        });

        description +=
          "\nKlicke auf die Knöpfe unten um dir die Rolle zu geben/zu entfernen";

        const embed = {
          color: "RANDOM",
          title: title,
          timestamp: new Date(),
          description: description,
        };
        const row = new MessageActionRow();

        roles.forEach((role) => {
          const roleObj = message.guild.roles.cache.find((r) => r.id === role);
          row.addComponents(
            new MessageButton()
              .setCustomId("RoleMenu:" + role)
              .setLabel(roleObj.name)
              .setStyle("SECONDARY")
          );
        });
        channel.send({ embeds: [embed], components: [row] });
        try{
            botMsg.delete()
        }catch(e){}
        return;
      } catch (e) {
        const answer = await message.channel.send("❌ Fehler im Befehl.\n Benutze `rolemenu` oder `rolemenu <#channel> <Titel> <@Rolle1> <@Rolle2>...`")
        setTimeout(function () {
            answer.delete();
          }, 5000);
        return;
      }
    } else if (args.length >= 3) {
      try {

        try{
            message.delete();
        }catch(e){
            console.log(e);
        }
        let channel = message.guild.channels.cache.get(
          args[0].split("<#")[1].split(">")[0]
        );
        let title = args[1];
        let roles = [];
        for (let i = 2; i < args.length; i++) {
            let role = args[i];
            if(role.startsWith("<@&")){
                roles.push(role.split("<@&")[1].split(">")[0]);
            }else if(!isNaN(role) && role > 0){
                roles.push(""+role)
            }
        }
        let description = "";
        roles.forEach((role) => {
          description += "<@&" + (role+"") + ">\n";
        });
        description +=
          "\nKlicke auf die Knöpfe unten um dir die Rolle zu geben/zu entfernen";

        const embed = {
          color: "RANDOM",
          title: title,
          timestamp: new Date(),
          description: description,
        };
        const row = new MessageActionRow();

        roles.forEach((role) => {
          const roleObj = message.guild.roles.cache.find((r) => r.id === role);
          row.addComponents(
            new MessageButton()
              .setCustomId("RoleMenu:" + role)
              .setLabel(roleObj.name)
              .setStyle("SECONDARY")
          );
        });
        channel.send({ embeds: [embed], components: [row] });
      } catch (e) {
        const answer = await message.channel.send("❌ Fehler im Befehl.\n Benutze `rolemenu` oder `rolemenu <#channel> <Titel> <@Rolle1> <@Rolle2>...`")
        setTimeout(function () {
            answer.delete();
          }, 5000);
        return;
      }
    }else{

        try{
            message.delete();
        }catch(e){
            console.log(e);
        }
        const answer = await message.channel.send("❌ Fehler im Befehl.\n Benutze `rolemenu` oder `rolemenu <#channel> <Titel> <@Rolle1> <@Rolle2>...`")
        setTimeout(function () {
            answer.delete();
          }, 5000);
    }
  },
};

async function checkAmount(amount, message) {
  if (amount && !isNaN(amount) && amount > 0) {
    return amount;
  }
  let roleAmount = await askQuestion(
    "❌ Das ist keine Valide Zahl!\nWieviele Rollen?",
    message
  );
  return await checkAmount(roleAmount, message);
}

async function askQuestion(question, message) {
  return new Promise(async function (resolve, reject) {
    let filter = (m) => m.author.id === message.author.id;
    const botQuestion = await message.channel.send(question);

    message.channel
      .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
      .then(async (reply) => {
        reply = reply.first();
        try {
            botQuestion.delete();
          reply.delete();
        } catch (e) {
          console.log(e);
        }

        if(reply.content.toLowerCase() == "cancel" || reply.content.toLowerCase() == "abbrechen"){
            const answer = await message.channel.send("Command abgrebrochen"); 
            handleCancel()
            setTimeout(async function () {
              await answer.delete();
            }, 2000);
            return;
        }

        return resolve(reply.content);
      })
      .catch(async (collected) => {
        try {
            botQuestion.delete();
        } catch (e) {
        console.log(e);
        }
        const answer = await message.channel.send("❌ Du hast zu lange gewartet");
        setTimeout(async function () {
          await answer.delete();
        }, 2000);
      });
  });
}

async function handleCancel(){
    try{
        botMsg.delete()
    }catch(e){}
    return;
}