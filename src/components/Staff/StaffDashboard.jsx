import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getTimeEntriesByStaff, getTimeEntriesByClient, getStaffAssignments } from '../../firebase/firestore';

// Import section components
import OverviewSection from './sections/OverviewSection';
import TimeClockSection from './sections/TimeClockSection';
import WorkSummarySection from './sections/WorkSummarySection';
import TimesheetSection from './sections/TimesheetSection';
import AssignmentsSection from './sections/AssignmentsSection';

export default function StaffDashboard() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [timeEntries, setTimeEntries] = useState([]);
  const [clientSummary, setClientSummary] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Create staffUser object from auth context
  const staffUser = useMemo(() => {
    if (currentUser && userProfile) {
      return {
        id: currentUser.uid,
        name: userProfile.displayName || currentUser.displayName || userProfile.name,
        email: currentUser.email,
        clients: userProfile.clients || [],
        rate: userProfile.rate || 40,
        status: userProfile.status || 'active'
      };
    }
    return null;
  }, [currentUser, userProfile]);

  // Load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!staffUser?.id) return;
      
      setLoading(true);
      try {
        // Load time entries
        const entries = await getTimeEntriesByStaff(staffUser.id);
        setTimeEntries(entries);
        
        // Load client summary (work done per client)
        const summary = await getTimeEntriesByClient(staffUser.id);
        setClientSummary(summary);
        
        // Load assignments (if they exist)
        try {
          const staffAssignments = await getStaffAssignments(staffUser.id);
          setAssignments(staffAssignments);
        } catch (err) {
          console.log('No assignments found or collection does not exist yet');
          setAssignments([]);
        }
      } catch (error) {
        console.error('Error loading staff data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [staffUser?.id]);


  // Handle new time entry from TimeClock (refresh data from Firestore)
  const handleTimeEntry = async (newEntry) => {
    // Reload data from Firestore to reflect the new entry
    if (staffUser?.id) {
      try {
        const entries = await getTimeEntriesByStaff(staffUser.id);
        setTimeEntries(entries);
        
        const summary = await getTimeEntriesByClient(staffUser.id);
        setClientSummary(summary);
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section || 'overview');
    setMobileOpen(false);
  };

  // Client assignments from user profile
  const clientAssignments = useMemo(() => {
    if (staffUser?.clients && staffUser.clients.length > 0) {
      // Check if clients is an array of objects or strings
      if (typeof staffUser.clients[0] === 'object') {
        return staffUser.clients.map(client => ({
          name: client.name,
          rate: client.rate || staffUser.rate || 40,
          description: client.description || 'Client Assignment',
          status: client.status || 'Active',
          billedHours: client.billedHours || 0,
          assignedHours: client.assignedHours || 0
        }));
      } else {
        return staffUser.clients.map(client => ({
          name: client,
          rate: staffUser.rate || 40,
          description: 'Client Assignment',
          status: 'Active',
          billedHours: 0,
          assignedHours: 0
        }));
      }
    }
    
    return [];
  }, [staffUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render the appropriate section
  const renderSection = () => {
    switch (activeSection) {
      case 'clock':
        return <TimeClockSection staffUser={staffUser} onTimeEntry={handleTimeEntry} />;
      case 'summary':
        return <WorkSummarySection clientSummary={clientSummary} clientAssignments={clientAssignments} onNavigate={handleNavigate} />;
      case 'timesheet':
        return <TimesheetSection timeEntries={timeEntries} />;
      case 'assignments':
        return <AssignmentsSection clientAssignments={clientAssignments} clientSummary={clientSummary} />;
      default:
        return <OverviewSection staffUser={staffUser} timeEntries={timeEntries} clientSummary={clientSummary} clientAssignments={clientAssignments} onNavigate={handleNavigate} />;
    }
  };

  if (!staffUser || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { to: '', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { to: 'clock', label: 'Time Clock', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: 'summary', label: 'Work Summary', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { to: 'timesheet', label: 'Timesheet', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: 'assignments', label: 'My Assignments', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`w-64 bg-white border-r fixed md:static inset-y-0 z-40 transform md:transform-none transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:flex md:flex-col`}>
          <div className="h-16 flex items-center px-6 border-b">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-blue-700">Staff Portal</span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navLinks.map(link => {
              const isActive = (link.to === '' && activeSection === 'overview') || activeSection === link.to;
              return (
                <button
                  key={link.to || 'root'}
                  onClick={() => handleNavigate(link.to)}
                  className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {link.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-16 bg-white/90 backdrop-blur border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3 md:hidden">
              <button 
                aria-label="Toggle menu" 
                onClick={() => setMobileOpen(v => !v)} 
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <span className="text-lg font-semibold text-blue-700">Staff Portal</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.857 17.082A23.848 23.848 0 0 1 12 17c-2.039 0-4.017.243-5.857.707m8.714 0A4.501 4.501 0 0 1 7.5 21m7.357-3.918A8.967 8.967 0 0 0 18 12.75V11a6 6 0 1 0-12 0v1.75a8.967 8.967 0 0 0 2.143 5.332"/>
                </svg>
              </button>
              <div className="text-sm text-gray-600">
                {staffUser.name}
              </div>
              <div className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                {staffUser.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <button 
                onClick={handleLogout} 
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 md:p-6">
            {renderSection()}
          </main>
        </div>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/30 md:hidden" />
      )}
    </div>
  );
}
