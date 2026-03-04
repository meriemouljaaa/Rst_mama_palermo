import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Clock, ChefHat, Truck, CheckCircle2 } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        }
    };

    useEffect(() => {
        fetchOrders();

        const socket = io('http://localhost:3001');
        socket.on('orderStatusChanged', () => fetchOrders());
        socket.on('newOrder', () => fetchOrders());

        return () => socket.disconnect();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await fetch(`http://localhost:3001/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            // The socket event will trigger fetchOrders automatically.
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const statusColumns = [
        { title: 'Pending', status: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        { title: 'Preparing', status: 'Preparing', icon: ChefHat, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        { title: 'Out for Delivery', status: 'Out for Delivery', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
        { title: 'Delivered', status: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Orders Kanban</h2>
                <button onClick={fetchOrders} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors">
                    Refresh Board
                </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex h-full gap-6 min-w-max">
                    {statusColumns.map((col) => {
                        const columnOrders = orders.filter(o => o.status === col.status);
                        const Icon = col.icon;
                        return (
                            <div key={col.status} className={`w-80 flex flex-col rounded-2xl border ${col.border} bg-gray-50/50`}>
                                <div className={`p-4 rounded-t-2xl border-b ${col.border} ${col.bg} flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <Icon size={20} className={col.color} />
                                        <h3 className={`font-bold ${col.color}`}>{col.title}</h3>
                                    </div>
                                    <span className={`text-sm font-bold px-2.5 py-1 bg-white rounded-full ${col.color} shadow-sm`}>
                                        {columnOrders.length}
                                    </span>
                                </div>

                                <div className="flex-1 p-4 overflow-y-auto space-y-4 shadow-inner">
                                    {columnOrders.map(order => (
                                        <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-900">#{order.id}</span>
                                                <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <p className="font-medium text-gray-800 text-sm mb-1">{order.first_name} {order.last_name}</p>

                                            <div className="flex justify-between items-center mt-4">
                                                <span className="font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</span>

                                                {/* Status progression buttons */}
                                                <div className="flex gap-1">
                                                    {col.status === 'Pending' && (
                                                        <button onClick={() => updateStatus(order.id, 'Preparing')} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-bold transition-colors">Start Prep</button>
                                                    )}
                                                    {col.status === 'Preparing' && (
                                                        <button onClick={() => updateStatus(order.id, 'Out for Delivery')} className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg font-bold transition-colors">Send Out</button>
                                                    )}
                                                    {col.status === 'Out for Delivery' && (
                                                        <button onClick={() => updateStatus(order.id, 'Delivered')} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg font-bold transition-colors">Deliver</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {columnOrders.length === 0 && (
                                        <div className="h-full flex items-center justify-center text-gray-400 text-sm italic py-8">
                                            No orders here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
