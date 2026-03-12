import React from 'react';
import { motion } from 'framer-motion';
import { CloudOff, Truck, Anchor, AlertCircle, ChevronRight, Clock } from 'lucide-react';
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
                        <h2 className="text-4xl font-bold mb-4">Deep AI <span className="text-primary">Logistics Insights</span></h2>
                        <p className="text-slate-500">Live signals processed by our AI to give you an unfair advantage in supply chain management.</p>
                    </motion.div>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-primary font-bold transition-all hover:gap-3"
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
                            whileHover={{ scale: 1.02 }}
                            className="glass-card p-6 cursor-pointer relative group overflow-hidden"
                        >
                            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                                {item.icon}
                            </div>
                            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                            <p className="text-2xl font-bold text-dark mb-1">{item.value}</p>
                            <p className="text-sm text-slate-400 mb-6">{item.sub}</p>

                            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${item.bg} ${item.color} border border-current opacity-70`}>
                                {item.status}
                            </div>

                            {/* Hover detail reveal simulated */}
                            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-6 flex flex-col justify-center">
                                <p className="text-white/70 text-xs font-bold mb-2 uppercase">AI Confidence</p>
                                <p className="text-white text-3xl font-bold mb-4">98.4%</p>
                                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="w-[98%] h-full bg-white"></div>
                                </div>
                                <p className="text-white/80 text-sm mt-4">Click to view full mitigation analysis.</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AIInsights;
