import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Search, Users, Calendar, ArrowRight, User, MoreVertical, Filter, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/customers` : 'http://localhost:5000/api/customers';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(API_URL);
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error('Failed to fetch customers', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        `${c.first_name} ${c.last_name} ${c.email} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                        <Users size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Clientele Base</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Directory</h2>
                        <div className="flex items-center gap-2 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-green-700">Sync Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search directory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-72 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm font-medium text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Reach</p>
                        <h4 className="text-xl font-black text-gray-900">{customers.length} Profiles</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <User size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Search</p>
                        <h4 className="text-xl font-black text-gray-900">{filteredCustomers.length} Matches</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Search size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">System Health</p>
                        <h4 className="text-xl font-black text-green-600">Encrypted</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-200"></div>
                    </div>
                </div>
            </div>

            {/* Customers List Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50/50 text-gray-400 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.15em]">
                            <tr>
                                <th className="p-5">Identity</th>
                                <th className="p-5">Contact Details</th>
                                <th className="p-5">Billing Address</th>
                                <th className="p-5">Member Since</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-5"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                                    </tr>
                                ))
                            ) : filteredCustomers.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm border border-red-100 shadow-sm shadow-red-50">
                                                {c.first_name.charAt(0)}{c.last_name ? c.last_name.charAt(0) : ''}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{c.first_name} {c.last_name}</div>
                                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">ID #{c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={12} className="text-gray-400" />
                                                <span className="font-medium">{c.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold">
                                                <Phone size={12} className="text-gray-400" />
                                                <span>{c.phone || 'No phone'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-start gap-2 max-w-[250px]">
                                            <MapPin size={12} className="text-gray-400 mt-1 shrink-0" />
                                            <span className="text-xs text-gray-600 font-medium leading-relaxed italic truncate" title={c.address}>
                                                {c.address || 'Not specified'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Calendar size={12} className="text-gray-400" />
                                            {new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100">
                                            <ArrowRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">No customers found</p>
                                                <p className="text-xs text-gray-400 italic">Try searching with a different term or email.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
