import "./globals.css"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>{children}</SessionProvider>
        </body>
        </html>
    )
}
