import { useState } from 'react';
import { Store, Clock, Users, Building, Mail, Phone, MapPin, Save, Shield } from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Navigation */}
                <div className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'general' ? 'bg-white shadow-sm text-red-600 border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                        >
                            <Store size={20} />
                            Restaurant Details
                        </button>
                        <button
                            onClick={() => setActiveTab('hours')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'hours' ? 'bg-white shadow-sm text-red-600 border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                        >
                            <Clock size={20} />
                            Operating Hours
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'staff' ? 'bg-white shadow-sm text-red-600 border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                        >
                            <Users size={20} />
                            Staff & Permissions
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security' ? 'bg-white shadow-sm text-red-600 border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                        >
                            <Shield size={20} />
                            Security
                        </button>
                    </nav>
                </div>

                {/* Settings Content Panels */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Building className="text-gray-400" size={24} /> General Information
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Manage your public restaurant details and contact info.</p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Name</label>
                                        <input type="text" defaultValue="Mamma Palermo" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-shadow" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                                            <input type="email" defaultValue="hello@mammapalermo.com" className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-shadow" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone size={18} /></div>
                                            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-shadow" />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-gray-400"><MapPin size={18} /></div>
                                            <textarea defaultValue="123 Italian Street\nNew York, NY 10001" className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-shadow resize-none" rows="3"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors">
                                        <Save size={18} /> Save Details
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab !== 'general' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                {activeTab === 'hours' ? <Clock size={32} /> : activeTab === 'staff' ? <Users size={32} /> : <Shield size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">The {activeTab} settings panel is currently under construction and will be available in a future update.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
