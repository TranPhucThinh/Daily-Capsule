import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CalendarPage } from '../pages/CalendarPage';
import { CapsuleDetailPage } from '../pages/CapsuleDetailPage';
import { MemoriesPage } from '../pages/MemoriesPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TodayPage } from '../pages/TodayPage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <TodayPage /> },
      { path: '/memories', element: <MemoriesPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/capsule/:date', element: <CapsuleDetailPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
