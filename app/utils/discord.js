// utils/discord.js
require('dotenv').config();


export async function fetchGuildInfo(serverId) {
    console.log(`Fetching info for guild ${serverId}`);
    console.log(`Bot token: ${process.env.DISCORD_BOT_TOKEN}`);
    const response = await fetch(`https://discord.com/api/guilds/${serverId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
    if (!response.ok) {
      // Discord returns 404 for guilds the bot is not a part of
      if (response.status === 404) {
        throw new Error('Guild not found or bot is not a member of the guild');
      }
      throw new Error('Failed to fetch guild info');
    }
    const guildInfo = await response.json();
    return guildInfo;
  }
  