import { AuroraBackground } from "@/components/AuroraBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { GlareCard } from "@/components/GlareCard";
import { useLanguage } from "@/i18n/LanguageContext";


const FeatureCard = ({ title, image, onClick }: { title: string; image: string | null; onClick: () => void }) => {
    return (
        <div onClick={onClick} className="cursor-pointer pointer-events-auto">
            <GlareCard className={image ? "bg-cover bg-center" : ""}>
                {image && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-90"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                )}
                <div className="h-full flex items-center justify-center p-4 relative z-10">
                    <h3 className="text-xl font-bold text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {title}
                    </h3>
                </div>
            </GlareCard>
        </div>
    );
};

export default function Auth() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Define features with translations
    const features = [
        {
            id: 'mlAnalysis',
            title: t.featureCards.mlAnalysis.title,
            description: t.featureCards.mlAnalysis.description,
            image: "/images/features/ml-analysis.jpg"
        },

        {
            id: 'weather',
            title: t.featureCards.weather.title,
            description: t.featureCards.weather.description,
            image: "/images/features/weather.jpg"
        },
        {
            id: 'ecoconnect',
            title: t.featureCards.ecoconnect.title,
            description: t.featureCards.ecoconnect.description,
            image: "/images/features/ecoconnect.jpg"
        },
        {
            id: 'analytics',
            title: t.featureCards.analytics.title,
            description: t.featureCards.analytics.description,
            image: "/images/features/analytics.jpg"
        },
        {
            id: 'machinery',
            title: t.featureCards.machinery.title,
            description: t.featureCards.machinery.description,
            image: "/images/features/machinery.jpg"
        },
    ];

    const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Check if user is already authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                const isValid = await authService.verifyToken();
                if (isValid) {
                    navigate('/app', { replace: true });
                }
            }
            setIsCheckingAuth(false);
        };
        checkAuth();
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let response;

            if (authMode === 'register') {
                response = await authService.register(
                    formData.fullName,
                    formData.email,
                    formData.password,
                    formData.confirmPassword
                );
            } else {
                response = await authService.login(
                    formData.email,
                    formData.password,
                    rememberMe
                );
            }

            if (response.success) {
                // Navigate to app after successful login/register
                navigate('/app', { replace: true });
                // Clear form data
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <AuroraBackground>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl">Loading...</div>
                </div>
            </AuroraBackground>
        );
    }

    const handleLogout = async () => {
        await authService.logout();
        navigate('/auth', { replace: true });
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    // Don't show the auth page if user is authenticated (they'll be redirected)
    if (isAuthenticated) {
        return null;
    }

    return (
        <AuroraBackground>
            <div className="absolute top-12 left-0 right-0 z-20 flex flex-col items-center px-8 max-w-5xl mx-auto text-center">
                <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4 tracking-tight">
                    {"EcoPick".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </h1>
                <motion.div
                    className="h-1 w-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 mb-6 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                ></motion.div>
                {!selectedFeature && !authMode && (
                    <motion.h2
                        className="text-4xl md:text-5xl font-light mb-8 tracking-wide bg-gradient-to-r from-orange-500 via-white to-green-500 text-transparent bg-clip-text"
                        style={{ fontFamily: "'Pinyon Script', cursive" }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }}
                        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                    >
                        <span></span>कपास तोड़ने का भविष्य<span></span>
                    </motion.h2>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!selectedFeature && !authMode ? (
                    <motion.div
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                        transition={{ duration: 0.4, delay: 1.3, ease: "easeOut" }}
                        className="contents"
                    >
                        {/* Scrolling Billboard */}
                        <motion.div
                            className="absolute top-[42%] -translate-y-1/2 left-0 right-0 z-15 overflow-hidden py-4 group pointer-events-none"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }}
                            transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
                        >
                            <div className="flex animate-scroll-left w-max gap-16 group-hover:[animation-play-state:paused]">
                                {[...features, ...features].map((feature, index) => (
                                    <FeatureCard
                                        key={index}
                                        title={feature.title}
                                        image={feature.image}
                                        onClick={() => setSelectedFeature(feature)}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-24 left-0 right-0 z-10 flex flex-col items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } }}
                            transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
                        >
                            <h3 className="text-2xl font-semibold text-white mb-2">Unlock EcoPick</h3>
                            <div className="flex justify-center gap-8">
                                <button
                                    onClick={() => setAuthMode('login')}
                                    className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-12 px-8 inline-flex"
                                >
                                    <div className="flex items-center">
                                        <span className="ml-1 text-black dark:text-white lg:inline p-1 font-bold text-lg">Login</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setAuthMode('register')}
                                    className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-12 px-8 inline-flex"
                                >
                                    <div className="flex items-center">
                                        <span className="ml-1 text-black dark:text-white lg:inline p-1 font-bold text-lg">Register</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : authMode ? (
                    <motion.div
                        key={`auth-${authMode}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="absolute inset-0 flex items-center justify-center z-30"
                    >
                        <div className="relative max-w-md w-full mx-4">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            />
                            <motion.div
                                className="relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 shadow-2xl"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                            >
                                <motion.h3
                                    className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.45 }}
                                >
                                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </motion.h3>

                                {error && (
                                    <motion.div
                                        className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <motion.form
                                    className="space-y-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.55 }}
                                    onSubmit={handleAuth}
                                >
                                    {authMode === 'register' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.6 }}
                                        >
                                            <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: authMode === 'register' ? 0.65 : 0.6 }}
                                    >
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: authMode === 'register' ? 0.7 : 0.65 }}
                                    >
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </motion.div>

                                    {authMode === 'register' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.75 }}
                                        >
                                            <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </motion.div>
                                    )}

                                    {authMode === 'login' && (
                                        <motion.div
                                            className="flex items-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 0.7 }}
                                        >
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 bg-zinc-800 border-zinc-600 rounded text-cyan-500 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                                            />
                                            <label htmlFor="remember" className="ml-2 text-sm text-zinc-400 cursor-pointer">Remember me</label>
                                        </motion.div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: authMode === 'register' ? 0.8 : 0.75 }}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                    >
                                        {loading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                                    </motion.button>
                                </motion.form>

                                <motion.button
                                    onClick={() => setAuthMode(null)}
                                    className="mt-6 w-full py-2 text-zinc-400 hover:text-white font-medium transition-colors"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: authMode === 'register' ? 0.85 : 0.8 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    Back to Home
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : selectedFeature ? (
                    <motion.div
                        key="feature-detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFeature(null)}
                        />
                        <motion.div
                            layoutId={`card-${selectedFeature.id}`}
                            className="relative w-full max-w-5xl bg-zinc-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh]"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Decorative Background Glow */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                            {/* Image Section */}
                            <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10 md:bg-gradient-to-r" />
                                <motion.img
                                    src={selectedFeature.image}
                                    alt={selectedFeature.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                />
                                {/* Title Overlay on Image for Mobile */}
                                <div className="absolute bottom-4 left-4 z-20 md:hidden">
                                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{selectedFeature.title}</h3>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="relative p-6 md:p-10 flex flex-col justify-center md:w-1/2 z-20 overflow-y-auto">
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                </button>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="hidden md:block mb-2">
                                        <span className="px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                                            FEATURE SPOTLIGHT
                                        </span>
                                    </div>

                                    <h2 className="hidden md:block text-4xl md:text-5xl font-black text-white mb-6 leading-tight bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent">
                                        {selectedFeature.title}
                                    </h2>

                                    <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-6" />

                                    <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                                        {selectedFeature.description}
                                    </p>

                                    <div className="flex gap-4">
                                        <motion.button
                                            onClick={() => setSelectedFeature(null)}
                                            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Explore
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setSelectedFeature(null)}
                                            className="px-8 py-3 bg-transparent border border-zinc-700 text-zinc-300 font-bold rounded-lg hover:bg-zinc-800 transition-all"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Close
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </AuroraBackground>
    );
}
