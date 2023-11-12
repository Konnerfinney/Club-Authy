require('dotenv').config();
const { Client, GatewayIntentBits, Events, Partials } = require('discord.js');
const handleGuildCreate = require('./handleGuildCreate'); // Import the server join handler

//const fetch = require('node-fetch'); // Ensure you've installed node-fetch or axios


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    //GatewayIntentBits.MessageReactions,
    GatewayIntentBits.GuildMessageReactions, // Add this intent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    console.log("reaction added");
    // Check if the reaction is the correct emote and if the reaction is in the "new-members" channel
    if (reaction.message.channel.name === 'new-members' &&
        reaction.emoji.name === '✅' && // The emoji you used when creating the message
        !user.bot) { // Ignore bot reactions
      try {
        // Fetch the member from the guild
        const member = await reaction.message.guild.members.fetch(user.id);
        // Send a DM to the user
        const dmChannel = await member.createDM();
        await dmChannel.send('Please input your full name and email for authentication purposes.');
      } catch (error) {
        console.error('Error sending DM:', error);
      }
    }
  });

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

client.on('messageCreate', message => {
    console.log(message.content); // Check to see if the bot is receiving messages
    if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN); // Ensure this is the correct environment variable
