import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    LayoutDashboard, Search, Bell, Settings, User, TrendingUp,
    TrendingDown, Package, Clock, AlertTriangle, MapPin, ArrowRight,
    Filter, Zap, ShieldCheck, Activity, Globe, ChevronDown, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShipmentMap from '../components/ShipmentMap.jsx';
import { getCityCoords } from '../utils/cityUtils.js';


// --- MOCK DATA ---
const SHIPMENT_DATA = [
    { name: 'Mon', delivered: 400, risk: 24, delayed: 10 },
    { name: 'Tue', delivered: 300, risk: 13, delayed: 22 },
    { name: 'Wed', delivered: 200, risk: 98, delayed: 5 },
    { name: 'Thu', delivered: 278, risk: 39, delayed: 15 },
    { name: 'Fri', delivered: 189, risk: 48, delayed: 30 },
    { name: 'Sat', delivered: 239, risk: 38, delayed: 18 },
    { name: 'Sun', delivered: 349, risk: 43, delayed: 12 },
];

const RISK_DATA = [
    { name: 'Low Risk', value: 400, color: '#10B981' },
    { name: 'Medium Risk', value: 300, color: '#F59E0B' },
    { name: 'High Risk', value: 100, color: '#EF4444' },
];

const ROUTE_DATA = [
    { name: 'Delhi → Mumbai', efficiency: 94 },
    { name: 'Kolkata → Bangalore', efficiency: 88 },
    { name: 'Chennai → Hyderabad', efficiency: 91 },
    { name: 'Mumbai → Pune', efficiency: 98 },
];

const CARRIER_DATA = [
    { name: 'DHL', onTime: 92, avgTime: 14 },
    { name: 'FedEx', onTime: 88, avgTime: 16 },
    { name: 'BlueDart', onTime: 85, avgTime: 18 },
    { name: 'Delhivery', onTime: 95, avgTime: 12 },
];

const DELAY_CAUSES = [
    { name: 'Traffic', value: 35 },
    { name: 'Weather', value: 25 },
    { name: 'Warehouse', value: 20 },
    { name: 'Customs', value: 10 },
    { name: 'Operational', value: 10 },
];

const FORECAST_DATA = [
    { name: 'Day 1', predicted: 45 },
    { name: 'Day 2', predicted: 52 },
    { name: 'Day 3', predicted: 38 },
    { name: 'Day 4', predicted: 65 },
    { name: 'Day 5', predicted: 48 },
    { name: 'Day 6', predicted: 42 },
    { name: 'Day 7', predicted: 50 },
];

const PREDICTIONS = [
    { id: 'SH-4921', route: 'Delhi → Mumbai', risk: 'HIGH', delay: '12 hrs', color: 'rose' },
    { id: 'SH-4922', route: 'Kolkata → Pune', risk: 'MEDIUM', delay: '4 hrs', color: 'amber' },
    { id: 'SH-4923', route: 'Chennai → Delhi', risk: 'LOW', delay: 'On time', color: 'emerald' },
];

const FEED_EVENTS = [
    { time: '10:42 AM', msg: 'Heavy rainfall detected near Bangalore route.' },
    { time: '10:35 AM', msg: 'Traffic congestion detected on Delhi → Mumbai highway.' },
    { time: '10:20 AM', msg: 'Shipment SH-4924 flagged as high delay risk.' },
    { time: '10:05 AM', msg: 'Alternative carrier assigned to shipment SH-4921.' },
];

// --- COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${active ? 'bg-primary/20 text-primary shadow-glow' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
    >
        <Icon size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    </button>
);

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }) => {
    const isUp = trend === 'up';
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-[#111827] border border-white/5 p-6 rounded-3xl relative overflow-hidden group shadow-2xl hover:border-primary/30 transition-all cursor-default"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex justify-between items-start relative z-10">
                <div className={`p-4 rounded-2xl bg-white/5 text-${color}-400 border border-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all`}>
                    <Icon size={24} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                    <motion.h3 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-black text-white tracking-tighter"
                    >
                        {value}
                    </motion.h3>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative z-10">
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trendValue}%
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase italic">vs last month</span>
            </div>
        </motion.div>
    );
};

const SectionHeader = ({ title, subtitle, children }) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{title}</h2>
            <p className="text-slate-400 text-sm font-medium italic max-w-xl">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
            {children}
        </div>
    </div>
);

const ChartCard = ({ title, children, className = "" }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group ${className}`}
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {title}
        </h3>
        <div className="relative z-10">
            {children}
        </div>
    </motion.div>
);

const Analytics = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { return null; }
        }
        return null;
    });
    const [dateRange, setDateRange] = useState('Last 7 days');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Session error:', err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/shipments/history');
                setHistory(res.data);
            } catch (err) {
                console.error('Error fetching analytics history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    // Derived Metrics
    const totalShipments = 1284 + history.length; // Baseline + new
    const delayedCount = history.filter(s => s.delay === '1').length || 12;
    const onTimeRate = (((totalShipments - delayedCount) / totalShipments) * 100).toFixed(1);
    const highRiskCount = history.filter(s => parseFloat(s.Port_Congestion) > 3).length || 42;

    if (!user) return <div className="min-h-screen bg-[#0B1220]" />;

    return (
        <div className="min-h-screen bg-[#0B1220] text-slate-300 font-sans selection:bg-primary/30 overflow-hidden flex">
            {/* 1. Top Navigation & Sidebar (Combined for consistency) */}
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
                    <NavItem icon={Activity} label="Analytics" active />
                    <NavItem icon={Package} label="Shipments" onClick={() => navigate('/shipments')} />
                    <NavItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-auto px-6 pt-8 border-t border-white/5">
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

            {/* Main scrollable area */}
            <main className="flex-grow overflow-y-auto p-8 relative">
                {/* Background Decorative Rings */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -mr-96 -mt-96" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-start/5 rounded-full blur-[120px] -ml-48 -mb-48" />
                </div>

                {/* Top Nav Bar */}
                <nav className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl relative z-40">
                    <div className="flex-grow max-w-xl relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search shipments, routes, insights..." 
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-200"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6 ml-6">
                        <div className="relative cursor-pointer hover:text-primary transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#111827]" />
                        </div>
                        <Settings size={20} className="cursor-pointer hover:text-primary transition-colors" />
                        <div className="h-10 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 p-[1.5px] cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-blue-500/40">
                            <div className="w-full h-full rounded-[0.9rem] bg-[#111827] flex items-center justify-center text-[10px] font-black text-primary">
                                {(user.fullname || user.name || 'U').charAt(0)}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* 2. Page Header & Date Selector */}
                <SectionHeader 
                    title="Logistics Analytics" 
                    subtitle="Analyze shipment performance, detect risks early, and optimize logistics operations using AI-powered insights."
                >
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${showFilters ? 'bg-primary border-primary text-white shadow-glow' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                        >
                            <Filter size={14} />
                            {showFilters ? 'Hide Filters' : 'Toggle Filters'}
                        </button>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5 shadow-2xl"
                                >
                                    {['Last 7 days', 'Last 30 days', 'Last 90 days'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setDateRange(range)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateRange === range ? 'bg-primary text-white shadow-glow' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </SectionHeader>

                {/* 3. Summary Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard title="Total Shipments" value={totalShipments.toLocaleString()} trend="up" trendValue="12" icon={Package} color="blue" />
                    <StatCard title="On-Time Deliveries" value={(totalShipments - delayedCount).toLocaleString()} trend="up" trendValue="5" icon={ShieldCheck} color="emerald" />
                    <StatCard title="Delayed Shipments" value={delayedCount.toLocaleString()} trend="down" trendValue="8" icon={Clock} color="rose" />
                    <StatCard title="AI Risk Alerts" value={highRiskCount.toString()} trend="up" trendValue="15" icon={AlertTriangle} color="amber" />
                </div>

                {/* 4. & 13. Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* Shipment Performance (Line Chart) */}
                    <ChartCard title="Shipment Performance Over Time" className="lg:col-span-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SHIPMENT_DATA}>
                                    <defs>
                                        <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRiskLine" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '16px', fontSize: '10px' }}
                                        itemStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="delivered" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorDelivered)" dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
                                    <Area type="monotone" dataKey="risk" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRiskLine)" />
                                    <Area type="monotone" dataKey="delayed" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* 13. Predicted Delay Trends */}
                    <ChartCard title="Predicted Delay Trends (Next 7 Days)" className="lg:col-span-4">
                         <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={FORECAST_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                                    <XAxis dataKey="name" hide />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '16px', fontSize: '10px' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="predicted" 
                                        stroke="#6366F1" 
                                        strokeWidth={4} 
                                        dot={{ r: 6, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                        animationDuration={2000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-4 text-[10px] font-bold text-slate-500 italic text-center uppercase">Expected risk fluctuations based on satellite weather data.</p>
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* 5. AI Delay Risk Distribution (Donut Chart) */}
                    <ChartCard title="AI Predicted Risk Distribution">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={RISK_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {RISK_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* 6. Route Efficiency Analysis */}
                    <ChartCard title="Route Efficiency Analysis (Success Rate)">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ROUTE_DATA} layout="vertical" margin={{ left: -20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tick={{ fill: '#6B7280', fontSize: 8, fontWeight: 'bold' }} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="efficiency" radius={[0, 10, 10, 0]}>
                                        {ROUTE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.efficiency > 95 ? '#10B981' : '#3B82F6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* 7. Carrier Performance */}
                    <ChartCard title="Carrier Performance Comparison">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CARRIER_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937' }} />
                                    <Bar dataKey="onTime" fill="#6366F1" radius={[10, 10, 0, 0]} />
                                    <Bar dataKey="avgTime" fill="#38BDF8" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* 9. Geographic Logistics Map (Placeholder) */}
                    <ChartCard title="Geographic Logistics Insights" className="lg:col-span-8 p-0">
                        <div className="h-[432px] w-full rounded-3xl overflow-hidden relative">
                            <ShipmentMap 
                                origin={null} 
                                destination={null} 
                                risk={0.2}
                                path={[]}
                            />
                            {/* Stats Overlay for Map */}
                            <div className="absolute bottom-6 left-6 z-[1000] flex gap-4">
                                <div className="bg-[#111827]/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
                                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Active Hubs</p>
                                    <p className="text-sm font-black text-white italic">24 INDIA NODES</p>
                                </div>
                                <div className="bg-[#111827]/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
                                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Network Load</p>
                                    <p className="text-sm font-black text-emerald-400 italic">OPTIMAL</p>
                                </div>
                            </div>
                        </div>
                    </ChartCard>

                    {/* 8. Delay Causes Breakdown */}
                    <ChartCard title="Primary Delay Causes" className="lg:col-span-4">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={DELAY_CAUSES}
                                        innerRadius={0}
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {DELAY_CAUSES.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#EF4444'][index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* 10. AI Delay Prediction Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    <ChartCard title="AI Logistics Risk Feed (Real-Time Predicted Delays)" className="lg:col-span-8 p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Shipment ID</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Route</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Delay Risk</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Delay</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {PREDICTIONS.map((p) => (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-black text-primary text-xs">{p.id}</td>
                                            <td className="px-8 py-6 text-xs font-bold text-slate-300">{p.route}</td>
                                            <td className="px-8 py-6">
                                                <div className={`px-3 py-1 bg-${p.color}-500/10 text-${p.color}-400 border border-${p.color}-500/20 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase`}>
                                                    {p.risk === 'HIGH' && <AlertTriangle size={12} className="animate-pulse" />}
                                                    {p.risk}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-black text-slate-400 italic">{p.delay}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartCard>

                    {/* 14. Logistics Network Risk Score */}
                    <ChartCard title="Global Network Risk Score" className="lg:col-span-4">
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="80" fill="none" stroke="#1F2937" strokeWidth="12" />
                                    <motion.circle 
                                        cx="96" cy="96" r="80" fill="none" stroke="#F59E0B" strokeWidth="12" 
                                        strokeDasharray="502.4"
                                        initial={{ strokeDashoffset: 502.4 }}
                                        animate={{ strokeDashoffset: 502.4 * (1 - 62/100) }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-4xl font-black text-white">62<span className="text-xl text-slate-500">/100</span></p>
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Moderate Risk</p>
                                </div>
                            </div>
                            <div className="mt-8 space-y-3 w-full">
                                {[
                                    { label: 'Traffic Congestion', value: 85, color: 'primary' },
                                    { label: 'Weather Disruptions', value: 45, color: 'indigo-600' },
                                    { label: 'Port Delay Capacity', value: 30, color: 'rose-500' }
                                ].map((factor, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
                                            <span>{factor.label}</span>
                                            <span>{factor.value}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${factor.value}%` }}
                                                className={`h-full bg-${factor.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 11. AI Route Optimization Panel */}
                    <ChartCard title="AI Intelligence: Re-Routing Recommendations">
                        <div className="space-y-6">
                            <motion.div 
                                layout
                                className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl relative overflow-hidden group shadow-glow"
                            >
                                <div className="absolute top-0 right-0 p-4 text-emerald-500/20">
                                    <RefreshCw size={80} className="group-hover:rotate-180 transition-transform duration-1000" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-600 uppercase">Current Route</p>
                                            <p className="text-sm font-black text-white flex items-center gap-2">Delhi <ArrowRight size={14} /> Mumbai</p>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-bold">
                                            Heavy traffic detected on NH-48
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-l border-white/5 md:pl-8">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-emerald-500 uppercase">Recommended Path</p>
                                            <p className="text-sm font-black text-white flex items-center gap-2">Delhi <ArrowRight size={14} /> Jaipur <ArrowRight size={14} /> Mumbai</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase">Est. Saved</p>
                                                <p className="text-lg font-black text-emerald-400">3 Hours</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase">Risk Reduction</p>
                                                <p className="text-lg font-black text-emerald-400">47%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </ChartCard>

                    {/* 12. Real-Time Logistics Intelligence Feed */}
                    <ChartCard title="Real-Time Operations Intelligence Feed">
                        <div className="h-[300px] overflow-y-auto no-scrollbar space-y-4 p-2">
                            {FEED_EVENTS.map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                                >
                                    <div className="text-[9px] font-black p-2 bg-slate-950 text-slate-500 rounded-xl group-hover:text-primary transition-colors">
                                        {item.time}
                                    </div>
                                    <div className="text-xs font-bold text-slate-300 leading-relaxed italic group-hover:text-white transition-colors">
                                        {item.msg}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ChartCard>
                </div>

                {/* Footer Info */}
                <footer className="text-center py-10 opacity-30 select-none">
                    <div className="flex justify-center items-center gap-4 mb-2">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Innovate X AI Intelligence Node v4.0.2</span>
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Enterprise Logistics Control Center • Protected by Advanced Encryption</p>
                </footer>
            </main>
        </div>
    );
};

export default Analytics;
