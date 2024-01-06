// components/Navbar.js
'use client'
import { options } from '../api/auth/[...nextauth]/authOptions';

import { useSession, signIn, signOut } from 'next-auth/react';

import { getServerSession } from 'next-auth';
import SignInButton  from './SignInButton'
import SignOutButton  from './SignOutButton'

const Navbar = () => {
    const { data: session } = useSession();
    //console.log(session);
    return (
        <div className="custom-dark p-4">
            {!session ? (
                <SignInButton/>
            ) : (
                <>
                    <a 
                        href="/servers" 
                        style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, .2)' }}
                        className="text-custom-beige hover:border hover:border-custom-yellow hover:bg-black hover:bg-opacity-10 px-4 py-2 rounded mr-4"
                    >
                        Servers
                    </a>
                    <SignOutButton/>
                </>
            )}
        </div>
    );
};

export default Navbar;