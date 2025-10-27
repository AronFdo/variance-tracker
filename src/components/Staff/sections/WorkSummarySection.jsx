export default function WorkSummarySection({ clientSummary, clientAssignments, onNavigate }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Summary</h2>
        <p className="text-gray-600">Track your work progress by client</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Work Summary by Client</h3>
        
        {Object.keys(clientSummary).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(clientSummary).map(([clientName, data]) => {
              // Find matching client from assignments for assigned hours
              const clientAssignment = clientAssignments.find(c => c.name === clientName);
              const assignedHours = clientAssignment?.assignedHours || 0;
              const billedHours = clientAssignment?.billedHours || 0;
              const workDone = data.workHours;
              
              // Calculate progress percentage
              const progressPercent = assignedHours > 0 
                ? Math.min((workDone / assignedHours) * 100, 100) 
                : 0;
              
              // Determine status color
              let statusColor = 'green';
              let statusText = 'On Track';
              if (assignedHours > 0) {
                if (workDone > assignedHours) {
                  statusColor = 'orange';
                  statusText = 'Over Assigned';
                } else if (progressPercent >= 90) {
                  statusColor = 'yellow';
                  statusText = 'Near Completion';
                }
              }
              
              return (
                <div key={clientName} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{clientName}</h4>
                      <p className="text-sm text-gray-500">
                        {data.sessions} session{data.sessions !== 1 ? 's' : ''} recorded
                      </p>
                    </div>
                    {assignedHours > 0 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                        {statusText}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 font-medium mb-1">Work Done</div>
                      <div className="text-2xl font-bold text-blue-700">{workDone.toFixed(2)}h</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-purple-600 font-medium mb-1">Assigned</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {assignedHours > 0 ? `${assignedHours}h` : '-'}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 font-medium mb-1">Billed</div>
                      <div className="text-2xl font-bold text-green-700">
                        {billedHours > 0 ? `${billedHours}h` : '-'}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs text-orange-600 font-medium mb-1">Break Time</div>
                      <div className="text-2xl font-bold text-orange-700">{data.totalBreakTime.toFixed(2)}h</div>
                    </div>
                  </div>
                  
                  {assignedHours > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {progressPercent.toFixed(0)}% ({workDone.toFixed(1)}/{assignedHours}h)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            progressPercent >= 100 ? 'bg-orange-600' : 
                            progressPercent >= 90 ? 'bg-yellow-600' : 
                            'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                      {workDone > assignedHours && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {(workDone - assignedHours).toFixed(2)}h over assigned hours
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Recorded Yet</h3>
            <p className="text-sm text-gray-600 mb-6">
              Clock in to start tracking your hours and they will appear here
            </p>
            <button
              onClick={() => onNavigate && onNavigate('clock')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Time Clock
            </button>
          </div>
        )}
      </div>
      
      {/* Overall Statistics */}
      {Object.keys(clientSummary).length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Overall Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Clients</div>
              <div className="text-3xl font-bold text-blue-600">
                {Object.keys(clientSummary).length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Work Hours</div>
              <div className="text-3xl font-bold text-green-600">
                {Object.values(clientSummary).reduce((sum, c) => sum + c.workHours, 0).toFixed(2)}h
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
              <div className="text-3xl font-bold text-purple-600">
                {Object.values(clientSummary).reduce((sum, c) => sum + c.sessions, 0)}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Breaks</div>
              <div className="text-3xl font-bold text-orange-600">
                {Object.values(clientSummary).reduce((sum, c) => sum + c.totalBreakTime, 0).toFixed(2)}h
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

