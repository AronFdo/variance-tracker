import { useMemo } from 'react';

const mockStaff = [
  { id: 's1', name: 'Alice Johnson', project: 'Acme Corp', billedHours: 160, actualHours: 150, rate: 45 },
  { id: 's2', name: 'Bob Smith', project: 'Globex', billedHours: 140, actualHours: 155, rate: 40 },
  { id: 's3', name: 'Carol Lee', project: 'Initech', billedHours: 120, actualHours: 110, rate: 50 },
  { id: 's4', name: 'David Wilson', project: 'Acme Corp', billedHours: 160, actualHours: 165, rate: 42 },
  { id: 's5', name: 'Eva Brown', project: 'Globex', billedHours: 140, actualHours: 135, rate: 38 },
  { id: 's6', name: 'Frank Davis', project: 'TechCorp', billedHours: 0, actualHours: 0, rate: 48 },
];

const mockClients = [
  { name: 'Acme Corp', staffCount: 2, totalHours: 315, avgVariance: -2.5, satisfaction: 4.8, status: 'active' },
  { name: 'Globex', staffCount: 2, totalHours: 290, avgVariance: -5, satisfaction: 4.6, status: 'active' },
  { name: 'Initech', staffCount: 1, totalHours: 110, avgVariance: -10, satisfaction: 4.9, status: 'active' },
  { name: 'TechCorp', staffCount: 1, totalHours: 0, avgVariance: 0, satisfaction: 4.2, status: 'inactive' },
  { name: 'DataSys', staffCount: 0, totalHours: 0, avgVariance: 0, satisfaction: 4.5, status: 'inactive' },
];

export default function ClientMetrics() {
  const { activeClients, topClient, clientUtilization, averageSatisfaction, totalStaff, avgVarianceAcrossClients } = useMemo(() => {
    // Calculate active clients
    const activeClients = mockClients.filter(client => client.status === 'active').length;
    
    // Find top performing client by staff count and hours
    const topClient = mockClients
      .filter(client => client.status === 'active')
      .reduce((max, client) => (client.staffCount > max.staffCount || 
        (client.staffCount === max.staffCount && client.totalHours > max.totalHours)) ? client : max, 
        { staffCount: 0, totalHours: 0 });
    
    // Calculate client utilization (percentage of clients with optimal staffing levels)
    const optimalClients = mockClients.filter(client => 
      client.status === 'active' && client.staffCount >= 1 && client.totalHours > 0
    ).length;
    const clientUtilization = activeClients > 0 ? (optimalClients / activeClients) * 100 : 0;
    
    // Calculate average client satisfaction score
    const activeClientSatisfactions = mockClients
      .filter(client => client.status === 'active')
      .map(client => client.satisfaction);
    const averageSatisfaction = activeClientSatisfactions.length > 0 
      ? activeClientSatisfactions.reduce((sum, score) => sum + score, 0) / activeClientSatisfactions.length 
      : 0;
    
    // Calculate total staff across all clients
    const totalStaff = mockStaff.length;
    
    // Calculate average variance across all active clients
    const activeClientVariances = mockClients
      .filter(client => client.status === 'active')
      .map(client => client.avgVariance);
    const avgVarianceAcrossClients = activeClientVariances.length > 0 
      ? activeClientVariances.reduce((sum, variance) => sum + variance, 0) / activeClientVariances.length 
      : 0;
    
    return {
      activeClients,
      topClient,
      clientUtilization: Math.round(clientUtilization),
      averageSatisfaction: Math.round(averageSatisfaction * 10) / 10,
      totalStaff,
      avgVarianceAcrossClients: Math.round(avgVarianceAcrossClients * 10) / 10
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Client Performance Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Active Clients */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Active Clients</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            {activeClients}
          </div>
          <div className="mt-1 text-xs text-gray-500">of {mockClients.length} total</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-blue-600" style={{ width: `${(activeClients / mockClients.length) * 100}%` }} />
          </div>
        </div>

        {/* Top Performing Client */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Top Client</div>
          <div className="mt-2 text-lg font-bold text-purple-600 truncate">
            {topClient.name || 'N/A'}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {topClient.staffCount || 0} staff, {topClient.totalHours || 0}h total
          </div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-purple-600" style={{ width: `${Math.min(100, (topClient.staffCount || 0) / 3) * 100}%` }} />
          </div>
        </div>

        {/* Client Utilization */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Client Utilization</div>
          <div className={`mt-2 text-2xl font-bold ${clientUtilization >= 80 ? 'text-green-600' : clientUtilization >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {clientUtilization}%
          </div>
          <div className="mt-1 text-xs text-gray-500">Optimal staffing</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className={`h-2 rounded ${clientUtilization >= 80 ? 'bg-green-600' : clientUtilization >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`} 
                 style={{ width: `${clientUtilization}%` }} />
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Avg Satisfaction</div>
          <div className={`mt-2 text-2xl font-bold ${averageSatisfaction >= 4.5 ? 'text-green-600' : averageSatisfaction >= 4.0 ? 'text-yellow-600' : 'text-red-600'}`}>
            {averageSatisfaction}/5.0
          </div>
          <div className="mt-1 text-xs text-gray-500">Client rating</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className={`h-2 rounded ${averageSatisfaction >= 4.5 ? 'bg-green-600' : averageSatisfaction >= 4.0 ? 'bg-yellow-600' : 'bg-red-600'}`} 
                 style={{ width: `${(averageSatisfaction / 5) * 100}%` }} />
          </div>
        </div>

        {/* Staff Variance */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Avg Staff Variance</div>
          <div className={`mt-2 text-2xl font-bold ${avgVarianceAcrossClients === 0 ? 'text-gray-900' : avgVarianceAcrossClients > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {avgVarianceAcrossClients}h
          </div>
          <div className="mt-1 text-xs text-gray-500">Across clients</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className={`h-2 rounded ${avgVarianceAcrossClients >= 0 ? 'bg-red-600' : 'bg-green-600'}`} 
                 style={{ width: `${Math.min(100, Math.abs(avgVarianceAcrossClients) * 10)}%` }} />
          </div>
        </div>
      </div>

      {/* Client Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900">Client Performance Overview</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Staff Count</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Avg Variance</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockClients.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900">{client.name}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-900">{client.staffCount}</td>
                  <td className="px-4 py-2 text-gray-900">{client.totalHours}h</td>
                  <td className={`px-4 py-2 ${client.avgVariance === 0 ? 'text-gray-900' : client.avgVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {client.avgVariance}h
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-900">{client.satisfaction}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-3 h-3 ${star <= client.satisfaction ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
