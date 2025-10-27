import { useState, useEffect, useMemo } from 'react';
import TimeClock from '../TimeClock';
import { getTimeEntriesByStaff } from '../../../firebase/firestore';

export default function TimeClockSection({ staffUser, onTimeEntry }) {
  const [recentEntries, setRecentEntries] = useState([]);

  useEffect(() => {
    const loadRecentEntries = async () => {
      if (!staffUser?.id) return;
      try {
        const entries = await getTimeEntriesByStaff(staffUser.id, { limit: 5 });
        setRecentEntries(entries);
      } catch (error) {
        console.error('Error loading recent entries:', error);
      }
    };
    
    loadRecentEntries();
  }, [staffUser?.id]);

  const handleTimeEntryComplete = async (newEntry) => {
    // Refresh recent entries
    if (staffUser?.id) {
      try {
        const entries = await getTimeEntriesByStaff(staffUser.id, { limit: 5 });
        setRecentEntries(entries);
      } catch (error) {
        console.error('Error refreshing entries:', error);
      }
    }
    
    // Call parent handler
    if (onTimeEntry) {
      onTimeEntry(newEntry);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Time Clock</h2>
        <p className="text-gray-600">Clock in and out to track your work hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimeClock staffUser={staffUser} onTimeEntry={handleTimeEntryComplete} />
        </div>
        
        <div className="space-y-4">
          {/* Recent Time Entries */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {recentEntries.slice(0, 5).map((entry, index) => {
                const workTime = (entry.totalTime - entry.breakTime) / 3600;
                return (
                  <div key={index} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">{entry.client}</div>
                      <div className="text-gray-500">{entry.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {workTime.toFixed(2)}h
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.startTime instanceof Date 
                          ? entry.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                          : new Date(entry.startTime.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
              {recentEntries.length === 0 && (
                <div className="text-center text-gray-500 py-4 text-sm">
                  No time entries yet
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Quick Tips
            </h4>
            <ul className="text-xs text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Select a client before clocking in</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use breaks to pause your timer without clocking out</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your time is automatically saved to your timesheet</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

