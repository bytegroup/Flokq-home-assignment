import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Register - Auto Parts Inventory',
    description: 'Create an account to manage auto parts inventory',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Auto Parts</h1>
                    <p className="mt-2 text-sm text-gray-600">Inventory Management System</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign up to start managing your parts inventory
                        </p>
                    </div>

                    <RegisterForm />

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Sign in here
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