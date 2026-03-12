import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Search,
    CloudRain,
    MapPin,
    Bell,
    BarChart3
} from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations/motionVariants.js';

const features = [
    {
        title: 'AI Delay Prediction',
        desc: 'Advanced machine learning models predicting delays before they happen.',
        icon: <Zap className="w-6 h-6" />,
        color: 'bg-blue-500',
    },
    {
        title: 'Real-Time Tracking',
        desc: 'Live telemetry data from global logistics networks.',
        icon: <Search className="w-6 h-6" />,
        color: 'bg-indigo-500',
    },
    {
        title: 'Weather Intelligence',
        desc: 'Deep integration with meteorological data to foresee disruptions.',
        icon: <CloudRain className="w-6 h-6" />,
        color: 'bg-sky-500',
    },
    {
        title: 'Route Optimization',
        desc: 'Smart rerouting suggests faster paths to avoid predicted bottlenecks.',
        icon: <MapPin className="w-6 h-6" />,
        color: 'bg-blue-600',
    },
    {
        title: 'Risk Alerts',
        desc: 'Instant notifications for your team to take proactive measures.',
        icon: <Bell className="w-6 h-6" />,
        color: 'bg-violet-500',
    },
    {
        title: 'AI Recommendations',
        desc: 'Actionable insights on how to mitigate detected shipping risks.',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-blue-400',
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    variants={staggerContainer(0.2, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="text-center mb-16"
                >
                    <motion.p variants={fadeIn('up', 0.1)} className="text-primary font-bold tracking-widest uppercase text-sm mb-3">
                        Core capabilities
                    </motion.p>
                    <motion.h2 variants={fadeIn('up', 0.2)} className="text-4xl md:text-5xl font-bold mb-4">
                        Powerful Features for <span className="gradient-text">Precision Logistics</span>
                    </motion.h2>
                    <motion.p variants={fadeIn('up', 0.3)} className="text-slate-500 max-w-2xl mx-auto">
                        Our platform leverages petabytes of historical data to provide the most accurate shipping foresight in the industry.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={staggerContainer(0.1, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn('up', 0.1 * index)}
                            whileHover={{ y: -10 }}
                            className="glass-card p-8 group transition-all duration-300 hover:shadow-glow/20"
                        >
                            <div className={`w-14 h-14 ${feature.color} text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
