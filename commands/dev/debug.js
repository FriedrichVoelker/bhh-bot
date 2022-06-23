const {Permissions} = require("discord.js")
module.exports = {
  name: "debug",
  category: "dev",
  description: "Debug",
  run: async (client, message, args) => {
    if(client.application.owner){
      if(message.member.id != client.application.owner.id){
        return
      }
    }else{
      await client.application.fetch();
      let isOwner = false;
      client.application.owner.members.forEach(owner => {
        if(owner.user.id == message.member.id){
          isOwner = true;
        }
      });
      if(!isOwner) return;
    }



    const filter = (m) => m.author.id === message.author.id;
    await message.channel
      .awaitMessages({filter, 
        max: 1,
        time: 10000,
        errors: ['time']
      })
      .then(async (collected) => {
        if (collected.first().content == "cancel") {
          message.reply("Command cancelled.");
        }
        console.log("collected: " + collected.first().content);
      })
      .catch(() => {
        message.reply("You took too long! Goodbye!");
      });
  },
};
