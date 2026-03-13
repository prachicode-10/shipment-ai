import React from 'react';
import { Shield, Twitter, Linkedin, Github, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background pt-20 pb-10 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Logo & About */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1.5 rounded-lg shadow-glow">
                                <Shield className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                ShipmentGuard <span className="text-primary">AI</span>
                            </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            The world's leading Early Warning System for shipment delays. Empowering logistics teams with predictive intelligence.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">Product</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">Company</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Press Kit</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-4">Get the latest logistics intelligence reports.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-white"
                            />
                            <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/80 transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">
                        © {currentYear} ShipmentGuard AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <div className="flex items-center gap-1 ml-4">
                            Made with <Heart size={12} className="text-red-400 fill-current" /> by Antigravity
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};



export default Footer;
