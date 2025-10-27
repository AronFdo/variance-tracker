export default function TimesheetSection({ timeEntries }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Timesheet</h2>
        <p className="text-gray-600">View all your recorded work sessions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="overflow-x-auto">
          {timeEntries.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeEntries.map((entry, index) => {
                  const workTime = (entry.totalTime - entry.breakTime) / 3600;
                  const breakTime = entry.breakTime / 3600;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.startTime instanceof Date 
                          ? entry.startTime.toLocaleTimeString() 
                          : new Date(entry.startTime.seconds * 1000).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.endTime instanceof Date 
                          ? entry.endTime.toLocaleTimeString() 
                          : new Date(entry.endTime.seconds * 1000).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{workTime.toFixed(2)}h</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{breakTime.toFixed(2)}h</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Timesheet Entries</h3>
              <p className="text-sm text-gray-600">
                Clock in to start tracking your time and entries will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

