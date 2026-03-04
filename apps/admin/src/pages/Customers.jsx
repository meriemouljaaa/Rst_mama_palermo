import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/customers';

export default function Customers() {
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error('Failed to fetch customers', err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Customers Directory</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {customers.map(c => (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{c.first_name} {c.last_name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Customer since {new Date(c.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">
                                {c.first_name.charAt(0)}{c.last_name ? c.last_name.charAt(0) : ''}
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Mail size={16} />
                                </div>
                                <span className="truncate">{c.email}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Phone size={16} />
                                </div>
                                <span>{c.phone || <span className="italic opacity-50">No phone provided</span>}</span>
                            </div>

                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <span className="leading-5">{c.address || <span className="italic opacity-50">No address provided</span>}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {customers.length === 0 && (
                    <div className="col-span-full p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 italic">No customers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
