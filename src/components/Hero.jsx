import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '../animations/motionVariants.js';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
            {/* Background blobs for aesthetics */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-secondary-start/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.div
                    variants={staggerContainer(0.2, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                    {/* Left Content */}
                    <div className="flex flex-col space-y-8 z-10">
                        <motion.div variants={fadeIn('up', 0.1)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold max-w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            AI-Powered Logistics Analysis
                        </motion.div>

                        <motion.h1
                            variants={fadeIn('up', 0.2)}
                            className="text-5xl md:text-7xl font-bold leading-tight"
                        >
                            AI-Based Early Warning System for <span className="gradient-text">Shipment Delays</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn('up', 0.3)}
                            className="text-lg text-slate-600 max-w-xl leading-relaxed"
                        >
                            Predict shipment risks 48–72 hours in advance using AI models analyzing logistics signals such as weather, traffic, and global disruptions.
                        </motion.p>

                        <motion.div
                            variants={fadeIn('up', 0.4)}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Link to="/login" className="flex items-center gap-2 px-8 py-4 gradient-bg rounded-full text-lg font-bold hover:shadow-glow transition-all group">
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 rounded-full text-lg font-bold hover:border-primary transition-all group">
                                <div className="p-1.5 bg-slate-100 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Play className="w-4 h-4 fill-current" />
                                </div>
                                View Demo
                            </Link>
                        </motion.div>

                        {/* Micro stats */}
                        <motion.div
                            variants={fadeIn('up', 0.5)}
                            className="flex items-center gap-8 pt-6 border-t border-slate-100"
                        >
                            <div>
                                <p className="text-2xl font-bold">10K+</p>
                                <p className="text-sm text-slate-500">Active Shipments</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">92%</p>
                                <p className="text-sm text-slate-500">Risk Accuracy</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visuals */}
                    <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
                        {/* Animated Map Simulation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="relative w-full h-full max-w-[500px] max-h-[500px]">
                                {/* Central Hub */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-2xl shadow-xl border border-primary/20 z-10 animate-float">
                                    <Globe className="w-12 h-12 text-primary" />
                                </div>

                                {/* Pulsing Nodes */}
                                <Node x="20%" y="30%" delay={0} />
                                <Node x="80%" y="20%" delay={0.5} />
                                <Node x="70%" y="70%" delay={1} />
                                <Node x="30%" y="80%" delay={1.5} />

                                {/* Connection Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                    <path d="M 20% 30% Q 50% 10% 80% 20%" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                                    <path d="M 80% 20% Q 90% 50% 70% 70%" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                                    <path d="M 70% 70% Q 50% 90% 30% 80%" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                                    <path d="M 30% 80% Q 10% 50% 20% 30%" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />

                                    <defs>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#2563EB" />
                                            <stop offset="100%" stopColor="#6366F1" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </motion.div>

                        {/* Floating Info Cards */}
                        <motion.div
                            variants={fadeIn('left', 0.6)}
                            className="absolute top-1/4 right-0 glass-card p-4 flex gap-3 items-center animate-float"
                            style={{ animationDelay: '1s' }}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">RISK STATUS</p>
                                <p className="text-sm font-bold">SECURE</p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeIn('right', 0.8)}
                            className="absolute bottom-1/4 left-0 glass-card p-4 flex gap-3 items-center animate-float shadow-glow"
                        >
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <span className="font-bold text-xs">!</span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">DELAY PREDICTED</p>
                                <p className="text-sm font-bold">+2.4 Hrs</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      ` }} />
        </section>
    );
};

const Node = ({ x, y, delay }) => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="absolute w-4 h-4 rounded-full bg-primary"
        style={{ left: x, top: y }}
    >
        <div className="absolute inset-0 w-full h-full rounded-full bg-primary animate-ping opacity-40"></div>
    </motion.div>
);

export default Hero;
