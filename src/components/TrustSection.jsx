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
        <section className="py-20 border-y border-slate-100 bg-white">
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
        const stepTime = Math.abs(Math.floor(duration / end));

        if (end === 0) return;

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [stat.value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
        >
            <h3 className="text-4xl md:text-5xl font-bold text-dark mb-2">
                {count}
                <span className="text-primary">{stat.suffix}</span>
            </h3>
            <p className="text-slate-500 font-medium">{stat.label}</p>
        </motion.div>
    );
};

export default TrustSection;
