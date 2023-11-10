const { PermissionsBitField } = require('discord.js');

async function handleGuildCreate(guild) {
  try {
    // Create a new channel called "new-members"
    const channel = await guild.channels.create({
        name: 'new-members',
        type: 0, // Use 'GUILD_TEXT' for text channels
        permissionOverwrites: [
          {
            id: guild.id, // Default role for @everyone
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.SendMessages],
          }
        ],
      });

    // Send a message in the "new-members" channel
    const message = await channel.send('Click the emote to authenticate 👇');

    // React to the message with an emote
    await message.react('✅');

  } catch (error) {
    console.error('Error creating new members channel:', error);
  }
}
module.exports = handleGuildCreate;