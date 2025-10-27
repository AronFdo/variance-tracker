import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase/auth';
import { useState } from 'react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`w-64 bg-white border-r fixed md:static inset-y-0 z-40 transform md:transform-none transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:flex md:flex-col`}>
          <div className="h-16 flex items-center px-6 border-b">
            <span className="text-lg font-semibold text-red-700">HR Admin</span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {[{to:'',label:'Overview'},{to:'staff',label:'Staff Management'},{to:'variance',label:'Variance Report'},{to:'clients',label:'Client Management'}].map(link => (
              <NavLink key={link.to || 'root'} to={link.to} end={link.to === ''} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'text-gray-800 hover:bg-gray-100'}`}>
                <span className="h-1.5 w-1.5 rounded-full ${isActive ? 'bg-red-600' : 'bg-transparent group-hover:bg-gray-300'}"></span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-16 bg-white/90 backdrop-blur border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3 md:hidden">
              <button aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <span className="text-lg font-semibold text-red-700">HR Admin</span>
            </div>
            <div className="hidden md:flex items-center gap-3 ml-2 flex-1 max-w-md">
              <div className="relative w-full">
                <input placeholder="Search..." className="w-full rounded-md border px-3 py-2 pl-8 text-sm" />
                <span className="absolute left-2 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.857 17.082A23.848 23.848 0 0 1 12 17c-2.039 0-4.017.243-5.857.707m8.714 0A4.501 4.501 0 0 1 7.5 21m7.357-3.918A8.967 8.967 0 0 0 18 12.75V11a6 6 0 1 0-12 0v1.75a8.967 8.967 0 0 0 2.143 5.332"/></svg>
              </button>
              <div className="text-sm text-gray-600">
                {currentUser?.displayName || currentUser?.email}
              </div>
              <div className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
                {currentUser?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <button onClick={handleLogout} className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/30 md:hidden" />
      )}
    </div>
  );
};

export default Dashboard;
