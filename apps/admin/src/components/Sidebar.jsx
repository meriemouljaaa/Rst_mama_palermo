import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List, Settings as SettingsIcon, Users, Pizza } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/orders', icon: ShoppingBag, label: 'Orders' },
        { to: '/products', icon: Pizza, label: 'Products' },
        { to: '/categories', icon: List, label: 'Categories' },
        { to: '/customers', icon: Users, label: 'Customers' },
        { to: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <aside className="w-64 bg-white shadow-md flex flex-col h-full border-r border-gray-100">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Mamma Palermo</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Admin Portal</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-red-600' : 'text-gray-400'} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">© 2026 Mamma Palermo</p>
            </div>
        </aside>
    );
}
