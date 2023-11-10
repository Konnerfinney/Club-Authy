// app/servers/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getGuilds } from '../utils/discord';

let DISCORD_CLIENT_ID=1135021991171215482

export default function ServersPage() {
  const { data: session } = useSession();
  const [moderatedGuilds, setModeratedGuilds] = useState([]);
  const [unmoderatedGuilds, setUnmoderatedGuilds] = useState([]);

  useEffect(() => {
    async function loadGuilds() {
      if (session) {
        try {
          // Fetch all guilds from Discord
          const allGuildsResponse = await getGuilds(session.accessToken);
  
          // Fetch the list of moderated server IDs from your API
          const moderatedResponse = await fetch('/api/moderated-servers');
          const moderatedServerIds = await moderatedResponse.json();
  
          // Categorize guilds based on the presence in the moderatedServerIds
          const moderated = allGuildsResponse.filter(guild => 
            moderatedServerIds.some(moderatedServer => moderatedServer.discordServerId === guild.id)
          );
  
          const unmoderated = allGuildsResponse.filter(guild => 
            !moderatedServerIds.some(moderatedServer => moderatedServer.discordServerId === guild.id)
          );
  
          setModeratedGuilds(moderated);
          setUnmoderatedGuilds(unmoderated);
        } catch (error) {
          console.error('Error loading guilds:', error);
        }
      }
    }
  
    loadGuilds();
  }, [session]);
  
  

  // Render the moderated and unmoderated guilds
  return (
    <div className="container mx-auto px-4">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 my-4">Moderated Guilds</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moderatedGuilds.map(guild => (
            <div key={guild.id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{guild.name}</h2>
              <p className="text-md text-gray-600">ID: {guild.id}</p>
              {/* Include additional guild details here */}
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h1 className="text-2xl font-bold text-gray-900 my-4">Unmoderated Guilds</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unmoderatedGuilds.map(guild => (
            <div key={guild.id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{guild.name}</h2>
              <p className="text-md text-gray-600">ID: {guild.id}</p>
              {/* Add button or link to invite bot */}
              <a 
                href={`https://discord.com/api/oauth2/authorize?client_id=1135021991171215482&permissions=8&scope=bot&guild_id=${guild.id}&disable_guild_select=true`} 
                className="text-indigo-600 hover:text-indigo-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                Invite Bot
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
