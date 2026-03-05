import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
    Clock,
    ChefHat,
    Truck,
    CheckCircle2,
    Search,
    Filter,
    MoreVertical,
    Phone,
    Mail,
    Calendar,
    ArrowRight,
    Package,
    AlertCircle
} from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('http://localhost:3001/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setIsLoading(false);
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
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const statusColumns = [
        { title: 'Pending', status: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', btnColor: 'bg-amber-600', nextStatus: 'Preparing', nextLabel: 'Start Preparation' },
        { title: 'Preparing', status: 'Preparing', icon: ChefHat, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', btnColor: 'bg-blue-600', nextStatus: 'Out for Delivery', nextLabel: 'Dispatch Order' },
        { title: 'Out for Delivery', status: 'Out for Delivery', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', btnColor: 'bg-emerald-600', nextStatus: 'Delivered', nextLabel: 'Mark Delivered' },
        { title: 'Delivered', status: 'Delivered', icon: CheckCircle2, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', btnColor: 'bg-gray-400', nextStatus: null, nextLabel: null }
    ];

    const filteredOrders = orders.filter(o =>
        o.id.toString().includes(searchTerm) ||
        `${o.first_name} ${o.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const avgTimeMinutes = deliveredOrders.length > 0
        ? Math.round(deliveredOrders.reduce((acc, curr) => {
            const start = new Date(curr.created_at);
            const end = new Date(curr.updated_at);
            return acc + (end - start) / (1000 * 60);
        }, 0) / deliveredOrders.length)
        : 0;

    const stats = {
        total: orders.length,
        today: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length,
        revenue: orders.reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0).toFixed(2),
        avgTime: avgTimeMinutes || 24 // Fallback to 24 if no orders delivered yet
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            {/* Header Area - Compact */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Orders</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Real-time fulfillment tracking.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-64 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm font-medium text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Metrics - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Status</p>
                        <h4 className="text-xl font-black text-gray-900">{orders.filter(o => o.status !== 'Delivered').length} Units</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <Package size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Today's Flow</p>
                        <h4 className="text-xl font-black text-gray-900">{stats.today} Orders</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Turnover</p>
                        <h4 className="text-xl font-black text-gray-900">{stats.revenue} <span className="text-xs">DH</span></h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <p className="font-black text-xs">DH</p>
                    </div>
                </div>
            </div>

            {/* Kanban Board - Compact */}
            <div className="flex-1 pb-2">
                <div className="flex h-full gap-4 pb-2">
                    {statusColumns.map((col) => {
                        const columnOrders = filteredOrders.filter(o => o.status === col.status);
                        const Icon = col.icon;

                        return (
                            <div key={col.status} className="flex-1 min-w-0 flex flex-col h-full bg-gray-100/30 rounded-3xl border border-gray-200/50 backdrop-blur-md">
                                {/* Column Header - Compact */}
                                <div className={`p-4 pb-3 flex items-center justify-between rounded-t-3xl sticky top-0 bg-transparent z-10`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-xl ${col.bg} ${col.color} border ${col.border} flex items-center justify-center shadow-sm`}>
                                            <Icon size={16} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 text-base leading-tight">{col.title}</h3>
                                            <p className="text-[9px] items-center flex gap-1 font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                {columnOrders.length} {columnOrders.length === 1 ? 'Order' : 'Orders'}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>

                                {/* Orders List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth">
                                    {columnOrders.map(order => (
                                        <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.01] transform transition-all duration-300 group cursor-default">
                                            {/* Order Identity - Compact */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md">#{order.id}</span>
                                                    <h5 className="font-black text-gray-900 text-base leading-tight truncate max-w-[120px]">{order.first_name} {order.last_name}</h5>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Order Details Snippet - Compact */}
                                            <div className="space-y-2 mb-3">
                                                {/* Items List - Compactified */}
                                                <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-gray-100/50">
                                                        <Package size={10} className="text-gray-400" />
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Manifest</span>
                                                    </div>
                                                    <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 custom-scrollbar">
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-[11px]">
                                                                <div className="flex gap-2 font-bold text-gray-700">
                                                                    <span className="text-red-600 bg-red-50 px-1 rounded-md text-[10px]">{item.quantity}x</span>
                                                                    <span className="truncate max-w-[140px]">{item.product_name}</span>
                                                                </div>
                                                                <span className="text-[10px] text-gray-400 font-medium">{(item.unit_price * item.quantity).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {order.notes && (
                                                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100/50 flex gap-1.5">
                                                        <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                                        <p className="text-[10px] text-amber-700 italic leading-tight font-medium line-clamp-1">{order.notes}</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                                                        <Phone size={12} />
                                                        <span className="text-[10px] font-bold">Call</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                                                        <Mail size={12} />
                                                        <span className="text-[10px] font-bold">Email</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action & Total - Compact Row */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-gray-900">{parseFloat(order.total_amount).toFixed(2)} <span className="text-[10px]">DH</span></span>
                                                </div>

                                                {col.nextStatus && (
                                                    <button
                                                        onClick={() => updateStatus(order.id, col.nextStatus)}
                                                        className={`flex items-center gap-1.5 ${col.btnColor} text-white px-3 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider shadow hover:brightness-110 active:scale-95 transition-all`}
                                                    >
                                                        {col.nextLabel.split(' ')[0]} {/* Shorter label */}
                                                        <ArrowRight size={12} strokeWidth={3} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {columnOrders.length === 0 && (
                                        <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-200/50 rounded-2xl text-gray-300">
                                            <Package size={24} className="mb-1 opacity-20" />
                                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Empty</p>
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
