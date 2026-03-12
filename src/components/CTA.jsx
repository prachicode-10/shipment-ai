import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn } from '../animations/motionVariants.js';

const CTA = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden gradient-bg rounded-[3rem] p-12 md:p-20 text-center text-white"
                >
                    {/* Decorative shapes */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full translate-x-1/4 translate-y-1/3 blur-3xl"></div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <motion.h2
                            variants={fadeIn('up', 0.1)}
                            className="text-4xl md:text-6xl font-bold leading-tight"
                        >
                            Start Predicting Shipment Delays <span className="text-indigo-200">Before They Happen</span>
                        </motion.h2>
                        <motion.p
                            variants={fadeIn('up', 0.2)}
                            className="text-lg md:text-xl text-indigo-100"
                        >
                            Join 50+ global logistics partners already using ShipmentGuard AI to optimize their supply chains.
                        </motion.p>

                        <motion.div
                            variants={fadeIn('up', 0.3)}
                            className="flex flex-wrap justify-center gap-6 pt-4"
                        >
                            <Link to="/signup" className="px-10 py-5 bg-white text-primary rounded-full text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 group">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-10 py-5 bg-indigo-600/30 border-2 border-white/20 hover:bg-indigo-600/50 rounded-full text-lg font-bold transition-all flex items-center gap-3">
                                <Mail className="w-5 h-5" />
                                Book Demo
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
