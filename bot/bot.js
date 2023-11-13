require('dotenv').config();
const { Client, GatewayIntentBits, Events, Partials, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const handleGuildCreate = require('./handleGuildCreate'); // Import the server join handler

//const fetch = require('node-fetch'); // Ensure you've installed node-fetch or axios


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    //GatewayIntentBits.MessageReactions,
    GatewayIntentBits.GuildMessageReactions, // Add this intent
    //GatewayIntentBits.MessageComponents,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
  console.log('Bot is ready!');
});
// client.on('messageReactionAdd', (reaction, user) => {
//   // Your logic here
//   console.log(`A reaction is added by ${user.tag}`);
//   // You can add more logic to handle the reaction
// });


client.on('guildCreate', async (guild) => {
    console.log(`Joined new guild: ${guild.name} (id: ${guild.id})`);
    await handleGuildCreate(guild);
    // Construct the payload you want to send
    const payload = {
      discordServerId: guild.id,
      discordServerName: guild.name,
    };
  
    // Send the payload to your endpoint
    try {
      const response = await fetch('http://localhost:3000/api/newServer', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Handle any response from your endpoint
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  });



client.login(process.env.DISCORD_BOT_TOKEN); // Ensure this is the correct environment variable

client.on('interactionCreate', async interaction => {
  // Check if the interaction is a button click
  if (interaction.isButton() && interaction.customId === 'authenticate') {
    // Handle button click to show a modal
    const modal = new ModalBuilder()
      .setCustomId('authenticationModal')
      .setTitle('Authentication');

    // Add input fields for full name, email, and comment
    const fullNameInput = new TextInputBuilder()
      .setCustomId('fullName')
      .setLabel("Full Name")
      .setStyle(TextInputStyle.Short);

    const emailInput = new TextInputBuilder()
      .setCustomId('email')
      .setLabel("Email")
      .setStyle(TextInputStyle.Short);

    const commentInput = new TextInputBuilder()
      .setCustomId('comment')
      .setLabel("Comment")
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
      new ActionRowBuilder().addComponents(fullNameInput),
      new ActionRowBuilder().addComponents(emailInput),
      new ActionRowBuilder().addComponents(commentInput)
    );

    await interaction.showModal(modal);
  }

  // Handle modal submission
  if (interaction.isModalSubmit() && interaction.customId === 'authenticationModal') {
    // Process the submitted data
    // ... handle modal submission ...
  }
});