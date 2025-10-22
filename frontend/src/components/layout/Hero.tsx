import { Search, Package, TrendingUp } from 'lucide-react';

export default function Hero() {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Auto Parts Inventory System
                    </h1>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Browse, search, and manage your complete automotive parts inventory with ease
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <Search className="h-10 w-10 mx-auto mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Easy Search</h3>
                            <p className="text-indigo-100 text-sm">
                                Find parts quickly with our powerful search and filter system
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <Package className="h-10 w-10 mx-auto mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Complete Inventory</h3>
                            <p className="text-indigo-100 text-sm">
                                Comprehensive database of auto parts with detailed specifications
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <TrendingUp className="h-10 w-10 mx-auto mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
                            <p className="text-indigo-100 text-sm">
                                Live inventory tracking with instant stock updates
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}