import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatureScroll, features } from '@/components/FeatureScroll';

export default function MainApp() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSelectFeature = (feature: typeof features[0]) => {
        // Navigate to the appropriate route based on feature ID
        const routeMap: Record<string, string> = {
            dashboard: '/app/dashboard',
            machines: '/app/machines',
            workers: '/app/workers',
            weather: '/app/weather',
            news_station: '/app/ecoconnect',
        };

        const route = routeMap[feature.id];
        if (route) {
            navigate(route);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-full">
            {/* Scrollable Content */}
            <div className="relative z-20 pt-32 pb-20">
                <FeatureScroll onSelectFeature={handleSelectFeature} containerRef={containerRef} />
            </div>
        </div>
    );
}
