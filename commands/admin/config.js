const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const DB = require('../../utils/db/dbController.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Konfiguriert den Bot')
        .setDefaultMemberPermissions( PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('fact')
                .setDescription('Konfiguriert den Fact of the Day')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('channel')
                        .setDescription('Setzt den Channel in dem die Fakten angezeigt werden sollen')
                        .addChannelOption(option => option.setName('channel').setDescription('Der Channel in dem die Fakten angezeigt werden sollen').setRequired(true))
                    )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('time')
                        .setDescription('Setzt die Zeit wann die Fakten angezeigt werden sollen')
                        .addStringOption(option => option.setName('time').setDescription('Die Zeit wann die Fakten angezeigt werden sollen').setRequired(true))
                    )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('disable')
                        .setDescription('Deaktiviert den Fact of the Day')
                    )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('language')
                        .setDescription('Setzt die Sprache der Fakten')
                        .addStringOption(option => 
                            option
                                .setName('language')
                                .setDescription('Die Sprache der Fakten')
                                .addChoices(
                                    {name: "Deutsch", value: "de"},
                                    {name: "Englisch", value: "en"},
                                )
                                .setRequired(true))
                    )
                )
        .addSubcommand(subcommand =>
            subcommand
                .setName('log')
                .setDescription('Konfiguriert den Log Channel')
                .addChannelOption(option => option.setName('channel').setDescription('Der Channel in dem die Logs angezeigt werden sollen').setRequired(true))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('joinrole')
                .setDescription('Setzt die Rolle die einem Benutzer beim Betreten des Servers gegeben wird')
                .addRoleOption(option => option.setName('role').setDescription('Die Rolle die einem Benutzer beim Betreten des Servers gegeben wird').setRequired(true))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Zeigt die aktuellen Einstellungen an')
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tos')
                .setDescription('(De)aktiviert ob Regeln akzeptiert werden müssen')
                .addBooleanOption(option => option.setName('tos').setDescription('Ob Regeln akzeptiert werden müssen').setRequired(true))
            )


        ,
    async execute(interaction, client) {

        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();


        const command = interaction.options.getSubcommand();
        new DB().checkGuildExists(interaction.guild.id);

        if(subcommandGroup === 'fact'){

            if (subcommand === 'channel') {
                const channel = interaction.options.getChannel('channel');
                await interaction.reply({content: "Der Fact of the day Channel wurde auf " + channel.name + " gesetzt!", ephemeral: true });
                new DB().query("UPDATE guilds SET factChannel = ? WHERE guildID = ?", [channel.id, interaction.guild.id]);
                return;
            }

            if (subcommand === 'time') {

                // if not in format hh:mm
                if(!interaction.options.getString('time').match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
                    await interaction.reply({content: "Bitte gib eine gültige Zeit im Format hh:mm an!", ephemeral: true });
                    return;
                }
                const time = interaction.options.getString('time');
                await interaction.reply({content: "Die Zeit für den Fact of the day wurde auf " + time + " gesetzt!", ephemeral: true });
                new DB().query("UPDATE guilds SET factTime = ? WHERE guildID = ?", [time, interaction.guild.id]);
                return;
            }
    
            if (subcommand === 'disable') {
                await interaction.reply({content: "Der Fact of the day wurde deaktiviert!", ephemeral: true });
                new DB().query("UPDATE guilds SET factChannel = ? WHERE guildID = ?", [null, interaction.guild.id]);
                return;
            }
    
            if (subcommand === 'language') {
                const language = interaction.options.getString('language');
                await interaction.reply({content: "Die Sprache für den Fact of the day wurde erfolgreich geändert!", ephemeral: true });
                new DB().query("UPDATE guilds SET factLang = ? WHERE guildID = ?", [language, interaction.guild.id]);
                return;
            }
        }

        if(subcommand === 'log'){
            const channel = interaction.options.getChannel('channel');
            await interaction.reply({content: "Der Log Channel wurde auf " + channel.name + " gesetzt!", ephemeral: true });
            new DB().query("UPDATE guilds SET logChannel = ? WHERE guildID = ?", [channel.id, interaction.guild.id]);
            return;
        }

        if(subcommand === 'joinrole'){
            const role = interaction.options.getRole('role');
            await interaction.reply({content: "Die Joinrole wurde auf " + role.name + " gesetzt!", ephemeral: true });
            new DB().query("UPDATE guilds SET joinRole = ? WHERE guildID = ?", [role.id, interaction.guild.id]);
            return;
        }

        if(subcommand === 'info'){
            const guild = await new DB().query("SELECT * FROM guilds WHERE guildID = ?", [interaction.guild.id]);

            const embed = new EmbedBuilder()
                .setTitle("Einstellungen für " + interaction.guild.name)
                .setColor("Random")
                .setThumbnail(interaction.guild.iconURL())
                .addFields(
                    {name: "Fact of the Day", value: guild[0].factChannel ? "Aktiviert" : "Deaktiviert"},
                    {name: "Fact of the Day Channel", value: guild[0].factChannel ? "<#" + guild[0].factChannel + ">" : "Nicht gesetzt", inline: true},
                    {name: "Fact of the Day Zeit", value: guild[0].factTime ? guild[0].factTime : "Nicht gesetzt", inline: true},
                    {name: "Fact of the Day Sprache", value: guild[0].factLang ? guild[0].factLang : "Nicht gesetzt", inline: true},
                    {name: "Log Channel", value: guild[0].logChannel ? "<#" + guild[0].logChannel + ">" : "Deaktiviert"},
                    {name: "Joinrole", value: guild[0].joinRole ? "<@&" + guild[0].joinRole + ">" : "Deaktiviert"},
                )
                .setTimestamp()
                .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
            
            await interaction.reply({embeds: [embed]});
            return;
        }

        if(subcommand === 'tos'){
            const tos = interaction.options.getBoolean('tos');
            await interaction.reply({content: "Die TOS wurde " + (tos ? "aktiviert" : "deaktiviert") + "!", ephemeral: true });
            new DB().query("UPDATE guilds SET tos = ? WHERE guildID = ?", [tos ? 1 : 0, interaction.guild.id]);
            return;
        }


    },
};
