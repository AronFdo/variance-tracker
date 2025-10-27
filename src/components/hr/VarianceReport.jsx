import { useMemo, useState } from 'react';

const baseData = [
  { id: 's1', name: 'Alice Johnson', project: 'Acme Corp', billedHours: 160, actualHours: 150, rate: 45 },
  { id: 's2', name: 'Bob Smith', project: 'Globex', billedHours: 140, actualHours: 155, rate: 40 },
  { id: 's3', name: 'Carol Lee', project: 'Initech', billedHours: 120, actualHours: 110, rate: 50 },
];

export default function VarianceReport() {
  const [staffFilter, setStaffFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [quick, setQuick] = useState('all'); // all | over | under | zero

  const rows = useMemo(() => {
    return baseData
      .map(r => {
        const varianceHours = r.actualHours - r.billedHours;
        const monetary = varianceHours * r.rate;
        return { ...r, varianceHours, monetary };
      })
      .filter(r => (staffFilter ? r.name.toLowerCase().includes(staffFilter.toLowerCase()) : true))
      .filter(r => (projectFilter ? r.project.toLowerCase().includes(projectFilter.toLowerCase()) : true))
      .filter(r => quick === 'all' ? true : quick === 'over' ? r.varianceHours > 0 : quick === 'under' ? r.varianceHours < 0 : r.varianceHours === 0);
  }, [staffFilter, projectFilter, quick]);

  const totals = useMemo(() => {
    const totalVar = rows.reduce((s, r) => s + r.varianceHours, 0);
    const totalMoney = rows.reduce((s, r) => s + r.monetary, 0);
    return { totalVar, totalMoney };
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Variance Report</h2>
          <p className="text-sm text-gray-600">Analyze variance by staff and project</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'over', label: 'Over (>)' },
            { key: 'under', label: 'Under (<)' },
            { key: 'zero', label: 'Zero (=)' },
          ].map(b => (
            <button key={b.key} onClick={() => setQuick(b.key)} className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${quick === b.key ? 'bg-red-600 text-white ring-red-600' : 'bg-white text-gray-700 ring-gray-300 hover:bg-gray-50'}`}>{b.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Filter by Staff</label>
          <input value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} placeholder="e.g. Alice" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Filter by Project/Client</label>
          <input value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} placeholder="e.g. Acme" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Variance (hrs)</div>
          <div className={`mt-2 text-2xl font-bold ${totals.totalVar === 0 ? 'text-gray-900' : totals.totalVar > 0 ? 'text-red-600' : 'text-green-600'}`}>{totals.totalVar}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Monetary</div>
          <div className={`mt-2 text-2xl font-bold ${totals.totalMoney === 0 ? 'text-gray-900' : totals.totalMoney > 0 ? 'text-red-600' : 'text-green-600'}`}>${totals.totalMoney.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Billed</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Variance (hrs)</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Monetary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{r.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.project}</td>
                <td className="px-4 py-2 text-right">{r.billedHours}</td>
                <td className="px-4 py-2 text-right">{r.actualHours}</td>
                <td className={`px-4 py-2 text-right ${r.varianceHours === 0 ? '' : r.varianceHours > 0 ? 'text-red-600' : 'text-green-600'}`}>{r.varianceHours}</td>
                <td className={`px-4 py-2 text-right ${r.monetary === 0 ? '' : r.monetary > 0 ? 'text-red-600' : 'text-green-600'}`}>${r.monetary.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


