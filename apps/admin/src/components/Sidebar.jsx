import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    List,
    Settings as SettingsIcon,
    Users,
    Pizza,
    ChevronLeft,
    ChevronRight,
    CircleDashed
} from 'lucide-react';

export default function Sidebar({ isCollapsed, onToggle }) {
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
        <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white shadow-xl flex flex-col h-full border-r border-gray-100 transition-all duration-300 ease-in-out relative group`}>
            {/* Collapse Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-10 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors z-50 transform group-hover:scale-110 active:scale-95"
            >
                {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
            </button>

            {/* Branding Section */}
            <div className={`p-6 border-b border-gray-100 overflow-hidden ${isCollapsed ? 'flex justify-center' : ''}`}>
                {!isCollapsed ? (
                    <div className="transition-all duration-500 opacity-100 translate-x-0">
                        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 whitespace-nowrap">Mamma Palermo</h1>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Admin Architecture</p>
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-red-200 transition-all duration-300 transform hover:scale-105">
                        P
                    </div>
                )}
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 no-scrollbar">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold transition-all relative group/item ${isActive
                                ? 'bg-red-50 text-red-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className={`shrink-0 ${isActive ? 'text-red-600 scale-110' : 'text-gray-400'} transition-transform duration-300`}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {!isCollapsed && (
                                <span className="text-sm tracking-tight whitespace-nowrap transition-all duration-300 opacity-100 translate-x-0">
                                    {link.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all whitespace-nowrap z-50 transform translate-x-2 group-hover/item:translate-x-0">
                                    {link.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-center overflow-hidden">
                {!isCollapsed ? (
                    <div className="flex items-center gap-2 opacity-30">
                        <CircleDashed size={12} className="animate-spin" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">v1.2.4 Active</p>
                    </div>
                ) : (
                    <span className="text-[10px] font-black text-gray-300">1.2</span>
                )}
            </div>
        </aside>
    );
}
