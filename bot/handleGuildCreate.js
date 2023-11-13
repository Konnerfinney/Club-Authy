const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function handleGuildCreate(guild) {
  try {
    // Create a new channel called "new-members"
    const channel = await guild.channels.create({
      name: 'new-members',
      type: 0, // 'GUILD_TEXT' for text channels
      permissionOverwrites: [
        {
          id: guild.id, // Default role for @everyone
          allow: [PermissionsBitField.Flags.ViewChannel],
          deny: [PermissionsBitField.Flags.SendMessages],
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

  } catch (error) {
    console.error('Error creating new members channel:', error);
  }
}

module.exports = handleGuildCreate;
