import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email and password required');
                    }

                    // Call backend login API
                    const response = await axios.post(`${API_URL}/auth/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const { user, token } = response.data;

                    if (user && token) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: user.name,
                            accessToken: token,
                        } as User;
                    }

                    return null;
                } catch (error: any) {
                    console.error('Authentication error:', error.response?.data || error.message);
                    throw new Error(error.response?.data?.error || 'Authentication failed');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.accessToken = (user as any).accessToken;
            }

            // Handle session update
            if (trigger === 'update' && session) {
                token = { ...token, ...session };
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };