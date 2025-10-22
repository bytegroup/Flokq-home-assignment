import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Login - Auto Parts Inventory',
    description: 'Login to manage your auto parts inventory',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Auto Parts</h1>
                    <p className="mt-2 text-sm text-gray-600">Inventory Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Access your dashboard to manage parts
                        </p>
                    </div>

                    <LoginForm />

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        ← Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}