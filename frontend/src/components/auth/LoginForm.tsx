'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoginData } from '@/types';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Validation Schema
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false, // Important: prevent automatic redirect
            });

            if (result?.error) {
                setError('Invalid email or password');
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                // Manually redirect to dashboard on success
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                </label>
                <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100 ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </button>

            {/* Demo Credentials (for testing) */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                <p className="text-xs text-gray-600">Email: test@example.com</p>
                <p className="text-xs text-gray-600">Password: password123</p>
            </div>
        </form>
    );
}