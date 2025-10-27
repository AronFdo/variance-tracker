import { useMemo, useState, useEffect } from 'react';

const initialStaff = [
  { 
    id: 's1', 
    name: 'Alice Johnson', 
    project: 'Acme Corp', // Primary client for backward compatibility
    billedHours: 160, 
    actualHours: 150, 
    rate: 45, 
    email: 'alice.johnson@company.com',
    clients: [
      { name: 'Acme Corp', rate: 45 },
      { name: 'Globex', rate: 40 }
    ]
  },
  { 
    id: 's2', 
    name: 'Bob Smith', 
    project: 'Globex', 
    billedHours: 140, 
    actualHours: 155, 
    rate: 40, 
    email: 'bob.smith@company.com',
    clients: [
      { name: 'Globex', rate: 40 },
      { name: 'TechCorp', rate: 42 }
    ]
  },
  { 
    id: 's3', 
    name: 'Carol Lee', 
    project: 'Initech', 
    billedHours: 120, 
    actualHours: 110, 
    rate: 50, 
    email: 'carol.lee@company.com',
    clients: [
      { name: 'Initech', rate: 50 }
    ]
  },
  { 
    id: 's4', 
    name: 'David Wilson', 
    project: 'Acme Corp', 
    billedHours: 160, 
    actualHours: 165, 
    rate: 42, 
    email: 'david.wilson@company.com',
    clients: [
      { name: 'Acme Corp', rate: 42 },
      { name: 'Initech', rate: 44 }
    ]
  },
  { 
    id: 's5', 
    name: 'Eva Brown', 
    project: 'Globex', 
    billedHours: 140, 
    actualHours: 135, 
    rate: 38, 
    email: 'eva.brown@company.com',
    clients: [
      { name: 'Globex', rate: 38 },
      { name: 'Acme Corp', rate: 40 },
      { name: 'TechCorp', rate: 39 }
    ]
  },
  { 
    id: 's6', 
    name: 'Frank Davis', 
    project: 'TechCorp', 
    billedHours: 0, 
    actualHours: 0, 
    rate: 48, 
    email: 'frank.davis@company.com',
    clients: [
      { name: 'TechCorp', rate: 48 }
    ]
  },
];

// Mock time entries data - in real app this would come from backend
const generateMockTimeEntries = () => {
  const entries = [];
  const staffIds = ['s1', 's2', 's3', 's4', 's5', 's6'];
  const clients = ['Acme Corp', 'Globex', 'Initech', 'TechCorp'];
  const today = new Date();
  
  staffIds.forEach(staffId => {
    // Generate entries for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Random number of sessions per day (1-3)
      const sessionsCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < sessionsCount; j++) {
        const startTime = new Date(date);
        startTime.setHours(9 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60), 0);
        
        const duration = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        const breakTime = Math.floor(Math.random() * 30) + 5; // 5-35 minutes break
        const endTime = new Date(startTime.getTime() + (duration * 60 + breakTime) * 60000);
        
        entries.push({
          id: `entry_${staffId}_${dateStr}_${j}`,
          staffId: staffId,
          client: clients[Math.floor(Math.random() * clients.length)],
          date: dateStr,
          startTime: startTime,
          endTime: endTime,
          totalTime: duration * 3600,
          breakTime: breakTime * 60,
          workTime: (duration * 3600) - (breakTime * 60)
        });
      }
    }
  });
  
  return entries;
};

// Process real assignment into schedule format
const processRealAssignment = (realAssignment, staffClients, clientFilter) => {
  const { assignments } = realAssignment;
  
  // Filter assignments by client filter if needed
  const filteredAssignments = clientFilter
    ? assignments.filter(a => a.client === clientFilter)
    : assignments;
  
  if (filteredAssignments.length === 0) {
    return {
      billedAssigned: 0,
      billedCompleted: 0,
      unbilledAssigned: 0,
      unbilledCompleted: 0,
      totalAssigned: 0,
      totalCompleted: 0,
      variance: 0,
      unbilledVariance: 0,
      hours: [],
      byClient: {}
    };
  }
  
  // Calculate totals
  let dayBilledAssigned = 0;
  let dayUnbilledAssigned = 0;
  const byClient = {};
  
  filteredAssignments.forEach(assignment => {
    const { client, hours, billingStatus } = assignment;
    const hoursCount = hours.length;
    
    if (billingStatus === 'billed') {
      dayBilledAssigned += hoursCount;
    } else {
      dayUnbilledAssigned += hoursCount;
    }
    
    // Store per-client data
    const clientInfo = staffClients.find(c => c.name === client);
    byClient[client] = {
      billedAssigned: billingStatus === 'billed' ? hoursCount : 0,
      billedCompleted: billingStatus === 'billed' ? hoursCount : 0, // Assume assigned = completed for simplicity
      unbilledAssigned: billingStatus === 'unbilled' ? hoursCount : 0,
      unbilledCompleted: billingStatus === 'unbilled' ? hoursCount : 0,
      totalAssigned: hoursCount,
      totalCompleted: hoursCount,
      variance: 0,
      unbilledVariance: 0,
      rate: clientInfo?.rate || 0
    };
  });
  
  const totalAssigned = dayBilledAssigned + dayUnbilledAssigned;
  
  // Generate hourly breakdown (9 AM to 5 PM)
  const allHours = [];
  const assignedHoursSet = new Set();
  filteredAssignments.forEach(assignment => {
    assignment.hours.forEach(hour => assignedHoursSet.add(hour));
  });
  
  for (let hour = 9; hour < 17; hour++) {
    const isAssigned = assignedHoursSet.has(hour);
    const assignment = filteredAssignments.find(a => a.hours.includes(hour));
    
    let status = isAssigned ? 'completed' : 'unassigned';
    let billingStatus = assignment ? assignment.billingStatus : 'unbilled';
    
    allHours.push({
      hour,
      assigned: isAssigned,
      completed: isAssigned, // For real assignments, assume completed
      status,
      billingStatus,
      combinedStatus: isAssigned 
        ? (billingStatus === 'billed' ? 'billed-completed' : 'unbilled-completed')
        : 'unassigned'
    });
  }
  
  return {
    billedAssigned: dayBilledAssigned,
    billedCompleted: dayBilledAssigned,
    unbilledAssigned: dayUnbilledAssigned,
    unbilledCompleted: dayUnbilledAssigned,
    totalAssigned,
    totalCompleted: totalAssigned,
    variance: 0,
    unbilledVariance: 0,
    hours: allHours,
    byClient
  };
};

// Generate mock scheduled hours for staff (assigned hours with billing status) 
// Now supports multi-client schedules and real assignments
const generateStaffSchedule = (staffList, month, year, clientFilter = null, realAssignments = {}) => {
  const schedule = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  staffList.forEach(staffMember => {
    const staffId = staffMember.id;
    const staffClients = staffMember.clients || [{ name: staffMember.project, rate: staffMember.rate }];
    
    // Get clients to generate schedule for
    const clientsToSchedule = clientFilter 
      ? staffClients.filter(c => c.name === clientFilter)
      : staffClients;
    
    schedule[staffId] = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isPastDate = year < currentYear || 
                        (year === currentYear && month < currentMonth) ||
                        (year === currentYear && month === currentMonth && day < currentDay);
      
      // Check for real assignment for this day
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const assignmentKey = `${staffId}_${dateStr}`;
      const realAssignment = realAssignments[assignmentKey];
      
      // If real assignment exists, use it instead of mock data
      if (realAssignment && realAssignment.assignments) {
        const dayData = processRealAssignment(realAssignment, clientsToSchedule, clientFilter);
        schedule[staffId][day] = dayData;
        continue;
      }
      
      // Skip weekends for most staff
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        schedule[staffId][day] = { 
          billedAssigned: 0, 
          billedCompleted: 0, 
          unbilledAssigned: 0, 
          unbilledCompleted: 0,
          totalAssigned: 0,
          totalCompleted: 0,
          variance: 0,
          hours: [],
          byClient: {} 
        };
        continue;
      }
      
      // Distribute 8 hours among clients for this day
      const totalAssignedHours = 8;
      const hoursPerClient = Math.floor(totalAssignedHours / clientsToSchedule.length);
      const remainderHours = totalAssignedHours % clientsToSchedule.length;
      
      // Track aggregated metrics for the day
      let dayBilledAssigned = 0;
      let dayBilledCompleted = 0;
      let dayUnbilledAssigned = 0;
      let dayUnbilledCompleted = 0;
      let dayTotalAssigned = 0;
      let dayTotalCompleted = 0;
      
      const byClient = {};
      const allHours = [];
      
      // Generate schedule for each client
      clientsToSchedule.forEach((client, clientIdx) => {
        const clientHours = hoursPerClient + (clientIdx < remainderHours ? 1 : 0);
        
        if (clientHours === 0) return;
        
        // Completed hours vary (sometimes more, sometimes less, sometimes exact)
        const completedVariance = Math.floor(Math.random() * 3) - 1; // -1 to +1 hours variance per client
        const clientCompletedHours = Math.max(0, Math.min(8, clientHours + completedVariance));
        
        // Determine billing status based on date
        let billedAssigned = 0;
        let unbilledAssigned = clientHours;
        let billedCompleted = 0;
        let unbilledCompleted = clientCompletedHours;
        
        if (isPastDate) {
          // For past dates, 70% of assigned hours are billed
          billedAssigned = Math.floor(clientHours * 0.7);
          unbilledAssigned = clientHours - billedAssigned;
          
          // For completed hours, same ratio
          billedCompleted = Math.min(Math.floor(clientCompletedHours * 0.7), billedAssigned);
          unbilledCompleted = clientCompletedHours - billedCompleted;
        }
        
        // Store per-client data
        byClient[client.name] = {
          billedAssigned,
          billedCompleted,
          unbilledAssigned,
          unbilledCompleted,
          totalAssigned: clientHours,
          totalCompleted: clientCompletedHours,
          variance: clientCompletedHours - clientHours,
          unbilledVariance: unbilledCompleted - unbilledAssigned,
          rate: client.rate
        };
        
        // Add to day totals
        dayBilledAssigned += billedAssigned;
        dayBilledCompleted += billedCompleted;
        dayUnbilledAssigned += unbilledAssigned;
        dayUnbilledCompleted += unbilledCompleted;
        dayTotalAssigned += clientHours;
        dayTotalCompleted += clientCompletedHours;
      });
      
      // Generate hourly breakdown (9 AM to 5 PM) based on combined schedule
      const completedVariance = Math.floor(Math.random() * 5) - 2; // -2 to +2 hours variance for display
      const totalCompletedHours = Math.max(0, Math.min(8, dayTotalAssigned + completedVariance));
      
      let billedCompletedCount = 0;
      let unbilledCompletedCount = 0;
      let billedPendingCount = 0;
      let unbilledPendingCount = 0;
      
      for (let hour = 9; hour < 17; hour++) {
        const hourIndex = hour - 9;
        const isCompleted = hourIndex < totalCompletedHours;
        const isAssigned = hourIndex < dayTotalAssigned;
        
        let status = 'unassigned';
        let billingStatus = 'unbilled';
        
        if (isCompleted) {
          status = 'completed';
          // Determine if this completed hour is billed or unbilled
          if (billedCompletedCount < dayBilledCompleted) {
            billingStatus = 'billed';
            billedCompletedCount++;
          } else {
            billingStatus = 'unbilled';
            unbilledCompletedCount++;
          }
        } else if (isAssigned) {
          status = 'pending';
          // Determine if this assigned hour is billed or unbilled
          if ((billedCompletedCount + billedPendingCount) < dayBilledAssigned) {
            billingStatus = 'billed';
            billedPendingCount++;
          } else {
            billingStatus = 'unbilled';
            unbilledPendingCount++;
          }
        }
        
        allHours.push({
          hour,
          assigned: isAssigned,
          completed: isCompleted,
          status, // 'completed', 'pending', or 'unassigned'
          billingStatus, // 'billed' or 'unbilled'
          combinedStatus: billingStatus === 'billed' 
            ? (status === 'completed' ? 'billed-completed' : 'billed-assigned')
            : (status === 'completed' ? 'unbilled-completed' : status === 'pending' ? 'unbilled-assigned' : 'unassigned')
        });
      }
      
      schedule[staffId][day] = {
        billedAssigned: dayBilledAssigned,
        billedCompleted: dayBilledCompleted,
        unbilledAssigned: dayUnbilledAssigned,
        unbilledCompleted: dayUnbilledCompleted,
        totalAssigned: dayTotalAssigned,
        totalCompleted: totalCompletedHours,
        variance: totalCompletedHours - dayTotalAssigned,
        unbilledVariance: dayUnbilledCompleted - dayUnbilledAssigned,
        hours: allHours,
        byClient: byClient  // Per-client breakdown
      };
    }
  });
  
  return schedule;
};

export default function StaffManagement() {
  const [staff, setStaff] = useState(initialStaff);
  const [modal, setModal] = useState({ type: null, open: false, payload: null });
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [activeView, setActiveView] = useState('list'); // 'list', 'timesheet', or 'calendar'
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [staffSchedule, setStaffSchedule] = useState({});
  const [selectedClientFilter, setSelectedClientFilter] = useState('all'); // 'all' or specific client name
  
  // Hour assignment state
  const [hourAssignments, setHourAssignments] = useState({}); // Store manual hour assignments
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // { staffId, date, existingData }

  // Load mock time entries
  useEffect(() => {
    setTimeEntries(generateMockTimeEntries());
  }, []);
  
  // Load hour assignments from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hourAssignments');
    if (stored) {
      setHourAssignments(JSON.parse(stored));
    }
  }, []);
  
  // Save hour assignments to localStorage
  useEffect(() => {
    if (Object.keys(hourAssignments).length > 0) {
      localStorage.setItem('hourAssignments', JSON.stringify(hourAssignments));
    }
  }, [hourAssignments]);

  // Generate staff schedule when month, client filter, or assignments change
  useEffect(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const clientFilter = selectedClientFilter === 'all' ? null : selectedClientFilter;
    const schedule = generateStaffSchedule(staff, month, year, clientFilter, hourAssignments);
    setStaffSchedule(schedule);
  }, [selectedMonth, staff, selectedClientFilter, hourAssignments]);
  
  // Get all unique clients from staff
  const allClients = useMemo(() => {
    const clientSet = new Set();
    staff.forEach(staffMember => {
      const clients = staffMember.clients || [{ name: staffMember.project }];
      clients.forEach(client => clientSet.add(client.name));
    });
    return Array.from(clientSet).sort();
  }, [staff]);

  const withVariance = useMemo(() => staff.map(s => ({ ...s, variance: s.actualHours - s.billedHours })), [staff]);
  const filtered = useMemo(() => withVariance.filter(r => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.project.toLowerCase().includes(q)
    );
  }), [withVariance, query]);
  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      const { key, dir } = sortBy;
      const va = a[key];
      const vb = b[key];
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [filtered, sortBy]);

  const openAdd = () => setModal({ type: 'add', open: true, payload: { name: '', project: '', billedHours: 0, actualHours: 0, rate: 0 } });
  const openEdit = (row) => setModal({ type: 'edit', open: true, payload: { ...row } });
  const openDelete = (row) => setModal({ type: 'delete', open: true, payload: { ...row } });
  const closeModal = () => setModal({ type: null, open: false, payload: null });

  const confirmAddOrEdit = () => {
    if (modal.type === 'add') {
      const id = `s${Date.now()}`;
      setStaff(prev => [...prev, { ...modal.payload, id }]);
    } else if (modal.type === 'edit') {
      setStaff(prev => prev.map(s => (s.id === modal.payload.id ? modal.payload : s)));
    }
    closeModal();
  };

  const confirmDelete = () => {
    setStaff(prev => prev.filter(s => s.id !== modal.payload.id));
    closeModal();
  };

  const viewTimesheet = (staffMember) => {
    setSelectedStaff(staffMember);
    setActiveView('timesheet');
  };

  const backToList = () => {
    setActiveView('list');
    setSelectedStaff(null);
  };

  const viewCalendar = () => {
    setActiveView('calendar');
  };

  const changeMonth = (direction) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  // Open hour assignment modal
  const openAssignModal = (staffId, date) => {
    const staffMember = staff.find(s => s.id === staffId);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const assignmentKey = `${staffId}_${dateStr}`;
    const existingAssignment = hourAssignments[assignmentKey];
    
    setSelectedAssignment({
      staffId,
      staffName: staffMember.name,
      date: dateStr,
      dateObj: date,
      clients: staffMember.clients || [{ name: staffMember.project, rate: staffMember.rate }],
      existingData: existingAssignment || null
    });
    setAssignModalOpen(true);
  };
  
  // Save hour assignment
  const saveHourAssignment = (assignmentData) => {
    const { staffId, date, assignments } = assignmentData;
    const assignmentKey = `${staffId}_${date}`;
    
    setHourAssignments(prev => ({
      ...prev,
      [assignmentKey]: {
        staffId,
        date,
        assignments, // Array of { client, hours: [9, 10, 11...], billingStatus }
        lastModified: new Date().toISOString()
      }
    }));
    
    setAssignModalOpen(false);
    setSelectedAssignment(null);
  };
  
  // Delete hour assignment
  const deleteHourAssignment = (staffId, date) => {
    const assignmentKey = `${staffId}_${date}`;
    setHourAssignments(prev => {
      const updated = { ...prev };
      delete updated[assignmentKey];
      return updated;
    });
  };

  // Get calendar data for the selected month
  const getCalendarData = useMemo(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let currentWeek = new Array(firstDay).fill(null);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      currentWeek.push({
        day,
        date,
        dayOfWeek,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]
      });
      
      if (dayOfWeek === 6 || day === daysInMonth) {
        // Fill remaining days if last week
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    return weeks;
  }, [selectedMonth]);

  // Get time entries for selected staff
  const staffTimeEntries = useMemo(() => {
    if (!selectedStaff) return [];
    return timeEntries.filter(entry => entry.staffId === selectedStaff.id);
  }, [selectedStaff, timeEntries]);

  // Calculate timesheet summary for selected staff
  const timesheetSummary = useMemo(() => {
    if (!selectedStaff) return null;
    
    const totalHours = staffTimeEntries.reduce((sum, entry) => sum + (entry.workTime / 3600), 0);
    const totalBreakTime = staffTimeEntries.reduce((sum, entry) => sum + (entry.breakTime / 3600), 0);
    const totalSessions = staffTimeEntries.length;
    
    // Group by date
    const entriesByDate = staffTimeEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {});
    
    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalBreakTime: Math.round(totalBreakTime * 100) / 100,
      totalSessions,
      entriesByDate
    };
  }, [selectedStaff, staffTimeEntries]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">
            {activeView === 'timesheet' ? `Timesheet - ${selectedStaff?.name}` : 
             activeView === 'calendar' ? 'Staff Hours Calendar' : 'Staff Management'}
          </h2>
          {activeView === 'timesheet' && (
            <p className="text-sm text-gray-600">Time tracking records and hours worked</p>
          )}
          {activeView === 'calendar' && (
            <p className="text-sm text-gray-600">Monthly view of assigned, completed hours and variance</p>
          )}
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap">
          {activeView === 'timesheet' ? (
            <button onClick={backToList} className="rounded-md bg-gray-600 px-4 py-2 text-white text-sm font-medium hover:bg-gray-700">
              ← Back to Staff List
            </button>
          ) : activeView === 'calendar' ? (
            <button onClick={backToList} className="rounded-md bg-gray-600 px-4 py-2 text-white text-sm font-medium hover:bg-gray-700">
              ← Back to Staff List
            </button>
          ) : (
            <>
              <div className="relative flex-1 sm:w-64">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or project" className="w-full rounded-md border px-3 py-2 text-sm pl-8" />
                <span className="absolute left-2 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
                </span>
              </div>
              <button onClick={viewCalendar} className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
                📅 Hours Calendar
              </button>
              <button onClick={openAdd} className="rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700">Add Staff</button>
            </>
          )}
        </div>
      </div>

      {/* Staff List Table View */}
      {activeView === 'list' && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'name', label: 'Name', align: 'left' },
                  { key: 'project', label: 'Project/Client', align: 'left' },
                  { key: 'billedHours', label: 'Billed', align: 'right' },
                  { key: 'actualHours', label: 'Actual', align: 'right' },
                  { key: 'variance', label: 'Variance', align: 'right' },
                  { key: 'rate', label: 'Rate', align: 'right' },
                ].map(col => (
                  <th key={col.key} onClick={() => setSortBy(s => ({ key: col.key, dir: s.key === col.key && s.dir === 'asc' ? 'desc' : 'asc' }))} className={`px-4 py-2 text-${col.align} text-xs font-medium text-gray-500 uppercase select-none cursor-pointer`}>
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortBy.key === col.key && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3 w-3">
                          {sortBy.dir === 'asc' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                          )}
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.project}</td>
                  <td className="px-4 py-2 text-right">{row.billedHours}</td>
                  <td className="px-4 py-2 text-right">{row.actualHours}</td>
                  <td className={`px-4 py-2 text-right ${row.variance === 0 ? '' : row.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>{row.variance}</td>
                  <td className="px-4 py-2 text-right">${row.rate}/hr</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => viewTimesheet(row)} className="rounded-md border px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50">View Timesheet</button>
                    <button onClick={() => openEdit(row)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Edit</button>
                    <button onClick={() => openDelete(row)} className="rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className="space-y-6">
          {/* Month Navigation, Client Filter, and Legend */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => changeMonth(-1)} 
                  className="rounded-md bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200"
                >
                  ← Previous
                </button>
                <h3 className="text-xl font-semibold">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={() => changeMonth(1)} 
                  className="rounded-md bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Next →
                </button>
              </div>
              
              {/* Client Filter */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Filter by Client:</label>
                <select
                  value={selectedClientFilter}
                  onChange={(e) => setSelectedClientFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[180px]"
                >
                  <option value="all">All Clients</option>
                  {allClients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Filter Info Badge */}
            {selectedClientFilter !== 'all' && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-gray-700">
                  Showing hours for <span className="font-semibold text-blue-700">{selectedClientFilter}</span> only
                </span>
                <button
                  onClick={() => setSelectedClientFilter('all')}
                  className="ml-auto text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <div className="font-semibold text-gray-700">Legend:</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
                <span>Billed/Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-300 border border-blue-400 rounded"></div>
                <span>Billed/Assigned</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
                <span>Unbilled/Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
                <span>Unbilled/Assigned</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                <span>Unassigned</span>
              </div>
            </div>
          </div>

          {/* Staff Calendar Grid */}
          {sorted.map(staffMember => {
            const schedule = staffSchedule[staffMember.id] || {};
            const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
            const staffClients = staffMember.clients || [{ name: staffMember.project, rate: staffMember.rate }];
            const displayedClients = selectedClientFilter === 'all' 
              ? staffClients 
              : staffClients.filter(c => c.name === selectedClientFilter);
            
            // Only show staff member if they have the filtered client
            if (displayedClients.length === 0) return null;
            
            return (
              <div key={staffMember.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                {/* Staff Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-6 py-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{staffMember.name}</h4>
                        {selectedClientFilter === 'all' ? (
                          <p className="text-sm text-gray-600 mt-1">
                            {displayedClients.length} Client{displayedClients.length !== 1 ? 's' : ''}: {' '}
                            {displayedClients.map(c => c.name).join(', ')}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedClientFilter} • ${displayedClients[0]?.rate || staffMember.rate}/hr
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-right">
                          <div className="font-semibold text-gray-700 mb-1">Billed</div>
                          <div className="text-blue-600 font-medium">
                            Assigned: {Object.values(schedule).reduce((sum, day) => sum + day.billedAssigned, 0)}h
                          </div>
                          <div className="text-blue-700 font-bold">
                            Completed: {Object.values(schedule).reduce((sum, day) => sum + day.billedCompleted, 0)}h
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-700 mb-1">Unbilled</div>
                          <div className="text-yellow-600 font-medium">
                            Assigned: {Object.values(schedule).reduce((sum, day) => sum + day.unbilledAssigned, 0)}h
                          </div>
                          <div className="text-green-600 font-bold">
                            Completed: {Object.values(schedule).reduce((sum, day) => sum + day.unbilledCompleted, 0)}h
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Multi-client breakdown when showing all clients */}
                    {selectedClientFilter === 'all' && displayedClients.length > 1 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-100">
                        {displayedClients.map(client => {
                          const clientTotalHours = Object.values(schedule).reduce((sum, day) => {
                            return sum + (day.byClient?.[client.name]?.totalCompleted || 0);
                          }, 0);
                          return (
                            <div key={client.name} className="bg-white rounded-md px-3 py-1 text-xs border border-blue-200">
                              <span className="font-medium text-gray-700">{client.name}:</span>{' '}
                              <span className="text-blue-600 font-semibold">{clientTotalHours}h</span>
                              <span className="text-gray-500"> @ ${client.rate}/hr</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4 overflow-x-auto">
                  <div className="min-w-max">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase w-32">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar weeks */}
                    {getCalendarData.map((week, weekIdx) => (
                      <div key={weekIdx} className="grid grid-cols-7 gap-1 mb-1">
                        {week.map((dayData, dayIdx) => {
                          if (!dayData) {
                            return <div key={dayIdx} className="w-32 h-32 bg-gray-50 rounded"></div>;
                          }

                          const daySchedule = schedule[dayData.day] || { 
                            billedAssigned: 0, 
                            billedCompleted: 0, 
                            unbilledAssigned: 0, 
                            unbilledCompleted: 0,
                            totalAssigned: 0,
                            totalCompleted: 0,
                            variance: 0,
                            unbilledVariance: 0,
                            hours: [] 
                          };
                          const isWeekend = dayData.dayOfWeek === 0 || dayData.dayOfWeek === 6;
                          const isToday = dayData.date.toDateString() === new Date().toDateString();

                          const assignmentKey = `${staffMember.id}_${dayData.date.toISOString().split('T')[0]}`;
                          const hasAssignment = hourAssignments[assignmentKey];
                          
                          return (
                            <div 
                              key={dayIdx} 
                              onClick={() => openAssignModal(staffMember.id, dayData.date)}
                              className={`w-32 h-32 border rounded p-1 cursor-pointer transition-all ${
                                isToday ? 'border-blue-500 border-2' : 'border-gray-200'
                              } ${isWeekend ? 'bg-gray-50' : 'bg-white'} ${
                                hasAssignment ? 'ring-2 ring-green-300' : 'hover:border-blue-400 hover:shadow-md'
                              }`}
                            >
                              {/* Day number */}
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-1">
                                  <span className={`text-xs font-semibold ${
                                    isToday ? 'text-blue-600' : 'text-gray-700'
                                  }`}>
                                    {dayData.day}
                                  </span>
                                  {hasAssignment && (
                                    <span className="text-green-600" title="Has manual assignments">
                                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                                {daySchedule.variance !== 0 && (
                                  <span className={`text-xs font-bold ${
                                    daySchedule.variance > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {daySchedule.variance > 0 ? '+' : ''}{daySchedule.variance}
                                  </span>
                                )}
                              </div>

                              {/* Hours visualization */}
                              {daySchedule.totalAssigned > 0 && (
                                <div className="space-y-0.5">
                                  {/* Hourly slots */}
                                  <div className="grid grid-cols-8 gap-0.5">
                                    {daySchedule.hours.map((hourData, idx) => (
                                      <div
                                        key={idx}
                                        className={`h-2 rounded-sm ${
                                          hourData.combinedStatus === 'billed-completed'
                                            ? 'bg-blue-500' 
                                            : hourData.combinedStatus === 'billed-assigned'
                                            ? 'bg-blue-300'
                                            : hourData.combinedStatus === 'unbilled-completed'
                                            ? 'bg-green-500'
                                            : hourData.combinedStatus === 'unbilled-assigned'
                                            ? 'bg-yellow-400'
                                            : 'bg-gray-200'
                                        }`}
                                        title={`${hourData.hour}:00 - ${hourData.combinedStatus.replace('-', ' ')}`}
                                      ></div>
                                    ))}
                                  </div>

                                  {/* Summary text */}
                                  <div className="text-xs text-gray-600 space-y-0.5">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-blue-600">BA: {daySchedule.billedAssigned}h</span>
                                      <span className="font-bold text-blue-700">BC: {daySchedule.billedCompleted}h</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-yellow-600">UA: {daySchedule.unbilledAssigned}h</span>
                                      <span className="font-bold text-green-600">UC: {daySchedule.unbilledCompleted}h</span>
                                    </div>
                                    {daySchedule.unbilledVariance !== 0 && (
                                      <div className="text-center">
                                        <span className={`text-xs font-bold ${
                                          daySchedule.unbilledVariance > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          V: {daySchedule.unbilledVariance > 0 ? '+' : ''}{daySchedule.unbilledVariance}h
                                        </span>
                                      </div>
                                    )}
                                    
                                    {/* Per-client breakdown for multi-client view */}
                                    {selectedClientFilter === 'all' && daySchedule.byClient && Object.keys(daySchedule.byClient).length > 1 && (
                                      <div className="pt-0.5 mt-0.5 border-t border-gray-200 space-y-0.5">
                                        {Object.entries(daySchedule.byClient).map(([clientName, clientData]) => (
                                          <div key={clientName} className="flex justify-between items-center">
                                            <span className="text-gray-500 truncate max-w-[60px]" title={clientName}>
                                              {clientName.substring(0, 8)}:
                                            </span>
                                            <span className="font-medium text-purple-600">
                                              {clientData.totalCompleted}h
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff Summary Footer */}
                <div className="bg-gray-50 border-t px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Billed Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-semibold text-gray-700 mb-2">Billed Hours</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned:</span>
                          <span className="font-semibold text-blue-600">
                            {Object.values(schedule).reduce((sum, day) => sum + day.billedAssigned, 0)}h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-bold text-blue-700">
                            {Object.values(schedule).reduce((sum, day) => sum + day.billedCompleted, 0)}h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unbilled Section */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="font-semibold text-gray-700 mb-2">Unbilled Hours</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned:</span>
                          <span className="font-semibold text-yellow-600">
                            {Object.values(schedule).reduce((sum, day) => sum + day.unbilledAssigned, 0)}h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-bold text-green-600">
                            {Object.values(schedule).reduce((sum, day) => sum + day.unbilledCompleted, 0)}h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Variance Section */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="font-semibold text-gray-700 mb-2">Variance Analysis</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Overall:</span>
                          <span className={`font-bold ${
                            Object.values(schedule).reduce((sum, day) => sum + day.variance, 0) >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {Object.values(schedule).reduce((sum, day) => sum + day.variance, 0) > 0 ? '+' : ''}
                            {Object.values(schedule).reduce((sum, day) => sum + day.variance, 0)}h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unbilled:</span>
                          <span className={`font-bold ${
                            Object.values(schedule).reduce((sum, day) => sum + day.unbilledVariance, 0) >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {Object.values(schedule).reduce((sum, day) => sum + day.unbilledVariance, 0) > 0 ? '+' : ''}
                            {Object.values(schedule).reduce((sum, day) => sum + day.unbilledVariance, 0)}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Per-client detailed breakdown when viewing all clients */}
                  {selectedClientFilter === 'all' && displayedClients.length > 1 && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="font-semibold text-gray-700 mb-3 text-sm">Per-Client Breakdown:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {displayedClients.map(client => {
                          const clientStats = Object.values(schedule).reduce((acc, day) => {
                            const clientDay = day.byClient?.[client.name];
                            if (clientDay) {
                              acc.billedAssigned += clientDay.billedAssigned;
                              acc.billedCompleted += clientDay.billedCompleted;
                              acc.unbilledAssigned += clientDay.unbilledAssigned;
                              acc.unbilledCompleted += clientDay.unbilledCompleted;
                              acc.totalAssigned += clientDay.totalAssigned;
                              acc.totalCompleted += clientDay.totalCompleted;
                              acc.variance += clientDay.variance;
                              acc.unbilledVariance += clientDay.unbilledVariance;
                            }
                            return acc;
                          }, { 
                            billedAssigned: 0, 
                            billedCompleted: 0, 
                            unbilledAssigned: 0, 
                            unbilledCompleted: 0,
                            totalAssigned: 0,
                            totalCompleted: 0,
                            variance: 0,
                            unbilledVariance: 0
                          });
                          
                          return (
                            <div key={client.name} className="bg-white border border-gray-200 rounded-lg p-3 text-xs">
                              <div className="font-semibold text-gray-800 mb-2 flex justify-between items-center">
                                <span>{client.name}</span>
                                <span className="text-purple-600 font-bold">{clientStats.totalCompleted}h</span>
                              </div>
                              <div className="space-y-1 text-gray-600">
                                <div className="flex justify-between">
                                  <span>Assigned:</span>
                                  <span className="font-medium text-gray-700">{clientStats.totalAssigned}h</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Billed:</span>
                                  <span className="font-medium text-blue-600">{clientStats.billedCompleted}h</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Unbilled:</span>
                                  <span className="font-medium text-green-600">{clientStats.unbilledCompleted}h</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                                  <span className="font-medium">Variance:</span>
                                  <span className={`font-bold ${
                                    clientStats.variance > 0 ? 'text-green-600' : 
                                    clientStats.variance < 0 ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {clientStats.variance > 0 ? '+' : ''}{clientStats.variance}h
                                  </span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                  <span>Rate:</span>
                                  <span className="font-medium">${client.rate}/hr</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timesheet View */}
      {activeView === 'timesheet' && selectedStaff && timesheetSummary && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="text-sm text-gray-500">Total Hours</div>
              <div className="text-2xl font-bold text-blue-600">{timesheetSummary.totalHours}h</div>
              <div className="text-xs text-gray-500">Work time</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="text-sm text-gray-500">Break Time</div>
              <div className="text-2xl font-bold text-orange-600">{timesheetSummary.totalBreakTime}h</div>
              <div className="text-xs text-gray-500">Total breaks</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="text-sm text-gray-500">Sessions</div>
              <div className="text-2xl font-bold text-green-600">{timesheetSummary.totalSessions}</div>
              <div className="text-xs text-gray-500">Time entries</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="text-sm text-gray-500">Rate</div>
              <div className="text-2xl font-bold text-purple-600">${selectedStaff.rate}/hr</div>
              <div className="text-xs text-gray-500">Billing rate</div>
            </div>
          </div>

          {/* Detailed Timesheet */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Time Entries</h3>
              <p className="text-sm text-gray-600">Detailed breakdown of work sessions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffTimeEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.startTime.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.endTime.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(entry.workTime / 3600 * 100) / 100}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(entry.breakTime / 3600 * 100) / 100}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(entry.totalTime / 3600 * 100) / 100}h
                      </td>
                    </tr>
                  ))}
                  {staffTimeEntries.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No time entries found for this staff member
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            {modal.type === 'delete' ? (
              <>
                <h3 className="text-lg font-semibold">Delete Staff</h3>
                <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete {modal.payload.name}? This is a mock action.</p>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={closeModal} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                  <button onClick={confirmDelete} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Delete</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{modal.type === 'add' ? 'Add Staff' : 'Edit Staff'}</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Name</label>
                    <input value={modal.payload.name} onChange={(e) => setModal(m => ({ ...m, payload: { ...m.payload, name: e.target.value } }))} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Project/Client</label>
                    <input value={modal.payload.project} onChange={(e) => setModal(m => ({ ...m, payload: { ...m.payload, project: e.target.value } }))} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Billed Hours</label>
                    <input type="number" value={modal.payload.billedHours} onChange={(e) => setModal(m => ({ ...m, payload: { ...m.payload, billedHours: Number(e.target.value) } }))} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Actual Hours</label>
                    <input type="number" value={modal.payload.actualHours} onChange={(e) => setModal(m => ({ ...m, payload: { ...m.payload, actualHours: Number(e.target.value) } }))} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Rate ($/hr)</label>
                    <input type="number" value={modal.payload.rate} onChange={(e) => setModal(m => ({ ...m, payload: { ...m.payload, rate: Number(e.target.value) } }))} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={closeModal} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                  <button onClick={confirmAddOrEdit} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Hour Assignment Modal */}
      {assignModalOpen && selectedAssignment && (
        <HourAssignmentModal
          assignment={selectedAssignment}
          onSave={saveHourAssignment}
          onDelete={deleteHourAssignment}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </div>
  );
}

// Hour Assignment Modal Component
function HourAssignmentModal({ assignment, onSave, onDelete, onClose }) {
  const { staffId, staffName, date, dateObj, clients, existingData } = assignment;
  
  // Initialize state from existing data or create new
  const [clientAssignments, setClientAssignments] = useState(() => {
    if (existingData && existingData.assignments) {
      return existingData.assignments;
    }
    // Default: one empty assignment
    return [{ client: clients[0]?.name || '', hours: [], billingStatus: 'unbilled' }];
  });
  
  const availableHours = [9, 10, 11, 12, 13, 14, 15, 16]; // 9 AM to 5 PM (8 hours)
  
  // Add new client assignment
  const addClientAssignment = () => {
    setClientAssignments(prev => [
      ...prev,
      { client: clients[0]?.name || '', hours: [], billingStatus: 'unbilled' }
    ]);
  };
  
  // Remove client assignment
  const removeClientAssignment = (index) => {
    setClientAssignments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Update client assignment
  const updateClientAssignment = (index, field, value) => {
    setClientAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, [field]: value } : assignment
    ));
  };
  
  // Toggle hour selection
  const toggleHour = (assignmentIndex, hour) => {
    setClientAssignments(prev => prev.map((assignment, i) => {
      if (i !== assignmentIndex) return assignment;
      
      const hours = assignment.hours.includes(hour)
        ? assignment.hours.filter(h => h !== hour)
        : [...assignment.hours, hour].sort((a, b) => a - b);
      
      return { ...assignment, hours };
    }));
  };
  
  // Check if hour is already assigned to another client in this day
  const isHourAssigned = (currentIndex, hour) => {
    return clientAssignments.some((assignment, i) => 
      i !== currentIndex && assignment.hours.includes(hour)
    );
  };
  
  // Calculate total hours
  const totalAssignedHours = clientAssignments.reduce((sum, assignment) => 
    sum + assignment.hours.length, 0
  );
  
  // Save assignments
  const handleSave = () => {
    // Filter out empty assignments
    const validAssignments = clientAssignments.filter(a => 
      a.client && a.hours.length > 0
    );
    
    if (validAssignments.length === 0) {
      alert('Please assign at least one hour to a client');
      return;
    }
    
    onSave({
      staffId,
      date,
      assignments: validAssignments
    });
  };
  
  // Delete all assignments for this day
  const handleDelete = () => {
    if (confirm('Delete all hour assignments for this day?')) {
      onDelete(staffId, date);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Assign Hours</h3>
              <p className="text-sm text-gray-600 mt-1">
                {staffName} • {new Date(dateObj).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Summary */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Hours Assigned:
              </span>
              <span className={`text-lg font-bold ${
                totalAssignedHours > 8 ? 'text-red-600' : 
                totalAssignedHours === 8 ? 'text-green-600' : 'text-blue-600'
              }`}>
                {totalAssignedHours} / 8 hours
              </span>
            </div>
            {totalAssignedHours > 8 && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Warning: More than 8 hours assigned
              </p>
            )}
          </div>
          
          {/* Client Assignments */}
          <div className="space-y-6">
            {clientAssignments.map((assignment, index) => {
              const selectedClient = clients.find(c => c.name === assignment.client);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Assignment #{index + 1}
                    </h4>
                    {clientAssignments.length > 1 && (
                      <button
                        onClick={() => removeClientAssignment(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Client Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client
                    </label>
                    <select
                      value={assignment.client}
                      onChange={(e) => updateClientAssignment(index, 'client', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a client...</option>
                      {clients.map(client => (
                        <option key={client.name} value={client.name}>
                          {client.name} (${client.rate}/hr)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Billing Status */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Status
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={assignment.billingStatus === 'unbilled'}
                          onChange={() => updateClientAssignment(index, 'billingStatus', 'unbilled')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Unbilled</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={assignment.billingStatus === 'billed'}
                          onChange={() => updateClientAssignment(index, 'billingStatus', 'billed')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Pre-billed</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Hour Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Hours ({assignment.hours.length} selected)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableHours.map(hour => {
                        const isSelected = assignment.hours.includes(hour);
                        const isAssignedElsewhere = isHourAssigned(index, hour);
                        const timeStr = hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                        
                        return (
                          <button
                            key={hour}
                            onClick={() => !isAssignedElsewhere && toggleHour(index, hour)}
                            disabled={isAssignedElsewhere}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : isAssignedElsewhere
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {timeStr}
                          </button>
                        );
                      })}
                    </div>
                    {assignment.hours.length > 0 && (
                      <p className="text-xs text-gray-600 mt-2">
                        Selected: {assignment.hours.map(h => 
                          h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`
                        ).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Add Another Client Button */}
          {clients.length > 1 && (
            <button
              onClick={addClientAssignment}
              className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Another Client
            </button>
          )}
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between">
          <div>
            {existingData && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Delete All Assignments
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Save Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


