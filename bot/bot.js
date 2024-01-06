require('dotenv').config();
const { Client, GatewayIntentBits, Events, Partials, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Role} = require('discord.js');
const {createNewRole, handleGuildCreate} = require('./discordFunctions'); // Import the server join handler
; // Import the role creation function
//const fetch = require('node-fetch'); // Ensure you've installed node-fetch or axios
const botID = '1135021991171215482';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    //GatewayIntentBits.MessageReactions,
    GatewayIntentBits.GuildMessageReactions, // Add this intent
    //GatewayIntentBits.MessageComponents,
    GatewayIntentBits.GuildMembers, // Add this intent
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
async function removeUnauthRole(guildId, memberId){
  const guild = await client.guilds.fetch(guildId);
  const member = await guild.members.fetch(memberId);
  const roles = member.guild.roles.cache;
  let unAuthUserRole = null;
  roles.forEach(role => {
    if (role.name === 'unauthenticated user') {
        unAuthUserRole = role;
        console.log(`Found role with botId ${botID}: ${role.name}`);
    }
  });
  if (!unAuthUserRole) {
      console.log(`No role found with botId ${botID}`);
  }
  if (unAuthUserRole) {
    member.roles.remove(unAuthUserRole.id)
        .then(() => console.log(`Removed role from ${member.displayName}`))
        .catch(err => console.error(`Error removing role: ${err}`));
  } else {
      console.log(`Role not found`);
  }
}

client.on('guildMemberAdd', member => {

    const roles = member.guild.roles.cache;
    let unAuthUserRole = null;
    roles.forEach(role => {
      if (role.name === 'unauthenticated user') {
          unAuthUserRole = role;
          console.log(`Found role with botId ${botID}: ${role.name}`);
      }
  });
  
  if (!unAuthUserRole) {
      console.log(`No role found with botId ${botID}`);
  }
    console.log("New User Joined");
    if (unAuthUserRole) {
        member.roles.add(unAuthUserRole.id)
            .then(() => console.log(`Added role to ${member.displayName}`))
            .catch(err => console.error(`Error adding role: ${err}`));
    } else {
        console.log(`Role not found`);
    }
  });

client.on('guildCreate', async (guild) => {
    console.log(`Joined new guild: ${guild.name} (id: ${guild.id})`);
    const role = await createNewRole(guild);
    await handleGuildCreate(guild,role)
    // Construct the payload you want to send
    const payload = {
      discordServerId: guild.id,
      discordServerName: guild.name,
    };
  
  
    // Send the payload to your endpoint
    try {
      const response = await fetch('http://localhost:3000/api/createServer', {
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
      try{
      console.log("Submission");
      // Process the submitted data
      // ... handle modal submission ...
      const userName = interaction.fields.getTextInputValue('fullName');
      const userEmail = interaction.fields.getTextInputValue('email');
      const userComment = interaction.fields.getTextInputValue('comment');

      const discordServerId = interaction.guild.id;
      const discordUserId = interaction.user.id;

      // Construct the payload you want to send
      const payload = {
        userName: userName,
        userEmail: userEmail,
        userComment: userComment,
        discordServerId: discordServerId,
        discordUserId: discordUserId,
      };
      console.log(payload);
      await interaction.reply({ content: 'Your information has been submitted!', ephemeral: true });
      const res = await fetch(`http://localhost:3000/api/createUser`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
    
  }catch (error) {
    console.error('Error handling modal submission:', error);
    await interaction.reply({ content: 'There was an error submitting your information.', ephemeral: true });
  }}
});
module.exports = {removeUnauthRole}