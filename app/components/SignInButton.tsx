'use client'
import { signIn } from 'next-auth/react';

const SignInButton = () => {
    return (
        <button 
            className="px-6 py-2 bg-yellow-400 text-black rounded-full border border-black hover:bg-yellow-500 transition-colors duration-300"
            onClick={() => signIn()}
        >
            Sign In
        </button>
    );
};

export default SignInButton;