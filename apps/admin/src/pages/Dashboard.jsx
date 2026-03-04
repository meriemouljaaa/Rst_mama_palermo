import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        todayOrders: 0,
        totalCustomers: 0
    });

    const [RecentOrders, setRecentOrders] = useState([]);

    // Mock chart data representing recent day revenue
    const chartData = [
        { name: 'Mon', revenue: 400 },
        { name: 'Tue', revenue: 300 },
        { name: 'Wed', revenue: 550 },
        { name: 'Thu', revenue: 450 },
        { name: 'Fri', revenue: 700 },
        { name: 'Sat', revenue: 650 },
        { name: 'Sun', revenue: parseInt(stats.todayRevenue) || 0 }, // dynamically updated
    ];

    const fetchDashboardData = async () => {
        try {
            const statsRes = await fetch('http://localhost:3001/api/dashboard/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            const ordersRes = await fetch('http://localhost:3001/api/orders');
            const ordersData = await ordersRes.json();
            setRecentOrders(ordersData.slice(0, 5)); // Just top 5
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const socket = io('http://localhost:3001');

        socket.on('orderStatusChanged', (data) => {
            console.log('Order status updated:', data);
            fetchDashboardData(); // Refresh on status change 
        });

        socket.on('newOrder', (data) => {
            console.log('New order received:', data);
            fetchDashboardData(); // Refresh on new order
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Welcome back. Here is what's happening today.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Today's Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.todayRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Orders Today</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.todayOrders}</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Over Time</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                    </div>
                    <div className="space-y-4">
                        {RecentOrders.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent orders found.</p>
                        ) : (
                            RecentOrders.map((order) => (
                                <div key={order.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">#{order.id} - {order.first_name} {order.last_name}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
