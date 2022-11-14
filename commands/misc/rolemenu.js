const { SlashCommandBuilder,PermissionFlagsBits,SelectMenuBuilder ,ActionRowBuilder  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolemenu')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setDescription('Erstellt ein Rollenmenü')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Erstellt ein Rollenmenü')
            .addChannelOption(option => option.setName('channel').setDescription('Der Channel in dem das Rollenmenü erstellt werden soll').setRequired(true))
            .addStringOption(option => option.setName('titel').setDescription('Die Nachricht die in dem Rollenmenü angezeigt werden soll').setRequired(true)) 
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Löscht ein Rollenmenü')
                .addStringOption(option => option.setName('id').setDescription('Die ID der Nachricht in der das Rollenmenü erstellt wurde').setRequired(true))
                .addStringOption(option => option.setName('titel').setDescription('Die Nachricht die in dem Rollenmenü angezeigt werden soll').setRequired(true))
        )
        
        ,
        
	async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        if(subcommand === 'create'){
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('titel');


            const guild = interaction.guild;
            await interaction.guild.roles.fetch()
            const roles = interaction.guild.roles.cache;

            const roleAmount = roles.size;

            // console.log(roles);
            // await interaction.deferReply();
            const config = new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setMaxValues(roleAmount)
                    .setMinValues(1)
                    .setCustomId('rolemenu_config : ' + guild.id + " : " + channel + " : " + title)
                    .setPlaceholder('Wähle die Rollen')
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
            // await channel.send({components: [config], ephemeral: true });
            interaction.reply({components: [config], ephemeral: true });
            return;
        }
        if(subcommand === 'update'){
            const embedid = interaction.options.getString('id');
            const title = interaction.options.getString('titel');
            const channel = interaction.channel;

            const guild = interaction.guild;
            await interaction.guild.roles.fetch()
            const roles = interaction.guild.roles.cache;

            const roleAmount = roles.size;

            const config = new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setMaxValues(roleAmount)
                    .setMinValues(1)
                    .setCustomId('rolemenu_config_update : ' + embedid  + " : " + title)
                    .setPlaceholder('Wähle die Rollen')
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
            interaction.reply({components: [config], ephemeral: true });
            return;
        }
    },
};