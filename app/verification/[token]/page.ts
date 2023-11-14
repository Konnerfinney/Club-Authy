// app/verification/[token]/page.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;
  const [verificationStatus, setVerificationStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(`/api/verify/${token}`);
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
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
}
