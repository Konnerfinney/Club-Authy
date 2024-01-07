"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page({params}: {params: {serverId: string}}) {
  const router = useRouter();
  const session = useSession();
  const [isModerated, setIsModerated] = useState(false);
  const [ownsServer, setOwnsServer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);
  const [serverName, setServerName] = useState("");

  useEffect(() => {
    setIsClient(true); // Set the flag to true once the component is mounted
  }, []);
  useEffect(() => {
    if (!session) {
      // Redirect to login if not signed in
      router.push('/api/auth/signin');
      return;
    }

    const fetchServerDetails = async () => {
      try {
        // Confirm server is moderated
        const serverId = params.serverId;
        const moderatedRes = await fetch(`/api/getServer/${serverId}`);
        const moderatedData = await moderatedRes.json();
        console.log(moderatedData);
        setServerName(moderatedData.serverName);
        setIsModerated(moderatedData.isModerated);

        // Fetch list of servers user owns
        //console.log("Calling getOwnedServers");
        const ownedRes = await fetch('/api/getOwnedServers');
        //console.log(ownedRes);
        const ownedServers = await ownedRes.json();
        
        // Check if user owns the current server
        setOwnsServer(ownedServers.some(server => server.id === serverId));
      } catch (error) {
        console.error('Error fetching server details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        console.log("Fetching users");
        const serverId = params.serverId;
        const response = await (await fetch(`/api/getUsers/${serverId}`)).json();
        setUsers(response);
        console.log(response);
      }
      catch (error) {
        console.error('Error fetching users:', error);
      }}

    console.log("")
    fetchServerDetails();
    fetchUsers();
  }, [router, params.serverId, session]);

  const handleAccept = async (userId, serverId) => {
    // Implement the API call to accept a user
    // Example: axios.post(`/api/acceptUser`, { userId, serverId });
    await fetch(`/api/approveUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ discordUserId: userId, discordServerId: serverId })
    });
  };

  const handleDeny = async (userId, serverId) => {
    // Implement the API call to deny a user
    // Example: axios.post(`/api/denyUser`, { userId, serverId });
    await fetch(`/api/denyUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ discordUserId: userId, discordServerId: serverId })
    });
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isModerated || !ownsServer) {
    return <p>Access denied or server not moderated.</p>;
  }

  return (
    <div>
      {/* Server Name Title */}
      <div className="w-full text-center py-4">
        <h1 className="text-2xl font-bold text-white">{serverName}</h1>
      </div>
      <div className="flex">

        {/* Authenticated Users Column */}
        <div className="w-1/2 p-4">
          <h2>Authenticated Users</h2>
          {users.authenticated.map(user => (
            <div key={user._id} className="mb-4 p-4 border rounded bg-slate-900">
              <p>Name: {user.userName}</p>
              <p>Email: {user.userEmail}</p>
              <p>Comment: {user.userComment}</p>
              <button onClick={() => handleAccept(user.discordUserId, user.discordServerId)} className="mr-2 bg-green-500 text-white px-4 py-2 rounded">
                Accept
              </button>
              <button onClick={() => handleDeny(user.discordUserId, user.discordServerId)} className="bg-red-500 text-white px-4 py-2 rounded">
                Deny
              </button>
            </div>
          ))}
        </div>

        {/* Approved Users Column */}
        <div className="w-1/2 p-4">
          <h2>Approved Users</h2>
          {users.approved.map(user => (
            <div key={user._id} className="mb-4 p-4 border rounded bg-slate-900">
              <p>Name: {user.userName}</p>
              <p>Email: {user.userEmail}</p>
              <p>Comment: {user.userComment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

