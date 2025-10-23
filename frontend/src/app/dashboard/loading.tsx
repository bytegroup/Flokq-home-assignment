import Navbar from '@/components/layout/Navbar';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Loader2 />
        </div>
    );
}