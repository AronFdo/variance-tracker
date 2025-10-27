export default function AssignmentsSection({ clientAssignments, clientSummary }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Assignments</h2>
        <p className="text-gray-600">View your client assignments and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientAssignments.map((client, index) => {
          // Get work done for this client
          const clientWork = clientSummary[client.name] || { workHours: 0, sessions: 0 };
          const workDone = clientWork.workHours;
          const assignedHours = client.assignedHours || 0;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {client.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{client.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Hourly Rate:</span>
                  <span className="font-medium text-gray-900">${client.rate}/hr</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Hours Worked:</span>
                  <span className="font-semibold text-blue-600">{workDone.toFixed(2)}h</span>
                </div>
                
                {assignedHours > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Assigned Hours:</span>
                    <span className="font-medium text-gray-900">{assignedHours}h</span>
                  </div>
                )}
                
                {client.billedHours > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Billed Hours:</span>
                    <span className="font-medium text-green-600">{client.billedHours}h</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sessions:</span>
                  <span className="font-medium text-gray-900">{clientWork.sessions}</span>
                </div>
              </div>
              
              {/* Progress bar if assigned hours exist */}
              {assignedHours > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{((workDone / assignedHours) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        workDone > assignedHours ? 'bg-orange-500' : 
                        workDone >= assignedHours * 0.9 ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((workDone / assignedHours) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Estimated earnings */}
              {workDone > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Est. Earnings:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(workDone * client.rate).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {clientAssignments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Client Assignments Yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                You haven't been assigned to any clients yet. Please contact your HR manager or supervisor to get client assignments.
              </p>
              <div className="text-xs text-gray-500">
                Once you have client assignments, you'll be able to clock in and track your time.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

