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
    AlertCircle,
    X,
    User,
    MapPin,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [revealedPhones, setRevealedPhones] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_BASE}/api/orders`);
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

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        socket.on('orderStatusChanged', () => fetchOrders());
        socket.on('newOrder', () => fetchOrders());

        return () => socket.disconnect();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await fetch(`${API_BASE}/api/orders/${id}/status`, {
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
        avgTime: avgTimeMinutes || 24
    };

    return (
        <div className="h-full flex flex-col space-y-4 overflow-hidden">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
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

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
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

            {/* Kanban Board */}
            <div className="flex-1 min-h-0 pb-2">
                <div className="flex h-full gap-4 pb-2">
                    {statusColumns.map((col) => {
                        const columnOrders = filteredOrders.filter(o => o.status === col.status);
                        const Icon = col.icon;

                        return (
                            <div key={col.status} className="flex-1 min-w-0 flex flex-col h-full bg-gray-100/30 rounded-3xl border border-gray-200/50 backdrop-blur-md">
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

                                <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar scroll-smooth">
                                    {columnOrders.map(order => {
                                        const isDelivered = col.status === 'Delivered';
                                        const isExpanded = !isDelivered || !!expandedOrders[order.id];

                                        return (
                                            <div
                                                onClick={() => isExpanded ? setSelectedOrder(order) : setExpandedOrders(prev => ({ ...prev, [order.id]: true }))}
                                                key={order.id}
                                                className={`bg-white rounded-[16px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col relative overflow-hidden group transition-all duration-300 cursor-pointer ${isExpanded ? 'p-3.5 gap-2 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1' : 'p-2 py-3 hover:bg-gray-50'}`}
                                            >
                                                <div className={`absolute top-0 left-0 w-full h-1.5 ${col.btnColor} opacity-80`}></div>

                                                {!isExpanded ? (
                                                    <div className="flex items-center justify-between mt-1 px-1">
                                                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                                                            <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md shrink-0">#{order.id}</span>
                                                            <h5 className="font-extrabold text-gray-700 text-[13px] truncate">{order.first_name} {order.last_name}</h5>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-[12px] font-black text-gray-900">{parseFloat(order.total_amount).toFixed(2)} DH</span>
                                                            <ChevronDown size={14} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start mt-0.5">
                                                            <div className="flex gap-2 items-start flex-1 min-w-0">
                                                                <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg mt-0.5 shrink-0">#{order.id}</span>
                                                                <h5 className="font-extrabold text-gray-900 text-[14px] leading-tight break-words">{order.first_name} {order.last_name}</h5>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                {isDelivered && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setExpandedOrders(prev => ({ ...prev, [order.id]: false }));
                                                                        }}
                                                                        className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
                                                                    >
                                                                        <ChevronUp size={14} strokeWidth={3} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="bg-gray-50/80 p-2 rounded-xl border border-gray-100/80">
                                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/60">
                                                                    <Package size={14} className="text-gray-400" />
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manifest</span>
                                                                </div>
                                                                <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1 custom-scrollbar">
                                                                    {order.items?.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between items-start text-[11px]">
                                                                            <div className="flex gap-2 font-bold text-gray-800">
                                                                                <span className="text-red-600 bg-red-50/80 border border-red-100 px-1 py-0.5 rounded-md text-[9px] leading-none shrink-0 h-fit mt-0.5">{item.quantity}x</span>
                                                                                <div className="flex flex-col">
                                                                                    <span className="leading-tight">{item.product_name}</span>
                                                                                    {item.variant_name && (
                                                                                        <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter">Option: {item.variant_name}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-[10px] text-gray-400 font-bold shrink-0 mt-0.5">{(item.unit_price * item.quantity).toFixed(2)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {(order.payment_method || order.notes) && (
                                                                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex gap-2 items-start">
                                                                    <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                                                    <div className="flex flex-col gap-1 w-full">
                                                                        <div className="flex justify-between items-center">
                                                                            <p className="text-[11px] text-amber-800 font-black leading-snug">
                                                                                {order.payment_method || 'Mode non spécifié'}
                                                                            </p>
                                                                            {order.payment_method === 'Online' && (
                                                                                <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${order.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                                    {order.payment_status || 'Unpaid'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {order.notes && (
                                                                            <p className="text-[10px] text-amber-900/70 font-bold italic border-t border-amber-200/50 pt-1">
                                                                                {order.notes}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex items-center gap-1.5 pt-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setRevealedPhones(prev => ({ ...prev, [order.id]: true }));
                                                                    }}
                                                                    className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all"
                                                                >
                                                                    <Phone size={14} />
                                                                    <span className="text-[11px] font-bold">
                                                                        {revealedPhones[order.id] ? order.phone || 'No num' : 'Call'}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-0.5">
                                                            <div className="flex justify-start items-baseline gap-1">
                                                                <span className="text-[15px] font-black text-gray-900 leading-none">{parseFloat(order.total_amount).toFixed(2)}</span>
                                                                <span className="text-[9px] font-bold text-gray-400 leading-none">DH</span>
                                                            </div>

                                                            {col.nextStatus && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateStatus(order.id, col.nextStatus);
                                                                    }}
                                                                    className={`flex items-center gap-1.5 ${col.btnColor} text-white px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${col.btnColor.split('-')[1]}-500`}
                                                                >
                                                                    {col.nextStatus === 'Preparing' ? 'START' : col.nextStatus === 'Out for Delivery' ? 'DISPATCH' : 'MARK'}
                                                                    <ArrowRight size={12} strokeWidth={3} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {columnOrders.length === 0 && (
                                        <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-200/50 rounded-[20px] text-gray-300">
                                            <Package size={28} className="mb-2 opacity-20" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="p-4 sm:px-6 border-b border-gray-100 flex justify-between items-start bg-white relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5 mt-0.5">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Order Details</h3>
                                    <span className="text-[12px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100/50">#{selectedOrder.id}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <Calendar size={11} strokeWidth={2.5} />
                                    <span>{new Date(selectedOrder.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-100 shadow-sm mt-0.5">
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 sm:px-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 bg-gray-50/30">

                            {/* Customer Card */}
                            <div className="bg-white rounded-[16px] p-3.5 border border-gray-100 shadow-sm flex items-start gap-3 transition-all">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-black text-gray-900 leading-tight mb-1.5 break-words">{selectedOrder.first_name} {selectedOrder.last_name}</h4>
                                    <div className="flex flex-wrap gap-2 text-[12px] text-gray-600 font-bold">
                                        <div className="flex items-center gap-2 bg-gray-50/80 px-2.5 py-1 rounded-lg border border-gray-100/50 w-fit">
                                            <Phone size={12} className="text-gray-400 shrink-0" strokeWidth={2.5} />
                                            <span>{selectedOrder.phone || 'Aucun numéro'}</span>
                                        </div>
                                        {selectedOrder.address && (
                                            <div className="flex items-start gap-2 bg-gray-50/80 px-2.5 py-1 rounded-lg border border-gray-100/50 flex-1 min-w-[150px]">
                                                <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                                                <span className="leading-snug break-words">{selectedOrder.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Manifest */}
                            <div>
                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 px-1">
                                    <span className="w-2 h-[2px] bg-red-500/30 rounded-full"></span>
                                    Fiche de Commande
                                    <span className="flex-1 h-[1px] bg-gray-200/50 ml-1"></span>
                                </h4>
                                <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="divide-y divide-gray-100/80 max-h-[250px] overflow-y-auto custom-scrollbar">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start p-3 hover:bg-red-50/30 transition-colors group gap-4">
                                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                                    <span className="text-[11px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100/50 min-w-[28px] text-center mt-0.5">{item.quantity}x</span>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-gray-800 text-[13px] group-hover:text-red-700 transition-colors leading-tight break-words">{item.product_name}</span>
                                                        {item.variant_name && (
                                                            <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter mt-0.5">Option: {item.variant_name}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="font-black text-gray-900 text-[13px] shrink-0">{(item.unit_price * item.quantity).toFixed(2)} <span className="text-[9px] text-gray-400 font-bold">DH</span></span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-gray-50/50 p-3.5 px-5 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-gray-200/60">Total</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-red-600 tracking-tight">{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                            <span className="text-xs font-bold text-red-400">DH</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes & Payment */}
                            {(selectedOrder.notes || selectedOrder.payment_method) && (
                                <div>
                                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 px-1">
                                        <span className="w-2 h-[2px] bg-amber-500/30 rounded-full"></span>
                                        Note Client
                                        <span className="flex-1 h-[1px] bg-gray-200/50 ml-1"></span>
                                    </h4>
                                    <div className="bg-amber-50/80 rounded-[16px] p-3.5 border border-amber-200/60 shadow-sm flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-full bg-amber-100/80 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                                            <AlertCircle size={16} strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-2 pt-0.5 w-full">
                                            {selectedOrder.payment_method && (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[8px] font-black text-amber-900/50 uppercase tracking-widest bg-amber-100 px-1.5 py-0.5 rounded-md shrink-0">Mode</span>
                                                            <span className="text-xs font-black text-amber-900">{selectedOrder.payment_method}</span>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${selectedOrder.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                            {selectedOrder.payment_status || 'Unpaid'}
                                                        </span>
                                                    </div>
                                                    {selectedOrder.transaction_id && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded-md shrink-0">Trans. ID</span>
                                                            <span className="text-[10px] font-medium text-gray-500 font-mono truncate">{selectedOrder.transaction_id}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {selectedOrder.notes && (
                                                <div className="bg-white/60 p-2.5 rounded-xl border border-amber-100 max-w-full">
                                                    <p className="text-[12px] font-bold text-amber-900 leading-snug break-words">{selectedOrder.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
