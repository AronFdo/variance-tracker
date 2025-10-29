import { useMemo, useState } from 'react';

// Mock clients data
const mockClients = [
  { 
    clientId: 'c1', 
    name: 'Acme Corp', 
    email: 'contact@acme.com', 
    phone: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    contactPerson: 'John Doe',
    status: 'active',
    billingCycle: 'monthly',
    createdAt: new Date('2023-01-15'),
    staffCount: 2,
    totalHours: 315,
    revenue: 14175
  },
  { 
    clientId: 'c2', 
    name: 'Globex', 
    email: 'info@globex.com', 
    phone: '+1-555-0102',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    contactPerson: 'Jane Smith',
    status: 'active',
    billingCycle: 'monthly',
    createdAt: new Date('2023-02-20'),
    staffCount: 2,
    totalHours: 290,
    revenue: 11800
  },
  { 
    clientId: 'c3', 
    name: 'Initech', 
    email: 'hello@initech.com', 
    phone: '+1-555-0103',
    address: '789 Tech Blvd, Austin, TX 78701',
    contactPerson: 'Bob Johnson',
    status: 'active',
    billingCycle: 'bi-weekly',
    createdAt: new Date('2023-03-10'),
    staffCount: 1,
    totalHours: 110,
    revenue: 5500
  },
];

export default function ClientManagement() {
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('clients'); // 'clients', 'invoice'
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [invoiceCycle, setInvoiceCycle] = useState('current');
  const [includeDetails, setIncludeDetails] = useState(true);
  
  // Client management state
  const [clients, setClients] = useState(mockClients);
  const [clientModal, setClientModal] = useState({ open: false, mode: 'create', client: null });
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    status: 'active',
    billingCycle: 'monthly'
  });
  const [clientProfile, setClientProfile] = useState({ open: false, client: null });

  // Group staff by client for invoice generation
  const clientsData = useMemo(() => {
    // Mock data for invoice generation - will be replaced with real data from hourAssignments
    return clients.map(client => ({
      name: client.name,
      staff: [], // Will be populated from hourAssignments
      totalBilled: 0, // Will be calculated from hourAssignments
      totalActual: 0,
      totalRevenue: client.revenue
    }));
  }, [clients]);

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

  // Client management functions
  const openCreateClient = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      status: 'active',
      billingCycle: 'monthly'
    });
    setClientModal({ open: true, mode: 'create', client: null });
  };

  const openEditClient = (client) => {
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      contactPerson: client.contactPerson,
      status: client.status,
      billingCycle: client.billingCycle
    });
    setClientModal({ open: true, mode: 'edit', client });
  };

  const closeClientModal = () => {
    setClientModal({ open: false, mode: 'create', client: null });
    setError('');
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!clientForm.name.trim()) {
      setError('Client name is required');
      return;
    }
    if (!clientForm.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!clientForm.phone.trim()) {
      setError('Phone is required');
      return;
    }

    if (clientModal.mode === 'create') {
      // Create new client
      const newClient = {
        clientId: `c${Date.now()}`,
        ...clientForm,
        createdAt: new Date(),
        staffCount: 0,
        totalHours: 0,
        revenue: 0
      };
      setClients(prev => [...prev, newClient]);
      setToast(`Client "${clientForm.name}" created successfully`);
    } else {
      // Update existing client
      setClients(prev => prev.map(client => 
        client.clientId === clientModal.client.clientId 
          ? { ...client, ...clientForm }
          : client
      ));
      setToast(`Client "${clientForm.name}" updated successfully`);
    }

    setTimeout(() => setToast(''), 2000);
    closeClientModal();
  };

  const handleDeleteClient = (client) => {
    if (confirm(`Are you sure you want to delete "${client.name}"? This action cannot be undone.`)) {
      setClients(prev => prev.filter(c => c.clientId !== client.clientId));
      setToast(`Client "${client.name}" deleted successfully`);
      setTimeout(() => setToast(''), 2000);
    }
  };

  const openClientProfile = (client) => {
    setClientProfile({ open: true, client });
  };

  const closeClientProfile = () => {
    setClientProfile({ open: false, client: null });
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
            onClick={() => setActiveTab('clients')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'clients'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Clients
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

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Total Clients: <span className="font-semibold text-gray-900">{clients.length}</span>
            </div>
            <button
              onClick={openCreateClient}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Client
            </button>
          </div>

          {/* Client List */}
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.clientId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{client.billingCycle}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {client.staffCount} staff
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">${client.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{client.totalHours}h</div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openClientProfile(client)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        View
                      </button>
                        <button
                          onClick={() => openEditClient(client)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Profile Modal */}
      {clientProfile.open && clientProfile.client && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Client Profile</h3>
                <p className="text-sm text-gray-500">Detailed information for {clientProfile.client.name}</p>
              </div>
              <button onClick={closeClientProfile} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Top summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clientProfile.client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {clientProfile.client.status}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-xs text-gray-500">Billing Cycle</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">{clientProfile.client.billingCycle}</div>
                </div>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">{clientProfile.client.createdAt?.toLocaleDateString?.() || '-'}</div>
                </div>
              </div>

              {/* Contact & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">Contact</div>
                  <div className="text-sm text-gray-700">{clientProfile.client.contactPerson || '—'}</div>
                  <div className="text-sm text-gray-700">{clientProfile.client.email}</div>
                  <div className="text-sm text-gray-700">{clientProfile.client.phone}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">Address</div>
                  <div className="text-sm text-gray-700">{clientProfile.client.address || '—'}</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-xs text-gray-500">Staff Assigned</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{clientProfile.client.staffCount ?? 0}</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-xs text-gray-500">Total Hours</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{clientProfile.client.totalHours?.toLocaleString?.() ?? 0}h</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-xs text-gray-500">Revenue</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">${clientProfile.client.revenue?.toLocaleString?.() ?? 0}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    closeClientProfile();
                    openEditClient(clientProfile.client);
                  }}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Edit Client
                </button>
                <button
                  onClick={closeClientProfile}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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

      {/* Client Create/Edit Modal */}
      {clientModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {clientModal.mode === 'create' ? 'Create New Client' : 'Edit Client'}
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={handleClientSubmit} className="p-6">
              <div className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientForm.name}
                    onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="+1-555-0123"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={clientForm.address}
                    onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="123 Main St, City, ST 12345"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={clientForm.contactPerson}
                    onChange={(e) => setClientForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Status and Billing Cycle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={clientForm.status}
                      onChange={(e) => setClientForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="prospect">Prospect</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={clientForm.billingCycle}
                      onChange={(e) => setClientForm(prev => ({ ...prev, billingCycle: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeClientModal}
                  className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  {clientModal.mode === 'create' ? 'Create Client' : 'Update Client'}
                </button>
              </div>
            </form>
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
