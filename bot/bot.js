require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const handleGuildCreate = require('./handleGuildCreate'); // Import the server join handler

//const fetch = require('node-fetch'); // Ensure you've installed node-fetch or axios


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    //GatewayIntentBits.MessageReactions,
    GatewayIntentBits.DirectMessages,
  ]
});

client.once('ready', () => {
  console.log('Bot is ready!');
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
