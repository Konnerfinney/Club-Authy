const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function createNewRole(guild){
  try {
    console.log("Creating role");
    let role = await guild.roles.create({
      name: 'unauthenticated user',
      reason: 'Role for unauthenticated users',
    });
    console.log("Role Created");
    guild.channels.cache.forEach(channel => {
      channel.permissionOverwrites.edit(role, {
          ViewChannel: false
      });
    });
    console.log("Permissions set");
    return role;
  } catch (error) {
    console.error('Error creating new role:', error);
  }
}
async function handleGuildCreate(guild, role) {
    // Create a new channel called "new-members"
    const channel = await guild.channels.create({
      name: 'new-members',
      type: 0, // 'GUILD_TEXT' for text channels
      permissionOverwrites: [
        {
          id: guild.id, // Default role for @everyone
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: role.id, // The role we just created
          allow: [PermissionsBitField.Flags.ViewChannel],
        }
      ],
    });
    console.log('Creating button');
    // Create a button for authentication
    const confirm = new ButtonBuilder()
			.setCustomId('authenticate')
			.setLabel('Authenticate')
			.setStyle(ButtonStyle.Primary);
    console.log('Adding button to action row');
    const row = new ActionRowBuilder()
      .addComponents(confirm);
    console.log("Sending message");
    // Send a message in the "new-members" channel with the button
    const message = await channel.send({
      content: 'Click the button to authenticate:',
      components: [row],
    });
} 


module.exports = {handleGuildCreate, createNewRole};