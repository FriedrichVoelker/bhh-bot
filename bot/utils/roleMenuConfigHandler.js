const { SelectMenuBuilder ,ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');

async function generateRoleMenu(interaction, client) {

    const guild = interaction.guild;
    await interaction.guild.roles.fetch()
    const menuArgs = interaction.customId.split(" : ");
    const channel = guild.channels.cache.get(menuArgs[1]);
    const title = menuArgs[2];
    const onlyOne = menuArgs[3] === "false";
    const roles = interaction.values.map(role => guild.roles.cache.get(role));

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor("Random")
        .setTimestamp()
        .setDescription(`Bitte wähle die Rollen aus, die du haben möchtest.`)
        .addFields(
            { name: "Rollen:", value: `${roles.map(role => `<@&${role.id}>`).join("\n")}`, inline: true },
        );

    if(onlyOne){
        embed.addFields(
            {name: "Hinweis:", value: "Du kannst nur eine Rolle auswählen."}
            );
    }


    const buttonsRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`rolemenu_button_add : ${embed.id}`)
                .setLabel("Rollen hinzufügen")
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`rolemenu_button_remove : ${embed.id}`)
                    .setLabel("Rollen entfernen")
                    .setStyle(ButtonStyle.Danger)
        )
    interaction.reply({content: "Rollenmenü wurde erstellt", ephemeral: true});
    channel.send({embeds: [embed], components: [buttonsRow]});
}

async function updateRoleMenu(interaction, client){
    const embedID = interaction.customId.split(" : ")[1];
    const newTitle = interaction.customId.split(" : ")[2];
    const message = await interaction.channel.messages.fetch(embedID);
    const roles = interaction.values.map(role => interaction.guild.roles.cache.get(role));
    const isOnlyOne = interaction.customId.split(" : ")[3] === "false";
    // ipdate the title


    const newEmbed = new EmbedBuilder()
        .setTitle(newTitle)
        .setColor("Random")
        .setTimestamp()
        .setDescription(`Bitte wähle die Rollen aus, die du haben möchtest.`)
        .addFields(
            { name: "Rollen:", value: `${roles.map(role => `<@&${role.id}>`).join("\n")}`, inline: true },
        );


    if(isOnlyOne){
        newEmbed.addFields(
            {name: "Hinweis:", value: "Du kannst nur eine Rolle auswählen."}
            );
    }
    
    message.edit({embeds: [newEmbed]});

    interaction.reply({content: "Rollenmenü wurde aktualisiert", ephemeral: true});


}


async function handleClickAddButton(interaction, client){


    const rolesEmbed = interaction.message.embeds[0];
    const rolesIDS = rolesEmbed.fields[0].value.split("\n").map(role => role.replace("<@&", "").replace(">", ""));
    const roles = rolesIDS.map(role => interaction.guild.roles.cache.get(role));
    const roleAmount = roles.length;



        const picker = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setMaxValues(roleAmount)
                .setMinValues(0)
                .setCustomId('rolemenu_picker : ' + interaction.message.id)
                .setPlaceholder('Wähle die Rollen zum hinzufügen')
                .addOptions(
                    roles.map(role => {
                        return {
                            label: role.name,
                            value: role.id,
                            description: role.name,
                        }
                    }
                )
            )
        );

    interaction.reply({components: [picker], ephemeral: true});
}

async function handleClickRemoveButton(interaction, client){


    const rolesEmbed = interaction.message.embeds[0];
    const rolesIDS = rolesEmbed.fields[0].value.split("\n").map(role => role.replace("<@&", "").replace(">", ""));
    const roles = rolesIDS.map(role => interaction.guild.roles.cache.get(role));
    const roleAmount = roles.length;



        const picker = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setMaxValues(roleAmount)
                .setMinValues(0)
                .setCustomId('rolemenu_picker_remove : ' + interaction.message.id)
                .setPlaceholder('Wähle die Rollen zum entfernen')
                .addOptions(
                    roles.map(role => {
                        return {
                            label: role.name,
                            value: role.id,
                            description: role.name,
                        }
                    }
                )
            )
        );

    interaction.reply({components: [picker], ephemeral: true});

}


async function handleRoleMenu(interaction, client) {
    const guild = interaction.guild;
    const roles = interaction.values.map(role => guild.roles.cache.get(role));
    const member = guild.members.cache.get(interaction.user.id);

    const messageID = interaction.customId.split(" : ")[1];
    const message = await interaction.channel.messages.fetch(messageID);
    const embed = message.embeds[0];
    const onlyOne = embed.fields.length === 2;

    if (interaction.values.length > 0) {


        if (onlyOne) {
            if(interaction.values.length > 1){
                interaction.reply({content: "Du kannst nur eine Rolle auswählen.", ephemeral: true});
                return;
            }

            const currUserRoles = member.roles.cache.filter(role => role.id !== guild.roles.everyone.id);
            if(currUserRoles.size > 0){
                const embedRoles = embed.fields[0].value.split("\n").map(role => role.replace("<@&", "").replace(">", ""));
                const embedRolesIDS = embedRoles.map(role => guild.roles.cache.get(role));

                if(embedRolesIDS.some(role => currUserRoles.has(role.id))){
                    interaction.reply({content: "Du kannst nur eine Rolle auswählen und hast bereits eine.", ephemeral: true});
                    return;
                }
            }

        }

        roles.forEach(role => {
            if (!member.roles.cache.has(role.id)) {
                member.roles.add(role);
            }
        });
        interaction.reply({content: "Deine Rollen wurden aktualisiert", ephemeral: true});
        return;
    }
    interaction.reply({content: "Du hast keine Rollen ausgewählt", ephemeral: true});
}

async function handleRoleMenuRemove(interaction, client) {
    const guild = interaction.guild;
    const roles = interaction.values.map(role => guild.roles.cache.get(role));
    const member = guild.members.cache.get(interaction.user.id);
    if (interaction.values.length > 0) {

        roles.forEach(role => {
            if (member.roles.cache.has(role.id)) {
                member.roles.remove(role);
            }
        });
        interaction.reply({content: "Deine Rollen wurden aktualisiert", ephemeral: true});
        return;
    }
    interaction.reply({content: "Du hast keine Rollen ausgewählt", ephemeral: true});
}

module.exports = {
    generateRoleMenu,
    handleRoleMenu,
    handleRoleMenuRemove,
    handleClickAddButton,
    handleClickRemoveButton,
    updateRoleMenu
}


