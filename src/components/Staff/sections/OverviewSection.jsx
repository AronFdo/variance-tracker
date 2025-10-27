import { useMemo } from 'react';

export default function OverviewSection({ staffUser, timeEntries, clientSummary, clientAssignments, onNavigate }) {
  // Calculate today's stats
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = timeEntries.filter(entry => entry.date === today);
    
    const totalHours = todayEntries.reduce((sum, entry) => sum + (entry.totalTime || 0), 0);
    const totalBreakTime = todayEntries.reduce((sum, entry) => sum + (entry.breakTime || 0), 0);
    const workHours = totalHours - totalBreakTime;
    
    return {
      totalHours: Math.floor(totalHours / 3600 * 100) / 100,
      workHours: Math.floor(workHours / 3600 * 100) / 100,
      breakHours: Math.floor(totalBreakTime / 3600 * 100) / 100,
      entriesCount: todayEntries.length
    };
  }, [timeEntries]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    const weekEntries = timeEntries.filter(entry => entry.date >= weekStart);
    const totalHours = weekEntries.reduce((sum, entry) => sum + (entry.totalTime || 0), 0);
    const workHours = totalHours - weekEntries.reduce((sum, entry) => sum + (entry.breakTime || 0), 0);
    
    return {
      totalHours: Math.floor(totalHours / 3600 * 100) / 100,
      workHours: Math.floor(workHours / 3600 * 100) / 100,
      entriesCount: weekEntries.length
    };
  }, [timeEntries]);

  // Calculate total earnings
  const totalEarnings = useMemo(() => {
    let total = 0;
    Object.entries(clientSummary).forEach(([clientName, data]) => {
      const client = clientAssignments.find(c => c.name === clientName);
      if (client) {
        total += data.workHours * client.rate;
      }
    });
    return total;
  }, [clientSummary, clientAssignments]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {staffUser.name}!</h2>
        <p className="text-gray-600">Here's your work overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Today's Hours</div>
          <div className="text-2xl font-bold text-blue-600">{todayStats.workHours}h</div>
          <div className="text-xs text-gray-500 mt-1">{todayStats.entriesCount} sessions</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">This Week</div>
          <div className="text-2xl font-bold text-green-600">{weeklyStats.workHours}h</div>
          <div className="text-xs text-gray-500 mt-1">{weeklyStats.entriesCount} sessions</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Active Clients</div>
          <div className="text-2xl font-bold text-purple-600">{clientAssignments.length}</div>
          <div className="text-xs text-gray-500 mt-1">Assigned projects</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Est. Earnings</div>
          <div className="text-2xl font-bold text-orange-600">${totalEarnings.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">This period</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {timeEntries.slice(0, 5).map((entry, index) => {
              const workTime = (entry.totalTime - entry.breakTime) / 3600;
              return (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{entry.client}</div>
                      <div className="text-sm text-gray-500">{entry.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{workTime.toFixed(2)}h</div>
                    <div className="text-xs text-gray-500">worked</div>
                  </div>
                </div>
              );
            })}
            {timeEntries.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm">
                No sessions recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Clients</h3>
          <div className="space-y-4">
            {Object.entries(clientSummary)
              .sort(([, a], [, b]) => b.workHours - a.workHours)
              .slice(0, 5)
              .map(([clientName, data], index) => {
                const client = clientAssignments.find(c => c.name === clientName);
                const earnings = client ? data.workHours * client.rate : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{clientName}</span>
                        <span className="text-sm font-semibold text-gray-900">{data.workHours.toFixed(1)}h</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{data.sessions} sessions</span>
                        <span className="text-green-600 font-medium">${earnings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            {Object.keys(clientSummary).length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm">
                No client work recorded yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
        <p className="text-blue-100 text-sm mb-4">Access frequently used features</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => onNavigate && onNavigate('clock')} className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 text-center transition-colors">
            <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm font-medium">Clock In/Out</div>
          </button>
          <button onClick={() => onNavigate && onNavigate('summary')} className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 text-center transition-colors">
            <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="text-sm font-medium">Work Summary</div>
          </button>
          <button onClick={() => onNavigate && onNavigate('timesheet')} className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 text-center transition-colors">
            <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-sm font-medium">Timesheet</div>
          </button>
          <button onClick={() => onNavigate && onNavigate('assignments')} className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 text-center transition-colors">
            <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="text-sm font-medium">Assignments</div>
          </button>
        </div>
      </div>
    </div>
  );
}

