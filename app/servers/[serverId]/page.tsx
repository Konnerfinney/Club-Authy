// app/servers/[serverId]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Page({ params }) {
  const { serverId } = params;
  const { data: session } = useSession();
  const [isModerated, setIsModerated] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [guildInfo, setGuildInfo] = useState(null);

  useEffect(() => {
    async function checkServerStatus() {
      if (session?.accessToken && serverId) {
        try {
          const res = await fetch(`/api/checkServerStatus?serverId=${serverId}&accessToken=${session.accessToken}`);
          const data = await res.json();

          if (res.ok) {
            setIsModerated(data.isModerated);
            setIsOwner(data.isOwner);
            setGuildInfo(data.guildInfo); // Adjust according to what your API returns
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error('Failed to check server status:', error);
        }
      }
    }

    checkServerStatus();
  }, [session, serverId]);

  // Render logic based on isModerated and isOwner
  return (
    <div>
      {isModerated ? (
        <div>
          <h1>Moderated Server: {guildInfo?.name}</h1>
          {isOwner ? (
            <p>You are the owner of this server.</p>
          ) : (
            <p>You are not the owner of this server.</p>
          )}
        </div>
      ) : (
        <p>This server is not moderated by the bot.</p>
      )}
    </div>
  );
}
