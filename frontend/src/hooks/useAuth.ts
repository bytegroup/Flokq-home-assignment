'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const { data: session, status, update } = useSession();
    const router = useRouter();

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
        logout,
        updateSession: update,
    };
};