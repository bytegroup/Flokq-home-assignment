'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardStats from './DashboardStats';
import PartsTable from './PartsTable';
import AddPartModal from './AddPartModal';
import EditPartModal from './EditPartModal';
import { Part } from '@/types';
import { Plus } from 'lucide-react';

export default function DashboardContent() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAddClick = () => {
        console.log('Add button clicked'); // Debug log
        setIsAddModalOpen(true);
    };

    const handleAddSuccess = () => {
        console.log('Part added successfully'); // Debug log
        setIsAddModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    const handleEditClick = (part: Part) => {
        setSelectedPart(part);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setSelectedPart(null);
        setRefreshKey((prev) => prev + 1);
    };

    const handleDeleteSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your auto parts inventory</p>
                        </div>
                        <button
                            onClick={handleAddClick}
                            type="button"
                            className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={20} className="mr-2" />
                            Add New Part
                        </button>
                    </div>
                </div>

                {/* Analytics Stats */}
                <DashboardStats key={`stats-${refreshKey}`} />

                {/* Parts Table */}
                <div className="mt-8">
                    <PartsTable
                        key={`table-${refreshKey}`}
                        onEditClick={handleEditClick}
                        onDeleteSuccess={handleDeleteSuccess}
                    />
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <AddPartModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleAddSuccess}
                />
            )}

            {/* Edit Modal */}
            {selectedPart && isEditModalOpen && (
                <EditPartModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedPart(null);
                    }}
                    onSuccess={handleEditSuccess}
                    part={selectedPart}
                />
            )}
        </div>
    );
}