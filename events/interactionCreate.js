const { Events } = require('discord.js');


const {generateRoleMenu, handleRoleMenu, handleRoleMenuRemove, handleClickAddButton, handleClickRemoveButton, updateRoleMenu} = require("../utils/roleMenuConfigHandler.js");
const {generateTicketChannel, closeTicket, adminCloseTicket} = require("../utils/ticketModalHandler.js");

module.exports = {
	name: Events.InteractionCreate,
	execute(interaction, client) {

        if(interaction.isSelectMenu()) {
            const menuArgs = interaction.customId.split(" : ");

            if(menuArgs[0] == "rolemenu_config") {
        
                generateRoleMenu(interaction, client);
                return;
            }
        
            if(menuArgs[0] == "rolemenu_picker") {
                handleRoleMenu(interaction, client);
                return;
            }
        
            if(menuArgs[0] == "rolemenu_picker_remove") {
                handleRoleMenuRemove(interaction, client);
                return;
            }
        
            if(menuArgs[0] == "rolemenu_config_update"){
                updateRoleMenu(interaction, client);
                return;
            }
        }


        if(interaction.isModalSubmit()) {
            if(interaction.customId == "ticket_modal") {
                generateTicketChannel(interaction, client);
                return;
            }
        }

        if(interaction.isButton()){
            
    if(interaction.customId == "closeTicket") {
        closeTicket(interaction, client);
        return;
    }
    if(interaction.customId.startsWith("adminCloseTicket")) {
        adminCloseTicket(interaction, client);
        return;
    }

    if(interaction.customId.startsWith("rolemenu_button_add")) {
        handleClickAddButton(interaction, client);
        return;
    }

    if(interaction.customId.startsWith("rolemenu_button_remove")) {
        handleClickRemoveButton(interaction, client);
        return;
    }
        }

	},
};
