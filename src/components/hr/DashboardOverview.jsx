import { useMemo } from 'react';
import StaffAllocationMetrics from './RevenueMetrics';
import ClientMetrics from './ClientMetrics';

const mockStaff = [
  { id: 's1', name: 'Alice Johnson', project: 'Acme Corp', billedHours: 160, actualHours: 150, rate: 45 },
  { id: 's2', name: 'Bob Smith', project: 'Globex', billedHours: 140, actualHours: 155, rate: 40 },
  { id: 's3', name: 'Carol Lee', project: 'Initech', billedHours: 120, actualHours: 110, rate: 50 },
  { id: 's4', name: 'David Wilson', project: 'Acme Corp', billedHours: 160, actualHours: 165, rate: 42 },
  { id: 's5', name: 'Eva Brown', project: 'Globex', billedHours: 140, actualHours: 135, rate: 38 },
  { id: 's6', name: 'Frank Davis', project: 'TechCorp', billedHours: 0, actualHours: 0, rate: 48 },
];

export default function DashboardOverview() {
  const { totalStaff, totalBilled, totalActual, totalVariance } = useMemo(() => {
    const totalStaff = mockStaff.length;
    const totalBilled = mockStaff.reduce((sum, s) => sum + s.billedHours, 0);
    const totalActual = mockStaff.reduce((sum, s) => sum + s.actualHours, 0);
    const totalVariance = totalActual - totalBilled; // positive = over, negative = under
    return { totalStaff, totalBilled, totalActual, totalVariance };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <p className="text-sm text-gray-600">Snapshot of staffing and variance performance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Live Mock Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Total Staff</div>
          <div className="mt-2 text-2xl font-bold">{totalStaff}</div>
          <div className="mt-4 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-red-600" style={{ width: `${(totalStaff / 10) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Total Billed Hours</div>
          <div className="mt-2 text-2xl font-bold">{totalBilled}</div>
          <div className="mt-1 text-xs text-gray-500">Target 480</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-red-600" style={{ width: `${Math.min(100, (totalBilled / 480) * 100)}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Total Actual Hours</div>
          <div className="mt-2 text-2xl font-bold">{totalActual}</div>
          <div className="mt-1 text-xs text-gray-500">vs billed</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-black" style={{ width: `${Math.min(100, (totalActual / (totalBilled || 1)) * 100)}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Overall Variance</div>
          <div className={`mt-2 text-2xl font-bold ${totalVariance === 0 ? 'text-gray-900' : totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {totalVariance}
          </div>
          <div className="mt-1 text-xs text-gray-500">{totalVariance >= 0 ? 'Over' : 'Under'} by hours</div>
        </div>
      </div>

      {/* Staff Allocation & Variance Metrics */}
      <StaffAllocationMetrics />

      {/* Client Performance Metrics */}
      <ClientMetrics />
    </div>
  );
}


