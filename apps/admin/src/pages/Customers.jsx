import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Search, Users, Calendar, ArrowRight, User, MoreVertical, Filter, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/customers` : `http://${window.location.hostname}:5000/api/customers`;

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchCustomers = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
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
        `${c.first_name} ${c.last_name} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-6 animate-in fade-in duration-500">
            {/* Page Header - Simple */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customers</h2>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-64 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm font-medium text-sm"
                        />
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
                                                <Phone size={14} className="text-red-500" />
                                                <span className="font-bold">{c.phone || 'No phone'}</span>
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
                                                <p className="text-xs text-gray-400 italic">Try searching with a different name or phone number.</p>
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
