import React from 'react';
import { motion } from 'framer-motion';
import { CloudOff, Truck, Anchor, AlertCircle, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '../animations/motionVariants.js';

const insights = [
    {
        title: 'Port Congestion',
        value: 'Extreme',
        sub: 'Los Angeles Terminal 4',
        icon: <Anchor />,
        status: 'at risk',
        color: 'text-red-500',
        bg: 'bg-red-50',
    },
    {
        title: 'Predicted Delay',
        value: '+4.2 hrs',
        sub: 'Route: SHA → LAX',
        icon: <Clock />,
        status: 'high risk',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
    },
    {
        title: 'Weather Disruption',
        value: 'Storm Warning',
        sub: 'South China Sea',
        icon: <CloudOff />,
        status: 'monitored',
        color: 'text-indigo-500',
        bg: 'bg-indigo-50',
    },
    {
        title: 'Traffic Incidents',
        value: 'Major Delay',
        sub: 'I-95 Northbound',
        icon: <Truck />,
        status: 'rerouting',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
    },
];



const AIInsights = () => {
    return (
        <section id="insights" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Deep AI <br /><span className="text-primary premium-gradient-text">Logistics Insights</span></h2>
                        <p className="text-slate-400">Live signals processed by our AI to give you an advantage in supply chain management.</p>
                    </motion.div>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-primary font-bold transition-all hover:gap-4 hover:shadow-glow px-4 py-2 rounded-lg bg-primary/5 border border-primary/10"
                    >
                        View Live Intelligence <ChevronRight size={20} />
                    </Link>
                </div>

                <motion.div
                    variants={staggerContainer(0.1, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {insights.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeIn('up', 0.1 * i)}
                            whileHover={{ y: -10 }}
                            className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 cursor-pointer relative group overflow-hidden transition-all hover:border-primary/30"
                        >
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-3">{item.title}</h3>
                            <p className="text-3xl font-black text-white mb-2 tabular-nums">{item.value}</p>
                            <p className="text-sm text-slate-400 mb-8 border-l-2 border-primary/20 pl-4">{item.sub}</p>

                            <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.bg} ${item.color} border border-current opacity-60 group-hover:opacity-100 transition-opacity`}>
                                {item.status}
                            </div>

                            {/* Hover detail reveal premium */}
                            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center px-8">
                                <p className="text-white/60 text-[10px] font-black mb-3 uppercase tracking-tighter">AI CONFIDENCE INDEX</p>
                                <p className="text-white text-5xl font-black mb-6 italic tracking-tighter">98.4%</p>
                                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden shadow-inner">
                                    <div className="w-[98%] h-full bg-white shadow-[0_0_10px_white]"></div>
                                </div>
                                <p className="text-white/80 text-[10px] font-bold mt-8 flex items-center gap-2 uppercase tracking-wide">
                                    Analyze Mitigation <ArrowRight size={14} />
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AIInsights;
