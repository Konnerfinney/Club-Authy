"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from 'next/image'

export default function Home() {
  const { data: session, status } = useSession({
    required: false,
  });
  //console.log(session,status);
  if(status === "loading") {
    return <></>
  }
  return (
    
      <div className="flex h-screen items-center justify-center">
        <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: -1
      }}>
        <Image 
          src="/background.png" 
          alt="Background Description" 
          layout="fill" // This ensures the image fills its containing element
          objectFit="cover" // Same as the CSS object-fit, ensuring the image covers without distortion
        />
      </div>
        <div>
          <h1></h1>
        </div>
  
      </div>
      

      
    );
}