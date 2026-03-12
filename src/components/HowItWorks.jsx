import React from 'react';
import { motion } from 'framer-motion';
import { Database, BrainCircuit, ShieldCheck } from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations/motionVariants';

const steps = [
    {
        title: 'Data Collection',
        desc: 'We aggregate millions of data points from carriers, weather stations, and IoT sensors.',
        icon: <Database className="w-8 h-8" />,
        color: 'bg-blue-500',
    },
    {
        title: 'AI Risk Prediction',
        desc: 'Our proprietary neural network analyzes patterns to identify potential delay markers.',
        icon: <BrainCircuit className="w-8 h-8" />,
        color: 'bg-indigo-500',
    },
    {
        title: 'Smart Intervention',
        desc: 'Receive automated rerouting suggestions and one-click mitigation strategies.',
        icon: <ShieldCheck className="w-8 h-8" />,
        color: 'bg-primary',
    },
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    variants={staggerContainer(0.2, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mb-20"
                >
                    <motion.h2 variants={fadeIn('up', 0.1)} className="text-4xl font-bold mb-4">How It Works</motion.h2>
                    <motion.p variants={fadeIn('up', 0.2)} className="text-slate-500 max-w-2xl mx-auto">
                        Three simple steps to transition from reactive troubleshooting to proactive logistics.
                    </motion.p>
                </motion.div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

                    <motion.div
                        variants={staggerContainer(0.3, 0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10"
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn('up', 0.1 * index)}
                                className="flex flex-col items-center bg-white p-6"
                            >
                                <div className={`w-20 h-20 ${step.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl relative`}>
                                    {step.icon}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-dark text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed max-w-xs mx-auto text-center">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
