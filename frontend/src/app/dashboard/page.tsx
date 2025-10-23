import { Metadata } from 'next';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
    title: 'Dashboard - Auto Parts Inventory',
    description: 'Manage your auto parts inventory',
};

export default function DashboardPage() {
    return <DashboardContent />;
}