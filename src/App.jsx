import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import DashboardOverview from './components/hr/DashboardOverview';
import StaffManagement from './components/hr/StaffManagement';
import VarianceReport from './components/hr/VarianceReport';
import ClientManagement from './components/hr/ClientManagement';
import StaffAuth from './components/Staff/StaffAuth';
import StaffDashboard from './components/Staff/StaffDashboard';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* HR Admin Routes */}
      <Route 
        path="/auth" 
        element={currentUser ? <Navigate to="/hr" /> : <AuthPage />} 
      />
      <Route 
        path="/hr" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="variance" element={<VarianceReport />} />
        <Route path="clients" element={<ClientManagement />} />
      </Route>

      {/* Staff Routes */}
      <Route 
        path="/staff" 
        element={<Navigate to="/staff/login" />} 
      />
      <Route 
        path="/staff/login" 
        element={<StaffAuth />} 
      />
      <Route 
        path="/staff/dashboard" 
        element={<StaffDashboard />} 
      />

      {/* Landing Page */}
      <Route 
        path="/" 
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8 p-8">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Variance Tracker
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Staffing & Time Management System
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HR Admin Portal */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">HR Admin Portal</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage staff, view timesheets, track variance, and handle client billing
                    </p>
                    <a
                      href="/hr"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Access HR Portal
                    </a>
                  </div>
                </div>

                {/* Staff Portal */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Portal</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Clock in/out, track hours, view assignments, and manage timesheets
                    </p>
                    <a
                      href="/staff/login"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Access Staff Portal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
