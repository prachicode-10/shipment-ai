import React, { useState, useEffect } from 'react';
// All imports standardized for resolution.
import { motion } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const checkUser = () => {
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) setUser(JSON.parse(storedUser));
                else setUser(null);
            } catch (error) {
                console.error("Navbar session parse error", error);
                setUser(null);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        checkUser();
        // Check for user changes periodically or on storage event
        window.addEventListener('storage', checkUser);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkUser);
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/#features' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'AI Insights', href: '/#insights' },
        { name: 'Pricing', href: '/#pricing' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-3 shadow-soft' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-dark">
                        ShipmentGuard <span className="text-primary">AI</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.href} className="nav-link">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <Link to="/dashboard" className="px-6 py-2 text-sm font-bold gradient-bg text-white rounded-full hover:shadow-glow transition-all text-center">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="px-5 py-2 text-sm font-semibold border-2 border-primary/20 text-primary rounded-full hover:bg-primary/5 transition-all text-center">
                                Login
                            </Link>
                            <Link to="/signup" className="px-5 py-2 text-sm font-semibold gradient-bg rounded-full hover:shadow-glow transition-all text-center">
                                Sign Up Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-dark" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 flex flex-col gap-4"
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-dark hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link 
                            to="/login" 
                            className="w-full py-3 text-center font-semibold border-2 border-primary/20 text-primary rounded-xl"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/signup" 
                            className="w-full py-3 text-center font-semibold gradient-bg rounded-xl"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign Up Free
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
