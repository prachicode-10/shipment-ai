import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '../animations/motionVariants.js';
import { SplineScene } from "./ui/splite";
import { Spotlight } from "./ui/spotlight";

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
                    <div className="flex flex-col space-y-8 z-20">
                        <motion.div variants={fadeIn('up', 0.1)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold max-w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Next-Gen Logistics Intelligence
                        </motion.div>

                        <motion.h1
                            variants={fadeIn('up', 0.2)}
                            className="text-6xl md:text-8xl font-black leading-tight tracking-tighter"
                        >
                            Predictive <br />
                            <span className="premium-gradient-text">Global Logistics</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn('up', 0.3)}
                            className="text-xl text-slate-400 max-w-xl leading-relaxed"
                        >
                            Harness the power of AI to anticipate disruptions and optimize your supply chain with 3D immersive monitoring. Experience logistics in high definition.
                        </motion.p>

                        <motion.div
                            variants={fadeIn('up', 0.4)}
                            className="flex flex-wrap gap-4 pt-8"
                        >
                            <Link to="/signup" className="flex items-center gap-3 px-10 py-5 gradient-bg rounded-full text-xl font-black text-white hover:shadow-glow hover:scale-105 active:scale-95 transition-all group">
                                Get Started
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/dashboard" className="flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xl font-bold text-white hover:border-primary hover:bg-white/20 hover:scale-105 active:scale-95 transition-all group">
                                View Demo
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Visuals - Adjusted to 'medium' scale */}
                    <div className="relative h-[600px] md:h-[700px] flex items-center justify-center rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl scale-100 lg:scale-110 transition-transform duration-700">
                        <Spotlight
                            className="-top-40 left-0 md:left-20 md:-top-20 scale-125"
                            fill="white"
                        />
                        <SplineScene 
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
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
