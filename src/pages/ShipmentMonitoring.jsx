import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LogOut,
    Truck,
    LayoutDashboard,
    Search, 
    Bell, 
    Settings, 
    Plus, 
    Filter, 
    ChevronDown, 
    MoreHorizontal, 
    ExternalLink, 
    MapPin, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    ArrowRight,
    X,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
    Package,
    Activity,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${active ? 'bg-primary/20 text-primary shadow-glow' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
    >
        <Icon size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    </button>
);

// MOCK DATA
const INITIAL_SHIPMENTS = [
    { id: 'SHP10231', origin: 'Delhi', destination: 'Mumbai', carrier: 'DHL', eta: '18 Mar 3PM', risk: 12, status: 'On Time', recommendation: 'Maintain current route. High efficiency detected.' },
    { id: 'SHP10232', origin: 'Bangalore', destination: 'Chennai', carrier: 'FedEx', eta: '19 Mar 10AM', risk: 48, status: 'At Risk', recommendation: 'Traffic bottleneck near Hosur. Consider bypass route 7.' },
    { id: 'SHP10233', origin: 'Kolkata', destination: 'Hyderabad', carrier: 'BlueDart', eta: '20 Mar 9PM', risk: 82, status: 'Delayed', recommendation: 'Unexpected storm alert. Re-routing to safe terminal in Vijayawada.' },
    { id: 'SHP10234', origin: 'Mumbai', destination: 'Pune', carrier: 'Swift', eta: '18 Mar 6PM', risk: 5, status: 'On Time', recommendation: 'Clear path. Accelerated delivery possible.' },
    { id: 'SHP10235', origin: 'Ahmedabad', destination: 'Surat', carrier: 'Delhivery', eta: '19 Mar 2PM', risk: 15, status: 'On Time', recommendation: 'Optimal speed maintained.' },
    { id: 'SHP10236', origin: 'Jaipur', destination: 'Gurgaon', carrier: 'DHL', eta: '21 Mar 11AM', risk: 25, status: 'At Risk', recommendation: 'Monitor sensor data. Humidity levels slightly elevated.' },
    { id: 'SHP10237', origin: 'New York', destination: 'London', carrier: 'GlobalAir', eta: '22 Mar 4AM', risk: 10, status: 'On Time', recommendation: 'Jetstream favorable. Arriving early.' },
    { id: 'SHP10238', origin: 'Dubai', destination: 'Singapore', carrier: 'Oceanic', eta: '25 Mar 1PM', risk: 35, status: 'At Risk', recommendation: 'Port congestion reported. Potential 2-hour delay at docking.' },
    { id: 'SHP10239', origin: 'Los Angeles', destination: 'Tokyo', carrier: 'TransPacific', eta: '26 Mar 8AM', risk: 55, status: 'At Risk', recommendation: 'Strong headwinds expected. Fuel consumption rising.' },
    { id: 'SHP10240', origin: 'Berlin', destination: 'Paris', carrier: 'EuroLink', eta: '18 Mar 11PM', risk: 8, status: 'On Time', recommendation: 'Normal traffic conditions.' },
    { id: 'SHP10241', origin: 'Shanghai', destination: 'Seattle', carrier: 'Oceanic', eta: '30 Mar 2PM', risk: 92, status: 'Delayed', recommendation: 'Engine maintenance required at Midway. Scheduled delay 48h.' },
    { id: 'SHP10242', origin: 'Moscow', destination: 'Beijing', carrier: 'SilkRoad', eta: '22 Mar 5PM', risk: 42, status: 'At Risk', recommendation: 'Customs processing slower than usual.' },
    { id: 'SHP10243', origin: 'Toronto', destination: 'Chicago', carrier: 'NorthTrack', eta: '19 Mar 9AM', risk: 15, status: 'On Time', recommendation: 'Clear skies. Ahead of schedule.' },
    { id: 'SHP10244', origin: 'Sydney', destination: 'Auckland', carrier: 'TasmanAir', eta: '20 Mar 1PM', risk: 5, status: 'On Time', recommendation: 'Optimal flight path.' },
    { id: 'SHP10245', origin: 'Cape Town', destination: 'Cairo', carrier: 'PanAfrican', eta: '24 Mar 6PM', risk: 68, status: 'Delayed', recommendation: 'Logistic strike in Nairobi hub. Rerouting via Addis.' },
    { id: 'SHP10246', origin: 'Rio', destination: 'Miami', carrier: 'LatamCargo', eta: '22 Mar 11AM', risk: 20, status: 'On Time', recommendation: 'Smooth sailing.' },
    { id: 'SHP10247', origin: 'Delhi', destination: 'London', carrier: 'IndoAir', eta: '23 Mar 4PM', risk: 38, status: 'At Risk', recommendation: 'Weather front moving into Heathrow.' },
    { id: 'SHP10248', origin: 'Mumbai', destination: 'Dubai', carrier: 'GulfCargo', eta: '19 Mar 3AM', risk: 12, status: 'On Time', recommendation: 'On track.' },
    { id: 'SHP10249', origin: 'Seoul', destination: 'San Francisco', carrier: 'PacificWide', eta: '25 Mar 10AM', risk: 75, status: 'Delayed', recommendation: 'Port maintenance at SFO. Delay 15h.' },
    { id: 'SHP10250', origin: 'Bangkok', destination: 'Sydney', carrier: 'ThaiLogistics', eta: '26 Mar 9PM', risk: 28, status: 'On Time', recommendation: 'Clear route.' },
];

const StatCard = ({ title, value, description, icon: Icon, color }) => {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl relative overflow-hidden group transition-all cursor-default shadow-xl"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex justify-between items-start relative z-10">
                <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                    <motion.h3 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-black text-white tracking-tighter"
                    >
                        {value}
                    </motion.h3>
                </div>
            </div>
            <p className="mt-4 text-[10px] font-bold text-slate-500 italic uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{description}</p>
        </motion.div>
    );
};

const ShipmentMonitoring = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const showToast = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAcknowledge = (id) => {
        setShipments(prev => prev.map(s => 
            s.id === id ? { ...s, risk: 0, status: 'On Time' } : s
        ));
        setSelectedShipment(null);
        showToast(`Risk for ${id} has been acknowledged and mitigated.`, 'success');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) setUser(JSON.parse(storedUser));
        else navigate('/login');

        // Simulating load
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const filteredShipments = shipments.filter(s => {
        const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s.destination.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
    const paginatedShipments = filteredShipments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchQuery]);

    const getStatusBadge = (status) => {
        const colors = {
            'On Time': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'At Risk': 'bg-amber-50 text-amber-600 border-amber-100',
            'Delayed': 'bg-rose-50 text-rose-600 border-rose-100'
        };
        const icons = {
            'On Time': <CheckCircle2 size={12} />,
            'At Risk': <AlertTriangle size={12} className="animate-pulse" />,
            'Delayed': <AlertTriangle size={12} />
        };

        return (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${colors[status]}`}>
                {icons[status]}
                {status}
            </div>
        );
    };

    const getRiskColor = (risk) => {
        if (risk < 30) return '#10b981'; // Emerald
        if (risk < 60) return '#f59e0b'; // Amber
        return '#ef4444'; // Rose
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0B1220] text-slate-300 font-sans selection:bg-primary/30 overflow-hidden flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col py-8 z-50 hidden lg:flex">
                <div className="px-6 mb-12">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform">
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        <span className="font-black text-lg tracking-tighter text-white">
                            INNOVATE X AI
                        </span>
                    </div>
                </div>
                
                <nav className="flex-grow px-4 space-y-2">
                    <NavItem icon={LayoutDashboard} label="Overview" onClick={() => navigate('/dashboard')} />
                    <NavItem icon={Activity} label="Analytics" onClick={() => navigate('/analytics')} />
                    <NavItem icon={Truck} label="Shipments" active />
                    <NavItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-6 px-4">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all group">
                        <LogOut size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
                    </button>
                </div>

                <div className="mt-12 px-6 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-black text-white text-sm">
                            {(user.fullname || user.name || 'U').charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-white uppercase truncate">{user.fullname || user.name || 'User'}</p>
                            <p className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none mt-1 truncate">Logistics Lead</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto p-8 relative">
                {/* Background Decorative Elements */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -ml-24 -mb-24" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,#0B1220_100%)]" />
                </div>

                {/* Top Navigation Bar */}
                <nav className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl relative z-40">
                    <div 
                        className="flex items-center gap-3 cursor-pointer group lg:hidden"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-white">
                            INNOVATE X AI
                        </span>
                    </div>

                    <div className="flex-grow max-w-xl relative group ml-4 lg:ml-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search shipments..." 
                            className="w-full bg-[#111827]/50 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm outline-none focus:bg-[#111827] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600 text-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-6 ml-6">
                        <div className="relative group cursor-pointer hover:text-primary transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#111827] animate-pulse" />
                        </div>
                        <button 
                            onClick={() => navigate('/analytics')}
                            className="p-2 text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group"
                            title="Analytics"
                        >
                            <Activity size={22} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block opacity-0 group-hover:opacity-100 transition-opacity">Analytics</span>
                        </button>
                        <Settings size={20} className="cursor-pointer hover:text-primary transition-colors" />
                        <div className="h-10 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 p-[1.5px] cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-blue-500/40">
                            <div className="w-full h-full rounded-[0.9rem] bg-[#111827] flex items-center justify-center text-[10px] font-black text-primary">
                                {(user.fullname || user.name || 'U').charAt(0)}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="pb-20 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-3">
                            Shipment Monitoring
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
                            Monitor shipments in real time and identify <span className="text-primary font-bold italic">AI-predicted delivery risks</span> before delays occur. Powered by advanced logistics modeling.
                        </p>
                    </motion.div>

                    <motion.button 
                        whileHover={{ scale: 1.05, shadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => showToast("Opening shipment gateway...", "info")}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30 flex items-center gap-3 transition-all"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add New Shipment
                    </motion.button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <StatCard 
                        title="Active Shipments" 
                        value="1,284" 
                        description="Currently In Transit Worldwide" 
                        icon={Package} 
                        color="blue" 
                    />
                    <StatCard 
                        title="At Risk" 
                        value="42" 
                        description="AI Predicted Potential Delays" 
                        icon={AlertTriangle} 
                        color="amber" 
                    />
                    <StatCard 
                        title="Delayed" 
                        value="12" 
                        description="Action Required Immediately" 
                        icon={Clock} 
                        color="rose" 
                    />
                </div>

                {/* Filters */}
                <section className="bg-[#111827]/50 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] mb-8 shadow-2xl">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Filter size={14} />
                            Filters:
                        </div>
                        
                        {['All', 'On Time', 'At Risk', 'Delayed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === status 
                                    ? 'bg-primary text-white shadow-lg shadow-blue-500/40' 
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {status}
                            </button>
                        ))}

                        <div className="flex-grow" />

                        <button 
                            onClick={() => { setStatusFilter('All'); setSearchQuery(''); }}
                            className="px-5 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-rose-500/20"
                        >
                            <Zap size={14} />
                            Reset Filters
                        </button>
                    </div>
                </section>

                {/* Shipment Table */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#111827]/70 backdrop-blur-2xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative"
                >
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Shipment ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Route</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Carrier</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ETA</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Delay Risk</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {paginatedShipments.map((shipment, i) => (
                                        <motion.tr 
                                            key={shipment.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-blue-50/30 transition-colors group relative"
                                        >
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-primary transition-all">
                                                    {shipment.id}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-slate-200">{shipment.origin}</span>
                                                    <ArrowRight size={12} className="text-slate-600" />
                                                    <span className="text-xs font-bold text-slate-200">{shipment.destination}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                                        <Activity size={12} className="text-slate-400" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400">{shipment.carrier}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold text-slate-400 italic uppercase">{shipment.eta}</span>
                                            </td>
                                            <td className="px-8 py-6 min-w-[200px]">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                                        <span className="text-slate-500 font-bold">Risk Factor</span>
                                                        <span style={{ color: getRiskColor(shipment.risk) }}>{shipment.risk}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${shipment.risk}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className="h-full"
                                                            style={{ backgroundColor: getRiskColor(shipment.risk) }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {getStatusBadge(shipment.status)}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => setSelectedShipment(shipment)}
                                                        className="p-2 bg-white/5 hover:bg-primary text-slate-500 hover:text-white rounded-xl transition-all border border-white/5"
                                                        title="View Details"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => showToast(`Tracking ${shipment.id} via Satellite...`, "info")}
                                                        className="p-2 bg-white/5 hover:bg-indigo-600 text-slate-500 hover:text-white rounded-xl transition-all border border-white/5"
                                                        title="Track Live"
                                                    >
                                                        <MapPin size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => showToast(`Generating PDF report for ${shipment.id}`, "info")}
                                                        className="p-2 bg-white/5 hover:bg-emerald-600 text-slate-500 hover:text-white rounded-xl transition-all border border-white/5"
                                                        title="Full Report"
                                                    >
                                                        <List size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-8 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Rows per page:</span>
                            <select 
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="bg-[#0B1220] border border-white/5 rounded-xl px-3 py-1.5 text-[10px] font-bold text-slate-400 outline-none focus:border-primary transition-all cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <span className="text-[10px] font-bold text-slate-500 italic">
                                Showing {paginatedShipments.length} of {filteredShipments.length} entries
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'text-white/5' : 'text-slate-500 hover:text-primary hover:bg-white/5'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <button 
                                        key={n}
                                        onClick={() => setCurrentPage(n)}
                                        className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${currentPage === n ? 'bg-primary text-white shadow-lg shadow-blue-500/40' : 'hover:bg-white/5 text-slate-500'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'text-white/5' : 'text-slate-500 hover:text-primary hover:bg-white/5'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.section>
            </div>
        </main>

            {/* Side Panel */}
            <AnimatePresence>
                {selectedShipment && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedShipment(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#111827]/95 backdrop-blur-3xl border-l border-white/5 z-[101] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] p-8 overflow-y-auto no-scrollbar"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div className="p-4 rounded-3xl bg-primary/20 text-primary border border-primary/20 shadow-glow shadow-primary/20">
                                    <Zap size={32} fill="currentColor" className="animate-pulse" />
                                </div>
                                <button 
                                    onClick={() => setSelectedShipment(null)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Shipment Identity</p>
                                    <h2 className="text-4xl font-black text-white tracking-tighter">{selectedShipment.id}</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Origin</p>
                                        <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                            <MapPin size={14} className="text-primary" />
                                            {selectedShipment.origin}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Destination</p>
                                        <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                            <ArrowRight size={14} className="text-primary" />
                                            {selectedShipment.destination}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Logistics Path</p>
                                        <div className="px-3 py-1 bg-primary/20 rounded-full text-[9px] font-black text-primary tracking-tighter border border-primary/20">LIVE TRACKING</div>
                                    </div>
                                    <div className="h-48 w-full bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                        <div className="relative text-center space-y-2">
                                            <Activity size={40} className="text-primary/40 mx-auto animate-bounce" />
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Map Simulation Active</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-[#0B1220] rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-glow shadow-primary/5">
                                    <div className="absolute -top-10 -right-10 p-6 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                                        <ShieldCheck size={120} className="text-primary" />
                                    </div>
                                    <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Zap size={14} fill="currentColor" />
                                        AI Insights & Recommendation
                                    </h4>
                                    <p className="text-slate-300 text-sm font-medium leading-relaxed italic border-l-2 border-primary/40 pl-4">
                                        "{selectedShipment.recommendation}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-xs p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="font-bold text-slate-500">Carrier Assigned</span>
                                        <span className="font-black text-slate-200 uppercase">{selectedShipment.carrier}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="font-bold text-slate-500">ETA Estimate</span>
                                        <span className="font-black text-slate-200 uppercase">{selectedShipment.eta}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleAcknowledge(selectedShipment.id)}
                                    className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all flex items-center justify-center gap-3 border border-primary/20"
                                >
                                    <CheckCircle2 size={16} strokeWidth={3} />
                                    Acknowledge Risk
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[150] flex items-center gap-3 px-6 py-4 bg-[#111827] rounded-2xl shadow-2xl shadow-primary/20 border border-white/5"
                    >
                        <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
                            <Zap size={18} className="text-primary" fill="currentColor" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                            {notification.message}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShipmentMonitoring;
