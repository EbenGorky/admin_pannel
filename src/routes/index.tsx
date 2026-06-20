import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Skeleton } from '@/components/ui'

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

const SplashScreen = lazy(() => import('@/pages/SplashScreen'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const MyTeamPage = lazy(() => import('@/pages/dashboard/MyTeamPage'))
const AttendancePage = lazy(() => import('@/pages/attendance/AttendancePage'))
const EmployeesPage = lazy(() => import('@/pages/employees/EmployeesPage'))
const TeamPage = lazy(() => import('@/pages/team/TeamPage'))
const TasksPage = lazy(() => import('@/pages/tasks/TasksPage'))
const LeavesPage = lazy(() => import('@/pages/leaves/LeavesPage'))
const CRMPage = lazy(() => import('@/pages/crm/CRMPage'))
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))
const PayslipsPage = lazy(() => import('@/pages/payroll/PayslipsPage'))
const PayrollPage = lazy(() => import('@/pages/payroll/PayrollPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyPage Component={SplashScreen} />,
  },
  {
    path: '/login',
    element: <LazyPage Component={LoginPage} />,
  },
  {
    path: '/app',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <LazyPage Component={DashboardPage} /> },
      { path: 'my-team', element: <LazyPage Component={MyTeamPage} /> },
      { path: 'attendance', element: <LazyPage Component={AttendancePage} /> },
      { path: 'team', element: <LazyPage Component={TeamPage} /> },
      { path: 'employees', element: <Navigate to="/app/my-team" replace /> },
      { path: 'employees/:id', element: <LazyPage Component={EmployeesPage} /> },
      { path: 'tasks', element: <LazyPage Component={TasksPage} /> },
      { path: 'tasks/:id', element: <LazyPage Component={TasksPage} /> },
      { path: 'crm', element: <LazyPage Component={CRMPage} /> },
      { path: 'leaves', element: <LazyPage Component={LeavesPage} /> },
      { path: 'reports', element: <LazyPage Component={ReportsPage} /> },
      { path: 'payslips', element: <LazyPage Component={PayslipsPage} /> },
      { path: 'payroll', element: <LazyPage Component={PayrollPage} /> },
      { path: 'analytics', element: <LazyPage Component={AnalyticsPage} /> },
      { path: 'settings', element: <LazyPage Component={SettingsPage} /> },
      { path: '*', element: <LazyPage Component={NotFoundPage} /> },
    ],
  },
])
