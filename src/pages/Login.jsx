import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Chrome, Github, ArrowRight, Mail, Lock, User, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fadeIn } from '../animations/motionVariants.js';

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const otpInputs = useRef([]);

    useEffect(() => {
        let interval = null;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrorMessage('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        console.log("[DEBUG] Validating login for:", formData.email);

        // Validate credentials against localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email.trim().toLowerCase() === formData.email.trim().toLowerCase() && u.password === formData.password);

        if (user) {
            console.log("[DEBUG] Credentials valid. Requesting 2FA OTP for:", formData.email);
            try {
                const response = await fetch('http://127.0.0.1:5000/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email.trim() })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("[DEBUG] 2FA OTP sent successfully");
                    setGeneratedOtp(data.otp);
                    setIsLoading(false);
                    setStep(2);
                    setIsTimerActive(true);
                    setTimer(60);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                } else {
                    throw new Error(data.error || 'Failed to send 2FA code');
                }
            } catch (error) {
                setIsLoading(false);
                console.error("[DEBUG] 2FA API Error:", error);
                setErrorMessage(error.message);
            }
        } else {
            setIsLoading(false);
            console.warn("[DEBUG] Login failed: Invalid credentials");
            setErrorMessage('Invalid email or password');
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) otpInputs.current[index + 1].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = () => {
        const fullOtp = otp.join('');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (fullOtp === generatedOtp) {
                setStatus('success');
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus(null), 2000);
            }
        }, 1000);
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email.trim() })
            });
            const data = await response.json();
            if (response.ok) {
                setGeneratedOtp(data.otp);
                setTimer(60);
                setIsTimerActive(true);
                setOtp(['', '', '', '', '', '']);
                setIsLoading(false);
            }
        } catch {
            setIsLoading(false);
            alert("Failed to resend code");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden animate-gradient bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-900">
            {/* Background Animated Gradient Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 animate-pulse" />

            <motion.div
                variants={fadeIn('up', 0.1)}
                initial="hidden"
                animate="show"
                className="lighting-border w-full max-w-md p-8 md:p-10 z-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-white/5 border border-white/10 relative overflow-hidden"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-glow">
                            <Shield className="text-white w-6 h-6 flex-shrink-0" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            ShipmentGuard <span className="text-primary">AI</span>
                        </span>
                    </Link>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="h1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <h2 className="text-3xl font-bold mb-2 text-white">Login to continue</h2>
                                <p className="text-slate-400">Welcome back! Please enter your details</p>
                            </motion.div>
                        ) : (
                            <motion.div key="h2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <h2 className="text-3xl font-bold mb-2 text-white">2FA Verification</h2>
                                <p className="text-slate-400">Security code sent to your registered email</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            {/* Social Login */}
                            <div className="flex gap-4 mb-8">
                                <button className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300 group">
                                    <Chrome className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline text-sm text-slate-300">Google</span>
                                </button>
                                <button className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300 group">
                                    <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline text-sm text-slate-300">GitHub</span>
                                </button>
                            </div>

                            <div className="relative mb-8 text-center text-sm">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <span className="bg-slate-900 px-4 text-slate-500 relative z-10 font-bold uppercase tracking-widest text-[10px]">Or use email</span>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                {errorMessage && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center animate-pulse">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        className="peer w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-transparent"
                                    />
                                    <label htmlFor="email" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-slate-950 peer-focus:px-2 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-slate-950 peer-[:not(:placeholder-shown)]:px-2">Email Address</label>
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 peer-focus:text-primary transition-colors pointer-events-none" size={18} />
                                </div>

                                <div className="relative group">
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        className="peer w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-transparent"
                                    />
                                    <label htmlFor="password" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm transition-all pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-slate-950 peer-focus:px-2 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-slate-950 peer-[:not(:placeholder-shown)]:px-2">Password</label>
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 peer-focus:text-primary transition-colors pointer-events-none" size={18} />
                                </div>

                                <button disabled={isLoading} className="w-full py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-glow transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
                                    {isLoading ? <RefreshCw className="animate-spin" /> : <>Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (otpInputs.current[idx] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <div className="text-center">
                                <p className="text-slate-400 text-sm mb-4">Resend code in <span className="text-primary font-mono">{timer}s</span></p>
                                <button
                                    onClick={handleResendOtp}
                                    disabled={timer > 0 || isLoading}
                                    className={`text-sm font-bold transition-colors ${timer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-primary hover:text-blue-400'}`}
                                >
                                    Didn't receive the code? Resend
                                </button>
                            </div>

                            <button onClick={handleVerifyOtp} disabled={isLoading || otp.includes('')} className="w-full py-4 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-glow transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                                {isLoading ? <RefreshCw className="animate-spin" /> : "Verify & Authorize"}
                            </button>

                            <button onClick={() => setStep(1)} className="w-full text-slate-500 text-sm hover:text-slate-300 transition-colors italic">← Back to login</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {status && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 p-8 flex flex-col items-center justify-center backdrop-blur-2xl z-20 ${status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            {status === 'success' ? (
                                <>
                                    <CheckCircle2 className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
                                    <h3 className="text-2xl font-bold text-white">Authorized!</h3>
                                    <p className="text-green-400">Accessing dashboard...</p>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="text-red-500 w-16 h-16 mb-4 animate-shake" />
                                    <h3 className="text-2xl font-bold text-white">Access Denied</h3>
                                    <p className="text-red-400">Invalid security code</p>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mt-8 space-y-2">
                    <p className="text-slate-500 text-sm font-medium">Don't have an account? {' '}<Link to="/signup" className="text-primary font-bold hover:text-blue-400 transition-colors">Register</Link></p>
                    <a href="#" className="block text-xs text-slate-600 hover:text-slate-400 transition-colors italic">Forgot your security key?</a>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
