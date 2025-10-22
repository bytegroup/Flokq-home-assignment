import { Part, PaginationMeta } from '@/types';
import PartCard from './PartCard';
import Pagination from './Pagination';

interface PartsGridProps {
    parts: Part[];
    pagination: PaginationMeta;
    currentPage: number;
    search?: string;
    category?: string;
}

export default function PartsGrid({
                                      parts,
                                      pagination,
                                      currentPage,
                                      search,
                                      category
                                  }: PartsGridProps) {
    if (parts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg
                        className="mx-auto h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No parts found</h3>
                <p className="text-gray-600">
                    {search || category
                        ? 'Try adjusting your search or filter criteria'
                        : 'No parts available in the inventory'}
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Results Info */}
            <div className="mb-6 text-sm text-gray-600">
                Showing {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} parts
            </div>

            {/* Parts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {parts.map((part) => (
                    <PartCard key={part.id} part={part} />
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    search={search}
                    category={category}
                />
            )}
        </div>
    );
}