
import useSWR from 'swr';
import { getServerSession } from 'next-auth/next';
import { signOut } from "next-auth/react";
import { options } from "../api/auth/[...nextauth]/authOptions";
import Image from 'next/image';

async function getGuilds() {
  const session = await getServerSession(options);
  //console.log('API call', session.accessToken);
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  //console.log('response', response);
  const guilds = await response.json();
  //console.log(guilds);
  return guilds;
}


export default async function Servers() {
  const data = await getGuilds();
  const ownerGuilds = data.filter(guild => guild.owner === true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ownerGuilds.map(guild => (
        <div key={guild.id} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2 text-black">{guild.name}</h2>
          <h3 className="text-md text-gray-600">ID: {guild.id}</h3>
        </div>
      ))}
    </div>
  );
};


