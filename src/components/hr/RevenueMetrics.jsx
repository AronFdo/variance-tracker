import { useMemo } from 'react';

const mockStaff = [
  { id: 's1', name: 'Alice Johnson', project: 'Acme Corp', billedHours: 160, actualHours: 150, rate: 45 },
  { id: 's2', name: 'Bob Smith', project: 'Globex', billedHours: 140, actualHours: 155, rate: 40 },
  { id: 's3', name: 'Carol Lee', project: 'Initech', billedHours: 120, actualHours: 110, rate: 50 },
  { id: 's4', name: 'David Wilson', project: 'Acme Corp', billedHours: 160, actualHours: 165, rate: 42 },
  { id: 's5', name: 'Eva Brown', project: 'Globex', billedHours: 140, actualHours: 135, rate: 38 },
  { id: 's6', name: 'Frank Davis', project: 'TechCorp', billedHours: 0, actualHours: 0, rate: 48 },
];

// Group staff by client for allocation display
const getClientAllocation = () => {
  const grouped = mockStaff.reduce((acc, staff) => {
    if (!acc[staff.project]) {
      acc[staff.project] = {
        name: staff.project,
        staff: [],
        totalVariance: 0
      };
    }
    acc[staff.project].staff.push(staff);
    acc[staff.project].totalVariance += (staff.actualHours - staff.billedHours);
    return acc;
  }, {});
  return Object.values(grouped);
};

export default function StaffAllocationMetrics() {
  const { totalStaff, activeStaff, totalVariance, averageVariance, utilizationRate } = useMemo(() => {
    // Calculate total staff count
    const totalStaff = mockStaff.length;
    
    // Calculate active staff (those with actual hours > 0)
    const activeStaff = mockStaff.filter(staff => staff.actualHours > 0).length;
    
    // Calculate total variance across all staff
    const totalVariance = mockStaff.reduce((sum, staff) => sum + (staff.actualHours - staff.billedHours), 0);
    
    // Calculate average variance per staff member
    const averageVariance = totalStaff > 0 ? totalVariance / totalStaff : 0;
    
    // Calculate staff utilization rate (percentage of staff with hours)
    const utilizationRate = totalStaff > 0 ? (activeStaff / totalStaff) * 100 : 0;
    
    return {
      totalStaff,
      activeStaff,
      totalVariance: Math.round(totalVariance),
      averageVariance: Math.round(averageVariance * 10) / 10,
      utilizationRate: Math.round(utilizationRate)
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Staff Allocation & Variance Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staff */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Total Staff</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            {totalStaff}
          </div>
          <div className="mt-1 text-xs text-gray-500">Assigned to clients</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-blue-600" style={{ width: `${(totalStaff / 10) * 100}%` }} />
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Active Staff</div>
          <div className="mt-2 text-2xl font-bold text-green-600">
            {activeStaff}
          </div>
          <div className="mt-1 text-xs text-gray-500">With billable hours</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-green-600" style={{ width: `${(activeStaff / totalStaff) * 100}%` }} />
          </div>
        </div>

        {/* Total Variance */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Total Variance</div>
          <div className={`mt-2 text-2xl font-bold ${totalVariance === 0 ? 'text-gray-900' : totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {totalVariance}h
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {totalVariance >= 0 ? 'Over' : 'Under'} billed hours
          </div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className={`h-2 rounded ${totalVariance >= 0 ? 'bg-red-600' : 'bg-green-600'}`} 
                 style={{ width: `${Math.min(100, Math.abs(totalVariance) / 50)}%` }} />
          </div>
        </div>

        {/* Average Variance */}
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Avg Variance</div>
          <div className={`mt-2 text-2xl font-bold ${averageVariance === 0 ? 'text-gray-900' : averageVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {averageVariance}h
          </div>
          <div className="mt-1 text-xs text-gray-500">Per staff member</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className={`h-2 rounded ${averageVariance >= 0 ? 'bg-red-600' : 'bg-green-600'}`} 
                 style={{ width: `${Math.min(100, Math.abs(averageVariance) * 10)}%` }} />
          </div>
        </div>
      </div>

      {/* Staff Allocation Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="text-sm font-medium text-gray-900 mb-4">Staff Allocation by Client</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getClientAllocation().map((client, index) => {
            const maxStaffCount = Math.max(...getClientAllocation().map(c => c.staff.length));
            const barHeight = (client.staff.length / maxStaffCount) * 100;
            return (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-center mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">{client.name}</h4>
                  <div className="text-sm text-gray-500">{client.staff.length} staff assigned</div>
                </div>
                
                {/* Visual bar showing staff count */}
                <div className="mb-4">
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${barHeight}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    {client.staff.length} of {maxStaffCount} max
                  </div>
                </div>

                {/* Staff details with individual variances */}
                <div className="space-y-2">
                  {client.staff.map((staff, staffIndex) => {
                    const variance = staff.actualHours - staff.billedHours;
                    return (
                      <div key={staffIndex} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 truncate" title={staff.name}>
                          {staff.name}
                        </span>
                        <span className={`font-medium ${variance === 0 ? 'text-gray-600' : variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {variance > 0 ? '+' : ''}{variance}h
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Client total variance */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Variance:</span>
                    <span className={`font-medium ${client.totalVariance === 0 ? 'text-gray-600' : client.totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {client.totalVariance > 0 ? '+' : ''}{client.totalVariance}h
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Staff Count</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Over Billed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Under Billed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
