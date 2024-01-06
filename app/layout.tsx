import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import NextAuthSessionProvider from './providers/sessionProvider'
import Navbar from './components/Navbar'
//import { options } from "@/app/api/auth/[...nextauth]/route"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Club Authy',
  description: 'Club Authy',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <Navbar />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
