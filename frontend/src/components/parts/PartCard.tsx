import Link from 'next/link';
import { Part } from '@/types';
import { Package, DollarSign, Box } from 'lucide-react';

interface PartCardProps {
    part: Part;
}

export default function PartCard({ part }: PartCardProps) {
    const price = typeof part.price === 'string' ? parseFloat(part.price) : part.price;

    return (
        <Link href={`/parts/${part.id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 h-48 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-blue-200 transition">
                    <Package className="h-20 w-20 text-indigo-400" />
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category Badge */}
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-2">
            {part.category}
          </span>

                    {/* Part Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition">
                        {part.name}
                    </h3>

                    {/* Brand */}
                    <p className="text-sm text-gray-600 mb-3">{part.brand}</p>

                    {/* Price and Stock */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex items-center text-green-600 font-bold">
                            <DollarSign size={18} />
                            <span className="text-lg">{price.toFixed(2)}</span>
                        </div>

                        <div className={`flex items-center text-sm font-medium ${
                            part.stock > 0 ? 'text-gray-600' : 'text-red-600'
                        }`}>
                            <Box size={16} className="mr-1" />
                            <span>
                {part.stock > 0 ? `${part.stock} in stock` : 'Out of stock'}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}