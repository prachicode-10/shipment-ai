import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Truck, 
    Settings, 
    LogOut, 
    Bell, 
    ShieldCheck, 
    Activity,
    AlertTriangle,
    Zap,
    MapPin,
    ArrowRight,
    Search,
    ChevronDown,
    X
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LiveTrackingMap from '../components/LiveTrackingMap.jsx';

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

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { return null; }
        }
        return null;
    });
    const [activePrediction, setActivePrediction] = useState(null);
    const [formData, setFormData] = useState({ origin: '', destination: '' });
    const [availableCities, setAvailableCities] = useState([]);
    const [citySearch, setCitySearch] = useState({ origin: '', destination: '' });
    const [showCityDropdown, setShowCityDropdown] = useState({ origin: false, destination: false });

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

        const fetchCities = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/cities');
                setAvailableCities(res.data);
            } catch (err) {
                console.error('Error fetching cities:', err);
            }
        };
        fetchCities();
    }, [navigate, setUser]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const handlePredict = (e) => {
        e.preventDefault();
        if (formData.origin && formData.destination) {
            setActivePrediction({ ...formData });
        }
    };

    const filterCities = (query) => {
        if (!query) return [];
        return availableCities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    };

    if (!user) return <div className="min-h-screen bg-[#0B1220]" />;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 flex overflow-hidden">
            {/* Original Sidebar with Branding */}
            <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col py-8 z-50">
                <div className="px-6 mb-12">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        <span className="font-black text-lg tracking-tighter text-white">
                            INNOVATE X AI
                        </span>
                    </div>
                </div>
                
                <nav className="flex-grow px-4 space-y-2">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', active: true, path: '/dashboard' },
                        { icon: Activity, label: 'Analytics', path: '/analytics' },
                        { icon: Truck, label: 'Shipments', path: '/shipments' },
                        { icon: Settings, label: 'Settings' }
                    ].map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => item.path && navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${item.active ? 'bg-primary/20 text-primary shadow-glow' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button onClick={handleLogout} className="mt-auto p-4 text-slate-600 hover:text-red-400 transition-colors group relative">
                    <LogOut size={24} />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-red-900/50 text-red-100 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-8 relative">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
                
                {/* Header */}
                <header className="flex justify-between items-center mb-12 relative z-10">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">
                            Hello, <span className="text-primary">{user.fullname || user.name || 'User'}</span>
                        </h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Intelligence Overview • {new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Bell className="text-slate-400 group-hover:text-primary cursor-pointer transition-colors" size={22} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050505] animate-pulse" />
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 select-none">
                            <div className="hidden text-right md:block">
                                <p className="text-[10px] font-black text-white uppercase leading-none">{user.fullname || user.name || 'User'}</p>
                                <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Enterprise Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-glow-purple">
                                {(user.fullname || user.name || 'U').charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 relative z-10">
                    <StatCard title="Active Transits" value="1,284" description="92% ON-TIME PROBABILITY" icon={Truck} color="blue" />
                    <StatCard title="High Risk Alerts" value="42" description="WEATHER & TRAFFIC IMPACTS" icon={AlertTriangle} color="amber" />
                    <StatCard title="Intelligence Score" value="98.5" description="AI PREDICTION ACCURACY" icon={Zap} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    {/* Map Integration */}
                    <div className="lg:col-span-8 h-[600px]">
                        <div className="h-full rounded-[2.5rem] bg-white/5 border border-white/5 overflow-hidden shadow-2xl relative group">
                            <div className="absolute top-6 left-6 z-20">
                                <h3 className="text-xs font-black text-white italic tracking-widest uppercase bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-2">
                                    <Activity size={14} className="text-primary animate-pulse" />
                                    Live Global Fleet Tracking
                                </h3>
                            </div>
                            <LiveTrackingMap activePrediction={activePrediction} />
                        </div>
                    </div>

                    {/* AI Prediction Tool */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-sm font-black text-white italic tracking-widest uppercase">AI Delay Prediction</h3>
                            </div>

                            <form onSubmit={handlePredict} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Origin City</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                                            <div className="w-2 h-2 rounded-full border-2 border-primary" />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., Delhi" 
                                            className="w-full bg-[#050505] border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-800"
                                            value={formData.origin || citySearch.origin}
                                            onChange={(e) => {
                                                setCitySearch({ ...citySearch, origin: e.target.value });
                                                setFormData({ ...formData, origin: '' });
                                                setShowCityDropdown({ ...showCityDropdown, origin: true });
                                            }}
                                            onFocus={() => setShowCityDropdown({ ...showCityDropdown, origin: true })}
                                        />
                                        <AnimatePresence>
                                            {showCityDropdown.origin && filterCities(citySearch.origin).length > 0 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-[100] w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                                >
                                                    {filterCities(citySearch.origin).map((city, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className="w-full px-4 py-3 text-left text-xs font-bold text-slate-300 hover:bg-primary/20 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                                            onClick={() => {
                                                                setFormData({ ...formData, origin: city });
                                                                setCitySearch({ ...citySearch, origin: city });
                                                                setShowCityDropdown({ ...showCityDropdown, origin: false });
                                                            }}
                                                        >
                                                            {city}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
                                            <MapPin size={14} />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., Mumbai" 
                                            className="w-full bg-[#050505] border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-800"
                                            value={formData.destination || citySearch.destination}
                                            onChange={(e) => {
                                                setCitySearch({ ...citySearch, destination: e.target.value });
                                                setFormData({ ...formData, destination: '' });
                                                setShowCityDropdown({ ...showCityDropdown, destination: true });
                                            }}
                                            onFocus={() => setShowCityDropdown({ ...showCityDropdown, destination: true })}
                                        />
                                        <AnimatePresence>
                                            {showCityDropdown.destination && filterCities(citySearch.destination).length > 0 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-[100] w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                                >
                                                    {filterCities(citySearch.destination).map((city, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className="w-full px-4 py-3 text-left text-xs font-bold text-slate-300 hover:bg-primary/20 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                                            onClick={() => {
                                                                setFormData({ ...formData, destination: city });
                                                                setCitySearch({ ...citySearch, destination: city });
                                                                setShowCityDropdown({ ...showCityDropdown, destination: false });
                                                            }}
                                                        >
                                                            {city}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-600 hover:shadow-glow transition-all flex items-center justify-center gap-2 group">
                                    Analyze Route
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                            
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" onClick={() => navigate('/shipments')}>
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Activity size={14} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Global Risk Heatmaps</p>
                                    <ArrowRight size={14} className="ml-auto" />
                                </div>
                            </div>
                        </section>

                        <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <ShieldCheck className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">System Status: Optimal</p>
                                    <p className="text-[10px] text-slate-400 font-medium">All AI nodes performing at 99.8% capacity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
