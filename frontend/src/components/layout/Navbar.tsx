'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Package, LogIn, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">Auto Parts</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                        >
                            Browse Parts
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>

                                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <User size={18} className="text-gray-600" />
                                        <span className="text-sm text-gray-700">{user?.name}</span>
                                    </div>

                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}