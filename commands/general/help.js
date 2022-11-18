const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zeigt alle Befehle an')
        .addStringOption(option => option.setName('command').setDescription('Der Befehl, den du Hilfe zu benötigst')),
    async execute(interaction, client) {
        // await interaction.reply({content: "Hilfe wird geladen...", ephemeral: true });

        const command = interaction.options.getString('command');

        if(!command) {
            const embed = new EmbedBuilder()
                .setTitle("Hilfe")
                .setColor("Random")
                .setTimestamp()
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setDescription("Hier findest du alle Befehle, die du verwenden kannst.")
                .setThumbnail(client.user.displayAvatarURL())

            let ephemeral = false;

            Object.keys(client.commandCategories).forEach((category, val) => {
                const commands = client.commandCategories[category];

                let commandList = "";

                commands.forEach((command) => {

                    if(command.data.default_member_permissions) {

                            if(interaction.member.permissions.has(command.data.default_member_permissions)) {
                                ephemeral = true;
                                commandList += `/${command.data.name} - ${command.data.description}\n`
                            }
                        } else {

                            commandList += `/${command.data.name} - ${command.data.description}\n`

                        }
                    } 
                )
                if(commandList !== "") {
                    embed.addFields({name: category.toUpperCase(), value: commandList, inline: false})
                }
            })
            embed.addFields({name: "\u200B", value: "```Benutze /help <command> für nähere Informationen zu einem Befehl```", inline: false})
            interaction.reply({embeds: [embed], ephemeral: ephemeral});
        }else {
            console.log(client.commands.get(command))

            const found = client.commands.get(command);
            console.log(found.data)
            
            if(!found) return interaction.reply({content: "Dieser Befehl existiert nicht!", ephemeral: true});

            if(found.data.default_member_permissions && !interaction.member.permissions.has(found.data.default_member_permissions)) return interaction.reply({content: "Dieser Befehl existiert nicht!", ephemeral: true});
            let ephemeral = false;
            const embed = new EmbedBuilder()
                .setTitle(`Hilfe zu /${found.data.name}`)
                .setColor("Random")
                .setTimestamp()
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setDescription(found.data.description)
                .setThumbnail(client.user.displayAvatarURL())

            if(found.data.options) {
                let options = ""
                found.data.options.forEach((option) => {
                    options += `${option.name} - ${option.description}\n`
                })
                embed.addFields({name: "Optionen", value: options, inline: false})
            }

            if(found.data.default_member_permissions) {
                ephemeral = true;

                const permissions = new PermissionsBitField(found.data.default_member_permissions).toArray();

                let permissionString = "";

                permissions.forEach((permission) => {
                    permissionString != "" ? permissionString += ",\n" : "";
                    permissionString += `${permission}`
                })

                embed.addFields({name: "Benötigte Berechtigungen", value: permissionString, inline: false})
            }

            interaction.reply({embeds: [embed], ephemeral: ephemeral});




        }
    },
};