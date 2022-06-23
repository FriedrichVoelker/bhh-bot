const { Permissions } = require("discord.js")
module.exports = {
  name: "clear",
  category: "moderation",
  description: "Lösche die letzten x Nachrichten",
  run: async (client, message, args) => {
    if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)){
        try{
            message.delete();
        }catch(e){
            console.log(e);
        }
        const answer = await message.channel.send("❌ Du brauchst die Berechtigung `MANAGE_MESSAGES` oder Admin Rechte für diesen Befehl")
        setTimeout(function () {
            answer.delete();
          }, 5000);
        return;
    }

    if(!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)){
        const answer = await message.channel.send("❌ Ich brauche die Berechtigung `MANAGE_MESSAGES` oder Admin Rechte für diesen Befehl")
        setTimeout(function () {
            answer.delete();
          }, 5000);
        return;
    }

    let msgamount = 50;
    let channel = message.channel;


    if(args.length > 0){
        if(isNaN(args[0]) || args[0] <= 0){
        const answer = await message.channel.send("❌ " + args[0] + " ist keine valide Zahl");
        setTimeout(function () {
            answer.delete();
          }, 5000);
        return;
        } 
        msgamount = args[0];
    }
    msgamount > 99 ? msgamount = 99 : ""

    // if(args.length >= 2){

    // }
    let answer = await message.channel.send("Lösche die letzten " + msgamount + " Nachrichten");
    const messages = await channel.messages.fetch({limit: msgamount})
    try{
        await channel.bulkDelete(messages);
    }catch(e){}
    answer = await message.channel.send("`" + messages.size + "` Nachrichten erfolgreich gelöscht")
    setTimeout(function () {
        answer.delete();
      }, 5000);
    return;


    }
};
