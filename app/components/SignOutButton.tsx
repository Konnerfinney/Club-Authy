'use client'
import { signOut } from 'next-auth/react';

const SignOutButton = () => {
    return (
        <button 
            className="px-6 py-2 bg-yellow-400 text-black rounded-full border border-black hover:bg-yellow-500 transition-colors duration-300"
            onClick={() => signOut({ callbackUrl: '/'})}
        >
            Sign Out
        </button>
    );
};

export default SignOutButton;