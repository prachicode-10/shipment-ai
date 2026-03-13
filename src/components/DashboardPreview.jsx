import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { fadeIn } from '../animations/motionVariants.js';
import { AlertTriangle, Clock, Map } from 'lucide-react';

const data = [
    { name: 'Mon', risk: 24, delay: 12 },
    { name: 'Tue', risk: 13, delay: 19 },
    { name: 'Wed', risk: 98, delay: 3 },
    { name: 'Thu', risk: 39, delay: 48 },
    { name: 'Fri', risk: 48, delay: 38 },
    { name: 'Sat', risk: 38, delay: 43 },
    { name: 'Sun', risk: 43, delay: 25 },
];

const DashboardPreview = () => {
    return (
        <section id="dashboard" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/3 space-y-6"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase shadow-glow">
                            INSIGHTS DASHBOARD
                        </div>
                        <h2 className="text-4xl font-bold leading-tight text-white">
                            Control the Chaos with <br />
                            <span className="premium-gradient-text">Live Data Visuals</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Manage your entire fleet's risk profile from a single, AI-powered control center.
                        </p>

                        <ul className="space-y-4 pt-4">
                            {[
                                { icon: <AlertTriangle className="text-amber-500" />, text: 'Predictive risk heatmaps' },
                                { icon: <Clock className="text-blue-500" />, text: 'Real-time delay notifications' },
                                { icon: <Map className="text-indigo-500" />, text: 'Global shipment fleet view' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-medium text-slate-300">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 shadow-soft flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Right Dashboard Mock */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-2/3 w-full"
                    >
                        <div className="bg-[#0f121a] rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                            {/* Dashboard Header */}
                            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">ShipmentGuard Terminal v2.0</div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    {/* Main Chart */}
                                    <div className="h-[250px] w-full">
                                        <p className="text-sm font-bold text-slate-500 mb-4">DELAY RISK FORECAST (7D)</p>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data}>
                                                <defs>
                                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)', color: '#fff' }} 
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Area type="monotone" dataKey="risk" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Mini Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                                            <p className="text-xs font-bold text-primary">LIVE SHIPMENTS</p>
                                            <p className="text-2xl font-bold text-white uppercase tabular-nums tracking-tighter">1,248</p>
                                        </div>
                                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                            <p className="text-xs font-bold text-amber-500">AT RISK</p>
                                            <p className="text-2xl font-bold text-white uppercase tabular-nums tracking-tighter">42</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                                    <p className="text-sm font-bold text-slate-400 mb-4 tracking-widest uppercase">REAL-TIME RISK FEED</p>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'S-712', status: 'Storm Alert', loc: 'North Atlantic' },
                                            { id: 'S-904', status: 'Port Congestion', loc: 'Long Beach' },
                                            { id: 'S-331', status: 'Truck Strike', loc: 'Berlin, DE' },
                                            { id: 'S-112', status: 'Route Optimized', loc: 'Singapore' },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-3 rounded-lg flex justify-between items-center transition-all ${i === 0 ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30' : 'bg-white/5 text-slate-300'}`}>
                                                <div className="text-xs">
                                                    <span className="font-bold opacity-50">#{item.id}</span>
                                                    <p className="font-bold text-sm tracking-tight">{item.status}</p>
                                                </div>
                                                <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">{item.loc}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Glowing effect inside dark panel */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
