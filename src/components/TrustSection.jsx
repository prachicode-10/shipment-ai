import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const TrustSection = () => {
    const stats = [
        { label: 'Shipments monitored', value: 10000, suffix: '+' },
        { label: 'Prediction accuracy', value: 92, suffix: '%' },
        { label: 'Logistics partners', value: 50, suffix: '+' },
        { label: 'Active tracking', value: 24, suffix: '/7' },
    ];

    return (
        <section className="py-20 border-y border-white/5 bg-background">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <StatItem key={index} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ stat, index }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const stepTime = Math.max(10, Math.abs(Math.floor(duration / end)));

        if (end === 0) return;

        const timer = setInterval(() => {
            setCount(prev => {
                const next = prev + Math.ceil(end / (duration / 10)); // Increment by more than 1 if end is large
                if (next >= end) {
                    clearInterval(timer);
                    return end;
                }
                return next;
            });
        }, 10);

        return () => clearInterval(timer);
    }, [stat.value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center group"
        >
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                {count}
                <span className="text-primary">{stat.suffix}</span>
            </h3>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
        </motion.div>
    );
};

export default TrustSection;
