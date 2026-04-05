import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Centre Zaïd Ibn Thabit — UCED',
  description: 'Système de gestion — École Franco-Arabe & Daara',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={dmSans.className} style={{background: '#f7f8f5', color: '#1a2818'}}>
        <Sidebar />
        <main className="ml-56 min-h-screen" style={{background: '#f7f8f5'}}>
          {children}
        </main>
      </body>
    </html>
  )
}