'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoginData } from '@/types';

export const useAuth = () => {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const login = async (credentials: LoginData) => {
        try {
            const result = await signIn('credentials', {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            if (result?.ok) {
                router.push('/dashboard');
                return result;
            }

            throw new Error('Login failed');
        } catch (error: any) {
            throw new Error(error.message || 'Authentication failed');
        }
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const isAuthenticated = status === 'authenticated';
    const isLoading = status === 'loading';

    return {
        user: session?.user,
        accessToken: session?.accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateSession: update,
    };
};