import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"

const handler = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    })
                    const user = res.data
                    if (user?.token) return user
                    return null
                } catch {
                    return null
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.accessToken = user.token
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        },
    },
})

export { handler as GET, handler as POST }
