import { useState } from 'react';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import { LogOut, Languages } from 'lucide-react';
import { features } from './FeatureScroll';
import { useLanguage } from '@/i18n/LanguageContext';

interface HeaderProps {
    onSelectFeature?: (feature: typeof features[0]) => void;
    onLogout?: () => void;
}

export const Header = ({ onSelectFeature, onLogout }: HeaderProps) => {
    const [active, setActive] = useState(false);
    const [langActive, setLangActive] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="absolute top-0 left-0 right-0 z-50 flex justify-end items-center p-8 pointer-events-none">
            {/* Title Group - Centered */}
            <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight leading-tight">
                    EcoPick
                </h1>
                {/* Gradient Underline */}
                <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full mt-2 mb-3" />

                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-white to-green-500 text-transparent bg-clip-text leading-tight">
                    Made farm management easier
                </p>
            </div>

            {/* Language and Menu Buttons - Right Side */}
            <div className="pointer-events-auto relative flex gap-4">
                {/* Language Button */}
                <div className="relative">
                    <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
                        <button
                            onClick={() => setLangActive((pv) => !pv)}
                            className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-12 px-8 inline-flex"
                        >
                            <div className="flex items-center gap-2">
                                <Languages className="w-5 h-5 text-black dark:text-white" />
                                <span className="text-black dark:text-white font-bold text-lg">
                                    {langActive ? t.close : t.language}
                                </span>
                            </div>
                        </button>
                    </MotionConfig>

                    <AnimatePresence>
                        {langActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="absolute top-full right-0 mt-6 w-48 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-2 z-50"
                            >
                                <div className="flex flex-col gap-1">
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        onClick={() => {
                                            setLanguage('en');
                                            setLangActive(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-4 group relative overflow-hidden ${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-bold text-base">
                                                English
                                            </div>
                                        </div>
                                        {language === 'en' && (
                                            <div className="text-green-400">✓</div>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                        onClick={() => {
                                            setLanguage('hi');
                                            setLangActive(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-4 group relative overflow-hidden ${language === 'hi' ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-bold text-base">
                                                हिंदी (Hindi)
                                            </div>
                                        </div>
                                        {language === 'hi' && (
                                            <div className="text-green-400">✓</div>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Menu Button */}
                <div className="relative">
                    <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
                        <button
                            onClick={() => setActive((pv) => !pv)}
                            className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-12 px-8 inline-flex"
                        >
                            <div className="flex items-center">
                                <span className="ml-1 text-black dark:text-white lg:inline p-1 font-bold text-lg">
                                    {active ? t.close : t.menu}
                                </span>
                            </div>
                        </button>
                    </MotionConfig>

                    <AnimatePresence>
                        {active && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="absolute top-full right-0 mt-6 w-80 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-2 z-50"
                            >
                                <div className="flex flex-col gap-1">
                                    {features.map((feature, index) => {
                                        // Helper to safely access translations
                                        const featureKey = feature.id as keyof typeof t.features;
                                        const featureTitle = t.features[featureKey]?.title || feature.title;
                                        const featureSubtitle = t.features[featureKey]?.subtitle || feature.subtitle;

                                        return (
                                            <motion.button
                                                key={feature.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 + 0.1 }}
                                                onClick={() => {
                                                    onSelectFeature?.(feature);
                                                    setActive(false);
                                                }}
                                                className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-4 group relative overflow-hidden"
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                                <span className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                                    {feature.icon}
                                                </span>

                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white font-bold text-base group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                                                        {featureTitle}
                                                    </div>
                                                    <div className="text-zinc-500 text-xs truncate group-hover:text-zinc-400 transition-colors">
                                                        {featureSubtitle}
                                                    </div>
                                                </div>

                                                <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-white/50">
                                                    →
                                                </div>
                                            </motion.button>
                                        )
                                    })}

                                    {/* Separator */}
                                    <div className="h-px bg-white/10 my-2" />

                                    {/* Logout Button */}
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: features.length * 0.05 + 0.15 }}
                                        onClick={() => {
                                            onLogout?.();
                                            setActive(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-500/20 transition-all duration-300 flex items-center gap-4 group relative overflow-hidden border border-transparent hover:border-red-500/30"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                                        <LogOut className="w-6 h-6 text-red-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />

                                        <div className="flex-1 min-w-0">
                                            <div className="text-red-400 font-bold text-base group-hover:text-red-300 transition-all">
                                                {t.logout}
                                            </div>
                                            <div className="text-zinc-500 text-xs group-hover:text-zinc-400 transition-colors">
                                                {t.logoutSubtitle}
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-red-400/50">
                                            →
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};
