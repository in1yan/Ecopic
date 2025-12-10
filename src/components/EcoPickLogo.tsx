import { motion } from 'framer-motion';

export const EcoPickLogo = ({ className = "w-24 h-24" }: { className?: string; animate?: boolean }) => {
    return (
        <div className={`relative ${className} flex items-center justify-center`}>
            {/* Main Container SVG */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                    <linearGradient id="cottonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                    <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Tech Ring / Halo */}
                <motion.path
                    d="M50 10 A 40 40 0 0 1 90 50"
                    stroke="url(#techGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="90" cy="50" r="3" fill="#3b82f6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.3 }}
                />

                {/* Leaf Shape (Base) */}
                <motion.path
                    d="M50 85 C50 85 20 75 20 50 C20 25 50 15 50 15 C50 15 80 25 80 50 C80 75 50 85 50 85 Z"
                    fill="url(#leafGradient)"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                />

                {/* Cotton Boll inner representation (Abstract white circles) */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <circle cx="50" cy="50" r="12" fill="url(#cottonGradient)" />
                    <circle cx="38" cy="42" r="10" fill="url(#cottonGradient)" opacity="0.9" />
                    <circle cx="62" cy="42" r="10" fill="url(#cottonGradient)" opacity="0.9" />
                    <circle cx="50" cy="32" r="10" fill="url(#cottonGradient)" opacity="0.9" />
                </motion.g>

                {/* Tech Circuit Node connecting to leaf */}
                <motion.path
                    d="M50 85 L50 65"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                />
                <motion.circle
                    cx="50" cy="65" r="2" fill="#fff"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 }}
                />

            </svg>
        </div>
    );
};
