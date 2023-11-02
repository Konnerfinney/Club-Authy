// pages/api/discordGuilds.js
import axios from 'axios';

export async function handler(req, res) {
    console.log(session);
  const token = req.session.user.accessToken; // Or retrieve from session
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
}
export { handler as GET, handler as POST }