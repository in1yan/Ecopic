import { motion } from "framer-motion";
import { features } from "@/components/FeatureScroll";
import DashboardPage from "./pages/DashboardPage";
import { MachinesPage } from "./pages/MachinesPage";
import { WorkersPage } from "./pages/WorkersPage";

import { WeatherPage } from "./pages/WeatherPage";
import { EcoConnectPage } from "./pages/EcoConnectPage";

export const FeatureDetail = ({ feature, onClose }: { feature: typeof features[0], onClose: () => void }) => {
    // Render the appropriate page component based on feature ID
    const renderPageContent = () => {
        switch (feature.id) {
            case 'dashboard':
                return <DashboardPage />;
            case 'machines':
                return <MachinesPage onNavigate={onClose} />;
            case 'workers':
                return <WorkersPage onNavigate={onClose} />;

            case 'weather':
                return <WeatherPage onNavigate={onClose} />;
            case 'news_station':
                return <EcoConnectPage onNavigate={onClose} />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between p-8 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-4">
                    <span className="text-4xl">{feature.icon}</span>
                    <h2 className="text-3xl font-bold text-white font-['Orbitron']">{feature.title}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                    Close
                </button>
            </div>

            {/* Page Content */}
            {renderPageContent()}
        </motion.div>
    );
};

export default FeatureDetail;
