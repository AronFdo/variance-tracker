# Multi-Client Hours Calendar Feature

## Overview
Enhanced hours calendar that supports staff members working with multiple clients throughout the day. Staff can now be assigned to multiple clients with different hourly rates, and the calendar can filter and display hours by specific clients or show all clients combined.

## Key Features

### 1. **Multi-Client Support**
Staff members can now be assigned to multiple clients simultaneously:
- Each staff member has a `clients` array with client names and rates
- Hours are automatically distributed among clients for each workday
- Different rates per client are supported

### 2. **Client Filtering**
The calendar view includes a powerful client filter:
- **All Clients View**: Shows combined hours across all clients
- **Single Client View**: Filters to show hours for a specific client only
- **Dynamic Filtering**: Updates calendar in real-time when filter changes
- **Clear Visual Feedback**: Shows active filter with a dismissible badge

### 3. **Per-Client Breakdown**
When viewing all clients, additional information is displayed:

#### In Staff Header:
- List of all assigned clients
- Total hours worked per client for the month
- Individual client rates

#### In Calendar Day Cells:
- Per-client hour breakdown for days with multiple clients
- Color-coded hours showing billing status across all clients
- Client-specific completed hours

#### In Summary Footer:
- Detailed per-client statistics cards
- Total assigned and completed hours per client
- Billed vs unbilled hours per client
- **Variance per client** (color-coded: green for over-delivery, red for under-delivery)
- Client-specific rates

## Usage

### Accessing the Multi-Client Calendar

1. Navigate to **HR Dashboard**
2. Go to **Staff Management**
3. Click **📅 Hours Calendar** button
4. Use the **Filter by Client** dropdown to:
   - View all clients (default)
   - Filter to a specific client

### Understanding the Display

#### When Viewing "All Clients":

**Staff Header Shows:**
```
Alice Johnson
2 Clients: Acme Corp, Globex
```

**Day Cell Shows:**
```
┌─────────────────────┐
│ 15          +2      │ ← Day & variance
│ ████████████        │ ← 8 hourly slots
│ BA: 6h    BC: 5h    │ ← Billed totals
│ UA: 2h    UC: 3h    │ ← Unbilled totals
│ ──────────────────  │
│ Acme Co:      4h    │ ← Client 1 hours
│ Globex:       4h    │ ← Client 2 hours
└─────────────────────┘
```

**Summary Footer Shows:**
- Overall billed/unbilled hours
- Variance analysis
- **Per-Client Breakdown Cards:**
  - Total assigned hours per client
  - Total completed hours per client
  - Billed vs unbilled per client
  - **Variance per client** (with color coding)
  - Client rates

#### When Filtering to Specific Client:

**Staff Header Shows:**
```
Alice Johnson
Acme Corp • $45/hr
```

**Day Cell Shows:**
- Only hours for the selected client
- Relevant billing status for that client
- Standard variance calculations

**Filter Badge Shows:**
```
🔍 Showing hours for Acme Corp only [Clear Filter]
```

## Data Structure

### Staff Member Format
```javascript
{
  id: 's1',
  name: 'Alice Johnson',
  project: 'Acme Corp', // Primary client (backward compatible)
  rate: 45, // Default rate
  clients: [
    { name: 'Acme Corp', rate: 45 },
    { name: 'Globex', rate: 40 }
  ]
}
```

### Schedule Day Format (with Multi-Client)
```javascript
{
  billedAssigned: 6,      // Total across all clients
  billedCompleted: 5,
  unbilledAssigned: 2,
  unbilledCompleted: 3,
  totalAssigned: 8,
  totalCompleted: 8,
  variance: 0,
  unbilledVariance: 1,
  hours: [...],           // Hourly breakdown
  byClient: {             // NEW: Per-client breakdown
    'Acme Corp': {
      billedAssigned: 3,
      billedCompleted: 3,
      unbilledAssigned: 1,
      unbilledCompleted: 2,
      totalAssigned: 4,
      totalCompleted: 5,
      variance: 1,
      unbilledVariance: 1,
      rate: 45
    },
    'Globex': {
      billedAssigned: 3,
      billedCompleted: 2,
      unbilledAssigned: 1,
      unbilledCompleted: 1,
      totalAssigned: 4,
      totalCompleted: 3,
      variance: -1,
      unbilledVariance: 0,
      rate: 40
    }
  }
}
```

## Technical Implementation

### Key Functions

#### `generateStaffSchedule(staffList, month, year, clientFilter)`
- Generates schedules for staff members
- Distributes hours among multiple clients
- Filters by client when `clientFilter` is provided
- Returns schedule with `byClient` breakdown

#### Client Distribution Logic
```javascript
// Distribute 8 hours among clients
const hoursPerClient = Math.floor(8 / clientsCount);
const remainderHours = 8 % clientsCount;

// First clients get extra hours from remainder
clientsToSchedule.forEach((client, idx) => {
  const clientHours = hoursPerClient + (idx < remainderHours ? 1 : 0);
  // Generate schedule for this client's hours
});
```

### State Management

#### New State Variables
```javascript
const [selectedClientFilter, setSelectedClientFilter] = useState('all');
```

#### Derived State
```javascript
const allClients = useMemo(() => {
  // Extract unique client names from all staff
  const clientSet = new Set();
  staff.forEach(staffMember => {
    staffMember.clients.forEach(client => clientSet.add(client.name));
  });
  return Array.from(clientSet).sort();
}, [staff]);
```

## Business Value

### For HR Managers
1. **Accurate Time Allocation**: See exactly how staff time is distributed across clients
2. **Client-Specific Reporting**: Generate reports for individual clients
3. **Rate Visibility**: Track different rates per staff-client combination
4. **Resource Planning**: Understand multi-client workload distribution

### For Finance
1. **Multi-Client Billing**: Accurate billing data for staff working multiple clients
2. **Rate Tracking**: Different rates per client relationship
3. **Revenue Attribution**: Clear breakdown of hours by client
4. **Variance Analysis**: Identify over/under-delivery per client

### For Operations
1. **Realistic Modeling**: Reflects actual work patterns (staff rarely work 8hrs for one client)
2. **Capacity Planning**: Understand how staff capacity is split
3. **Client Load Balancing**: Identify staff with too many/few clients
4. **Flexibility**: Easy to add/remove client assignments

## Real-World Scenarios

### Scenario 1: Consultant Working Multiple Clients
**Alice Johnson** is a senior consultant who works with:
- **Acme Corp** (4 hours/day @ $45/hr) - Web development
- **Globex** (4 hours/day @ $40/hr) - Code review

The calendar shows:
- Combined 8-hour workdays
- Per-client hour breakdown in footer
- Ability to filter to see just Acme Corp or Globex hours

### Scenario 2: Client-Specific Reporting
HR Manager wants to bill **Acme Corp** for the month:
1. Click **Filter by Client** → Select "Acme Corp"
2. Calendar shows only Acme Corp hours
3. Summary shows total hours: 88h @ $45/hr
4. Unbilled completed hours ready for next invoice: 24h

### Scenario 3: Staff Capacity Analysis
HR Manager wants to see if **Bob Smith** is overloaded:
1. View calendar in "All Clients" mode
2. See Bob works for Globex (5h/day) and TechCorp (3h/day)
3. Per-client breakdown shows balanced distribution
4. Can adjust assignments if needed

## Migration & Compatibility

### Backward Compatibility
- Existing single-client staff data still works
- `project` and `rate` fields maintained for legacy support
- If no `clients` array, system creates one from `project` and `rate`

### Migration Path
```javascript
// Old format (still supported)
{ 
  id: 's1', 
  name: 'Alice', 
  project: 'Acme Corp', 
  rate: 45 
}

// New format (recommended)
{ 
  id: 's1', 
  name: 'Alice', 
  project: 'Acme Corp', // Primary client
  rate: 45,             // Default rate
  clients: [
    { name: 'Acme Corp', rate: 45 },
    { name: 'Globex', rate: 40 }
  ]
}
```

## Hour Assignment Feature ✅ NEW!
HR managers can now manually assign hours to staff on a per-client, per-hour basis! See `HOUR_ASSIGNMENT_FEATURE.md` for complete details.

**Key Features:**
- Click any calendar day to open assignment modal
- Assign specific hours (9 AM - 4 PM) to specific clients
- Support for multiple clients per day (e.g., 4h for Client A, 4h for Client B)
- Set billing status per assignment (billed or unbilled)
- Visual indicators show days with manual assignments
- Real assignments override mock data in calendar

**To Use:**
- Click any day cell in the calendar
- Select client, hours, and billing status
- Save to apply (stored in localStorage)

## Future Enhancements

1. ~~**Client Assignment Interface**: UI to add/remove client assignments~~ ✅ **COMPLETED** (Hour assignment modal)
2. **Historical Client Changes**: Track when client assignments change
3. **Client-Specific Time Entry**: Staff clock in/out per specific client
4. **Weighted Distribution**: Custom hour distribution per client (not equal split)
5. **Client Groups**: Group related clients for reporting
6. **Conflict Detection**: Warn if total client hours exceed capacity ✅ **COMPLETED** (Built into assignment modal)
7. **Export by Client**: Generate client-specific reports and invoices
8. **Calendar Quick Filter**: Click on client name in header to filter
9. **Copy/Paste Assignments**: Copy assignments from one day to multiple days
10. **Assignment Templates**: Save and reuse common patterns

## Color Coding (Unchanged)

The 5-tier color system remains consistent across all clients:
- 🔵 **Dark Blue**: Billed/Completed
- 🔷 **Light Blue**: Billed/Assigned
- 🟢 **Green**: Unbilled/Completed
- 🟡 **Yellow**: Unbilled/Assigned
- ⚪ **Gray**: Unassigned

## Benefits Summary

✅ **Realistic**: Reflects how staff actually work (multiple clients per day)  
✅ **Flexible**: Easy to filter between all clients and specific clients  
✅ **Detailed**: Per-client breakdown in headers, cells, and footer  
✅ **Accurate**: Different rates per client supported  
✅ **Compatible**: Works with existing single-client data  
✅ **Actionable**: Clear visibility for billing and planning decisions  

---

**Related Documentation:**
- See `STAFF_HOURS_CALENDAR_FEATURE.md` for base calendar features
- See `CALENDAR_LEGEND_GUIDE.md` for color coding reference

