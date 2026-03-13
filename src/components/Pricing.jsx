import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '../animations/motionVariants.js';

const tiers = [
    {
        name: 'Starter',
        price: '$49',
        desc: 'Perfect for small teams tracking regional shipments.',
        features: ['Up to 50 active shipments', '6-hour AI prediction lag', 'Basic weather alerts', 'Email support'],
        highlighted: false,
    },
    {
        name: 'Professional',
        price: '$199',
        desc: 'Advanced insights for global shipping operations.',
        features: ['Unlimited active shipments', 'Real-time 48h predictions', 'Traffic & Port intelligence', 'Priority 24/7 support', 'Smart route optimization'],
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'Customized solutions for large-scale multi-modal logistics.',
        features: ['Dedicated AI models', 'Custom API integrations', 'On-premise deployment', 'Personal account manager', 'SLA guaranteed uptime'],
        highlighted: false,
    },
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 italic text-white">Pricing Plans</h2>
                    <p className="text-slate-400">Transparent pricing built to scale with your logistics volume.</p>
                </div>

                <motion.div
                    variants={staggerContainer(0.2, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={i}
                            variants={fadeIn('up', 0.1 * i)}
                            whileHover={{ y: -10 }}
                            className={`relative p-8 rounded-3xl transition-all duration-300 ${tier.highlighted
                                    ? 'bg-primary/10 text-white shadow-glow scale-105 z-10 border border-primary/30'
                                    : 'bg-white/[0.03] text-white shadow-soft border border-white/10 hover:border-primary/20'
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 gradient-bg px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.price !== 'Custom' && <span className="text-slate-500 text-sm">/month</span>}
                            </div>
                            <p className={`text-sm mb-8 ${tier.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                                {tier.desc}
                            </p>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feat, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-sm font-medium">
                                        <Check className={`w-5 h-5 ${tier.highlighted ? 'text-indigo-400' : 'text-primary'}`} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                to={tier.price === 'Custom' ? '/#contact' : '/signup'}
                                className={`w-full py-5 rounded-2xl font-black transition-all text-center block text-lg hover:scale-105 active:scale-95 hover:shadow-glow ${tier.highlighted
                                    ? 'gradient-bg text-white'
                                    : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                                }`}
                            >
                                {tier.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;
