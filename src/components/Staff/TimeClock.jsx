import { useState, useEffect, useMemo } from 'react';
import { addTimeEntry } from '../../firebase/firestore';

export default function TimeClock({ staffUser, onTimeEntry }) {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);

  // Get client assignments from user profile
  const clientAssignments = useMemo(() => {
    // Use clients from user profile (Firebase data)
    if (staffUser?.clients && staffUser.clients.length > 0) {
      // Check if clients is an array of objects or strings
      if (typeof staffUser.clients[0] === 'object') {
        return staffUser.clients.map(c => c.name);
      }
      return staffUser.clients;
    }
    
    return [];
  }, [staffUser]);

  // Timer effect for elapsed time
  useEffect(() => {
    let interval = null;
    if (isClockedIn && sessionStartTime && !isOnBreak) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, sessionStartTime, isOnBreak]);

  // Break timer effect
  useEffect(() => {
    let interval = null;
    if (isOnBreak) {
      interval = setInterval(() => {
        setBreakTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clockIn = () => {
    if (!selectedClient) {
      alert('Please select a client before clocking in');
      return;
    }
    
    const now = new Date();
    const session = {
      id: Date.now(),
      client: selectedClient,
      startTime: now,
      staffId: staffUser.id,
      staffName: staffUser.name
    };
    
    setCurrentSession(session);
    setSessionStartTime(now);
    setIsClockedIn(true);
    setIsOnBreak(false);
    setBreakTime(0);
  };

  const clockOut = async () => {
    if (!currentSession) return;
    
    const now = new Date();
    const totalWorkTime = elapsedTime - breakTime;
    
    const timeEntry = {
      ...currentSession,
      endTime: now,
      totalTime: totalWorkTime,
      breakTime: breakTime,
      date: now.toISOString().split('T')[0],
      userId: staffUser.id
    };
    
    try {
      // Save to Firestore
      await addTimeEntry(timeEntry);
      
      // Call parent callback to update local state
      if (onTimeEntry) {
        onTimeEntry(timeEntry);
      }
      
      // Reset state
      setCurrentSession(null);
      setSessionStartTime(null);
      setIsClockedIn(false);
      setIsOnBreak(false);
      setElapsedTime(0);
      setBreakTime(0);
    } catch (error) {
      console.error('Error saving time entry:', error);
      alert('Failed to save time entry. Please try again.');
    }
  };

  const startBreak = () => {
    if (!isClockedIn || isOnBreak) return;
    setIsOnBreak(true);
  };

  const endBreak = () => {
    if (!isOnBreak) return;
    setIsOnBreak(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Time Clock</h3>
        
        {/* Current Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isClockedIn 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isClockedIn ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            {isClockedIn ? 'Clocked In' : 'Clocked Out'}
          </div>
        </div>

        {/* Client Selection */}
        {!isClockedIn && (
          <div className="mb-6">
            {clientAssignments.length > 0 ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Client/Project
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full max-w-xs mx-auto rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a client...</option>
                  {clientAssignments.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">No Client Assignments</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      You need to be assigned to a client before you can clock in. Please contact your HR manager.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Session Info */}
        {isClockedIn && currentSession && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700 mb-2">
              Working on: <span className="font-medium">{currentSession.client}</span>
            </div>
            <div className="text-sm text-blue-700">
              Started at: {currentSession.startTime.toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Timer Display */}
        {isClockedIn && (
          <div className="mb-6">
            <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-gray-600">
              Total Time Worked
            </div>
            {breakTime > 0 && (
              <div className="mt-2 text-sm text-orange-600">
                Break Time: {formatTime(breakTime)}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {!isClockedIn ? (
            <button
              onClick={clockIn}
              disabled={!selectedClient}
              className="w-full max-w-xs mx-auto bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Clock In
            </button>
          ) : (
            <div className="space-y-3">
              {/* Break Controls */}
              {!isOnBreak ? (
                <button
                  onClick={startBreak}
                  className="w-full max-w-xs mx-auto bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Start Break
                </button>
              ) : (
                <button
                  onClick={endBreak}
                  className="w-full max-w-xs mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  End Break
                </button>
              )}
              
              {/* Clock Out */}
              <button
                onClick={clockOut}
                className="w-full max-w-xs mx-auto bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Clock Out
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(elapsedTime - breakTime)}
            </div>
            <div className="text-xs text-gray-600">Work Time</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(breakTime)}
            </div>
            <div className="text-xs text-gray-600">Break Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
