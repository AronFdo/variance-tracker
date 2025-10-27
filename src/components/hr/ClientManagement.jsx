import { useMemo, useState } from 'react';

const baseData = [
  { id: 's1', name: 'Alice Johnson', project: 'Acme Corp', billedHours: 160, actualHours: 150, rate: 45 },
  { id: 's2', name: 'Bob Smith', project: 'Globex', billedHours: 140, actualHours: 155, rate: 40 },
  { id: 's3', name: 'Carol Lee', project: 'Initech', billedHours: 120, actualHours: 110, rate: 50 },
  { id: 's4', name: 'David Wilson', project: 'Acme Corp', billedHours: 160, actualHours: 165, rate: 42 },
  { id: 's5', name: 'Eva Brown', project: 'Globex', billedHours: 140, actualHours: 135, rate: 38 },
  { id: 's6', name: 'Frank Davis', project: 'TechCorp', billedHours: 0, actualHours: 0, rate: 48 },
];

export default function ClientManagement() {
  const [rows, setRows] = useState(baseData);
  const [selectedId, setSelectedId] = useState(rows[0]?.id || '');
  const [newBilled, setNewBilled] = useState(rows[0]?.billedHours || 0);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('adjust'); // 'adjust', 'invoice'
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [invoiceCycle, setInvoiceCycle] = useState('current');
  const [includeDetails, setIncludeDetails] = useState(true);

  const selected = useMemo(() => rows.find(r => r.id === selectedId), [rows, selectedId]);

  // Group staff by client for invoice generation
  const clientsData = useMemo(() => {
    const grouped = rows.reduce((acc, staff) => {
      if (!acc[staff.project]) {
        acc[staff.project] = {
          name: staff.project,
          staff: [],
          totalBilled: 0,
          totalActual: 0,
          totalRevenue: 0
        };
      }
      acc[staff.project].staff.push(staff);
      acc[staff.project].totalBilled += staff.billedHours;
      acc[staff.project].totalActual += staff.actualHours;
      acc[staff.project].totalRevenue += staff.actualHours * staff.rate;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [rows]);

  const onChangeSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const found = rows.find(r => r.id === id);
    setNewBilled(found ? found.billedHours : 0);
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const value = Number(newBilled);
    if (!Number.isFinite(value) || value < 0 || value > 3000) {
      setError('Enter a valid number between 0 and 3000.');
      return;
    }
    setRows(prev => prev.map(r => (r.id === selectedId ? { ...r, billedHours: value } : r)));
    setToast('Billed hours updated (mock only).');
    setTimeout(() => setToast(''), 2000);
  };

  const generateInvoice = () => {
    if (!selectedClient) {
      setError('Please select a client for invoice generation.');
      return;
    }
    setInvoiceModal(false);
    setToast(`Invoice generated for ${selectedClient} (mock only)`);
    setTimeout(() => setToast(''), 2000);
  };

  const exportInvoice = () => {
    if (!selectedClient) {
      setError('Please select a client for export.');
      return;
    }
    setToast(`Invoice CSV exported for ${selectedClient} (mock only)`);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Client Management</h2>
          <p className="text-sm text-gray-600">Manage staff hours and generate client invoices</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('adjust')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'adjust'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Adjust Hours
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invoice'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invoice Generation
          </button>
        </nav>
      </div>

      {/* Adjust Hours Tab */}
      {activeTab === 'adjust' && (
        <div className="space-y-4">
          <form onSubmit={submit} className="bg-white border rounded-lg p-6 space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Staff</label>
              <select value={selectedId} onChange={onChangeSelect} className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                {rows.map(r => (
                  <option key={r.id} value={r.id}>{r.name} — {r.project}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Billed Hours</label>
              <input type="number" min={0} max={3000} value={newBilled} onChange={(e) => setNewBilled(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
              {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
            </div>
            {selected && (
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-sm text-gray-600">
                  <strong>Current:</strong> {selected.billedHours} hrs billed, {selected.actualHours} hrs actual
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Rate:</strong> ${selected.rate}/hr
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Variance:</strong> <span className={selected.actualHours - selected.billedHours >= 0 ? 'text-red-600' : 'text-green-600'}>
                    {selected.actualHours - selected.billedHours}h
                  </span>
                </div>
              </div>
            )}
            <div>
              <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700">
                Update Billed Hours
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoice Generation Tab */}
      {activeTab === 'invoice' && (
        <div className="space-y-6">
          {/* Client Overview */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientsData.map((client, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                    <span className="text-sm text-gray-500">{client.staff.length} staff</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Billed: {client.totalBilled}h</div>
                    <div>Actual: {client.totalActual}h</div>
                    <div>Revenue: ${client.totalRevenue.toLocaleString()}</div>
                    <div className={`${client.totalActual - client.totalBilled >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Variance: {client.totalActual - client.totalBilled}h
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client.name);
                        setInvoiceModal(true);
                      }}
                      className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs font-medium hover:bg-blue-700"
                    >
                      Generate Invoice
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(client.name);
                        exportInvoice();
                      }}
                      className="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-white text-xs font-medium hover:bg-green-700"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Invoice Actions */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Invoice Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
                <select 
                  value={selectedClient} 
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Choose a client...</option>
                  {clientsData.map((client, index) => (
                    <option key={index} value={client.name}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setInvoiceModal(true)}
                  disabled={!selectedClient}
                  className="rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Generate Invoice
                </button>
                <button
                  onClick={exportInvoice}
                  disabled={!selectedClient}
                  className="rounded-md bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Messages */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-md bg-green-50 text-green-700 border border-green-200 px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Invoice Generation Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Generate Invoice</h3>
            <p className="mt-2 text-sm text-gray-600">
              Generate invoice for <strong>{selectedClient}</strong> (mock only)
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Billing Cycle</label>
                <select 
                  value={invoiceCycle} 
                  onChange={(e) => setInvoiceCycle(e.target.value)} 
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="current">Current Cycle</option>
                  <option value="last">Last Cycle</option>
                  <option value="custom">Custom (mock)</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  checked={includeDetails} 
                  onChange={(e) => setIncludeDetails(e.target.checked)} 
                />
                Include staff-level billing details
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setInvoiceModal(false)} 
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={generateInvoice} 
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
