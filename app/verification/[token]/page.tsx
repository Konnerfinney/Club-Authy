"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set the flag to true once the component is mounted
  }, []);

  useEffect(() => {
    // Ensure the component is client-side and the router is ready

    const verifyToken = async () => {
      const token = params.token;
      const queryParams = new URLSearchParams(window.location.search);
      const serverId = queryParams.get('discordServerId');
      const userId = queryParams.get('discordUserId');
      try {
        const response = await fetch(`/api/verify/${token}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            discordServerId: serverId,
            discordUserId: userId
          })
        });

        if (response.ok) {
          setVerificationStatus('Email authenticated');
        } else {
          setVerificationStatus('Verification failed. Invalid or expired token.');
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        setVerificationStatus('An error occurred during verification.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [isClient, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>{verificationStatus}</div>
  );
}
