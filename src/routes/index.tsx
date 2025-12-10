import { createBrowserRouter, Navigate } from 'react-router-dom';
import Auth from '@/views/auth/Auth';
import MainApp from '@/views/app/MainApp';
import DashboardPage from '@/views/app/pages/DashboardPage';
import { MachinesPage } from '@/views/app/pages/MachinesPage';
import { WorkersPage } from '@/views/app/pages/WorkersPage';
import { WeatherPage } from '@/views/app/pages/WeatherPage';
import { EcoConnectPage } from '@/views/app/pages/EcoConnectPage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '@/layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <MainApp />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'machines',
        element: <MachinesPage />,
      },
      {
        path: 'workers',
        element: <WorkersPage />,
      },
      {
        path: 'weather',
        element: <WeatherPage />,
      },
      {
        path: 'ecoconnect',
        element: <EcoConnectPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth" replace />,
  },
]);
