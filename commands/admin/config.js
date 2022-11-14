const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const DB = require('../../utils/db/dbController.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Konfiguriert den Bot')
        .setDefaultMemberPermissions( PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageWebhooks)
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
    },
};
