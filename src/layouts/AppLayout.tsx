import { Outlet, useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/AuroraBackground';
import { Header } from '@/components/Header';
import { authService } from '@/services/authService';

export default function AppLayout() {
  const navigate = useNavigate();

  const handleSelectFeature = (feature: any) => {
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

  const handleLogout = () => {
    authService.logout();
    navigate('/auth');
  };

  return (
    <AuroraBackground>
      <div className="relative w-full h-full overflow-y-auto">
        {/* Header */}
        <Header onSelectFeature={handleSelectFeature} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="relative z-20">
          <Outlet />
        </div>
      </div>
    </AuroraBackground>
  );
}
