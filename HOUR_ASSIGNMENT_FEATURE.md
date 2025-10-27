# Hour Assignment Feature

## Overview
A comprehensive hour assignment system that allows HR managers to assign specific hours to staff members on a per-client basis. This feature enables granular scheduling with hour-by-hour client assignments and billing status management.

## Key Features

### 1. **Click-to-Assign Interface**
- Click any calendar day cell to open the assignment modal
- Visual indicators show which days have manual assignments (green ring + checkmark)
- Hover effects guide users to clickable cells

### 2. **Multi-Client Hour Assignment**
- Assign different hours to different clients within the same day
- Example: 9 AM-12 PM for Acme Corp, 1 PM-5 PM for Globex
- Automatic conflict detection prevents double-booking

### 3. **Hour-by-Hour Selection**
- 8 time slots: 9 AM, 10 AM, 11 AM, 12 PM, 1 PM, 2 PM, 3 PM, 4 PM
- Visual button interface for easy hour selection
- Selected hours highlighted in blue
- Already-assigned hours disabled to prevent conflicts

### 4. **Billing Status Management**
- Choose between:
  - **Unbilled**: Hours not yet invoiced to client
  - **Pre-billed**: Hours already billed/invoiced to client
- Set billing status per client assignment

### 5. **Real-Time Integration**
- Assignments immediately reflected in calendar
- Updates monthly totals and statistics
- Works with client filtering system
- Persistent storage (localStorage)

## How to Use

### Assigning Hours

1. **Navigate to Calendar**
   - Go to HR Dashboard → Staff Management
   - Click "📅 Hours Calendar"

2. **Select a Day**
   - Click on any calendar day cell
   - The assignment modal opens automatically

3. **Create Assignment**
   - **Select Client**: Choose from staff member's assigned clients
   - **Select Billing Status**: Unbilled or Pre-billed
   - **Select Hours**: Click hour buttons to toggle selection (9 AM - 4 PM)
   - See real-time count: "Selected: 9 AM, 10 AM, 11 AM"

4. **Add Multiple Clients** (Optional)
   - Click "+ Add Another Client" button
   - Repeat selection process for second client
   - Hours already assigned to first client are disabled for second
   - Example:
     - Assignment #1: Acme Corp, 9 AM-12 PM (4 hours)
     - Assignment #2: Globex, 1 PM-4 PM (4 hours)

5. **Save**
   - Click "Save Assignments"
   - Day cell now shows green ring and checkmark
   - Calendar updates with assigned hours

### Editing Existing Assignments

1. Click on a day with assignments (has green ring + checkmark)
2. Modal opens with existing assignments pre-filled
3. Modify client, hours, or billing status
4. Click "Save Assignments" to update

### Deleting Assignments

1. Open the assignment modal for a day with assignments
2. Click "Delete All Assignments" button (bottom left)
3. Confirm deletion
4. Day returns to default/mock data

## Assignment Modal Features

### Header
```
Assign Hours
Alice Johnson • Monday, October 21, 2024
```

### Summary Section
```
┌────────────────────────────────────┐
│ Total Hours Assigned: 8 / 8 hours │
└────────────────────────────────────┘
```
- Color-coded:
  - Blue: < 8 hours
  - Green: exactly 8 hours
  - Red: > 8 hours (with warning)

### Assignment Card(s)

**For Each Client:**
```
┌─────────────────────────────────────────┐
│ Assignment #1                   [Remove]│
├─────────────────────────────────────────┤
│ Client:                                 │
│ ┌───────────────────────────────────┐  │
│ │ Acme Corp ($45/hr)            ▼  │  │
│ └───────────────────────────────────┘  │
│                                         │
│ Billing Status:                         │
│ ( ) Unbilled  (•) Pre-billed           │
│                                         │
│ Select Hours (4 selected):              │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│ │9 AM│ │10AM│ │11AM│ │12PM│           │
│ └────┘ └────┘ └────┘ └────┘           │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│ │1 PM│ │2 PM│ │3 PM│ │4 PM│           │
│ └────┘ └────┘ └────┘ └────┘           │
│                                         │
│ Selected: 9 AM, 10 AM, 11 AM, 12 PM    │
└─────────────────────────────────────────┘
```

### Footer
```
[Delete All Assignments]        [Cancel] [Save Assignments]
```

## Visual Indicators

### Calendar Day Cell with Assignment
```
┌───────────────────┐
│ 15 ✓              │ ← Green checkmark = has assignment
│ ████████          │ ← Hours visualization
│ BA: 4h  BC: 4h    │
│ UA: 0h  UC: 0h    │
└───────────────────┘
```

### Calendar Day Cell States
- **No Assignment**: White background, hover border
- **Has Assignment**: Green ring border (ring-2 ring-green-300)
- **Hover**: Blue border, shadow effect
- **Today**: Blue border-2

## Data Structure

### Hour Assignment Storage Format
```javascript
{
  "s1_2024-10-21": {
    "staffId": "s1",
    "date": "2024-10-21",
    "assignments": [
      {
        "client": "Acme Corp",
        "hours": [9, 10, 11, 12],
        "billingStatus": "billed"
      },
      {
        "client": "Globex",
        "hours": [13, 14, 15, 16],
        "billingStatus": "unbilled"
      }
    ],
    "lastModified": "2024-10-21T14:30:00.000Z"
  }
}
```

### Assignment Object
```javascript
{
  client: string,           // Client name
  hours: number[],          // Array of hours (9-16)
  billingStatus: 'billed' | 'unbilled'
}
```

## Business Rules

### Hour Constraints
- ✅ Minimum: 0 hours per day
- ✅ Maximum: 8 hours per day (can be exceeded with warning)
- ✅ No overlapping: Same hour cannot be assigned to multiple clients

### Multi-Client Rules
- ✅ Staff can work for multiple clients in one day
- ✅ Each client assignment is independent
- ✅ Hours automatically sum up in totals
- ✅ Per-client breakdown shown in calendar

### Billing Status Rules
- **Unbilled**: Default for new assignments
- **Pre-billed**: Use when client has already been invoiced
- Affects calendar color coding and financial reports

## Integration Points

### Calendar Display
- Real assignments override mock data
- Hours visualization updates automatically
- Per-client breakdown respects assignments
- Totals recalculate based on real data

### Client Filtering
- Assignments filtered when specific client selected
- Show only hours for filtered client
- Multi-client assignments split appropriately

### Statistics
- Monthly totals include real assignments
- Billed vs unbilled hours calculated correctly
- Variance analysis updates
- Per-client breakdown reflects actual assignments

## Use Cases

### Use Case 1: Schedule Split-Day Consultant
**Scenario**: Alice works for two clients

**Steps**:
1. Click October 21 in Alice's calendar
2. Assignment #1:
   - Client: Acme Corp
   - Hours: 9 AM - 12 PM (4 hours)
   - Status: Pre-billed
3. Click "+ Add Another Client"
4. Assignment #2:
   - Client: Globex  
   - Hours: 1 PM - 4 PM (4 hours)
   - Status: Unbilled
5. Save

**Result**: 
- Day shows 4h for Acme Corp (billed)
- Day shows 4h for Globex (unbilled)
- Per-client breakdown updated
- Total: 8 hours assigned

### Use Case 2: Pre-Bill Client Hours
**Scenario**: Client paid upfront for 40 hours this week

**Steps**:
1. For each workday (Mon-Fri):
2. Assign 8 hours to that client
3. Set billing status: "Pre-billed"
4. Save

**Result**:
- Calendar shows all hours as billed
- Financial reports show revenue secured
- Can track delivery vs pre-billed amount

### Use Case 3: Adjust for Part-Time Day
**Scenario**: Staff only worked 4 hours on Friday

**Steps**:
1. Click Friday in calendar
2. Select client
3. Select only 9 AM - 12 PM (4 hours)
4. Status: Unbilled
5. Save

**Result**:
- Day shows 4 hours assigned
- Totals reduced to actual hours worked
- No overtime warning

### Use Case 4: Edit Previous Assignment
**Scenario**: Need to change client for Tuesday's hours

**Steps**:
1. Click Tuesday (has green checkmark)
2. Modal opens with existing assignment
3. Change client from dropdown
4. Or modify selected hours
5. Save changes

**Result**:
- Assignment updated
- Calendar refreshes
- Statistics recalculated

## Validation & Feedback

### Warnings
- ⚠️ **> 8 hours assigned**: Red warning in summary
- ⚠️ **No hours selected**: Cannot save, alert shown
- ⚠️ **No client selected**: Cannot save, alert shown

### Confirmations
- ✅ Save successful: Modal closes, calendar updates
- ✅ Delete confirmation: "Delete all hour assignments for this day?"
- ✅ Visual feedback: Green ring appears on day cell

### Error Prevention
- Hours already assigned to one client are disabled for others
- Cannot select same hour twice
- Client dropdown shows only staff's assigned clients
- Save button validation before submission

## Technical Details

### State Management
```javascript
const [hourAssignments, setHourAssignments] = useState({});
const [assignModalOpen, setAssignModalOpen] = useState(false);
const [selectedAssignment, setSelectedAssignment] = useState(null);
```

### Key Functions

#### `openAssignModal(staffId, date)`
Opens assignment modal for specific staff and date

#### `saveHourAssignment(assignmentData)`
Saves assignment to state and localStorage

#### `deleteHourAssignment(staffId, date)`
Removes assignment for specific day

#### `processRealAssignment(realAssignment, staffClients, clientFilter)`
Converts assignment data to schedule format

### Persistence
- **Storage**: Browser localStorage
- **Key**: `hourAssignments`
- **Format**: JSON object
- **Load**: On component mount
- **Save**: On assignment change (automatic)

### Performance
- Assignments load once on mount
- Calendar regenerates on assignment change
- Modal state isolated to prevent re-renders
- Efficient hour selection with Set data structure

## Future Enhancements

1. **Copy Assignments**: Copy hours from one day to multiple days
2. **Templates**: Save and reuse common assignment patterns
3. **Bulk Assignment**: Assign entire week at once
4. **Drag & Drop**: Drag hours between clients or days
5. **Time Ranges**: Select time ranges instead of individual hours
6. **Break Time**: Designate break hours separately
7. **Overtime Tracking**: Automatic overtime calculation
8. **Assignment History**: Track changes and revisions
9. **Approval Workflow**: Require manager approval for changes
10. **Backend Sync**: Save to Firebase instead of localStorage

## Benefits

### For HR Managers
✅ **Precise Scheduling**: Hour-by-hour control
✅ **Multi-Client Support**: Realistic work allocation
✅ **Easy Editing**: Click to modify any day
✅ **Visual Feedback**: See assignments at a glance
✅ **Flexible**: Handle any staffing scenario

### For Operations
✅ **Accurate Data**: Real assignments vs mock data
✅ **Billing Control**: Mark pre-billed hours
✅ **Conflict Prevention**: No double-booking
✅ **Audit Trail**: Last modified timestamps

### For Finance
✅ **Revenue Recognition**: Track billed vs unbilled hours
✅ **Client Billing**: Per-client hour breakdown
✅ **Invoice Preparation**: Export ready data
✅ **Variance Tracking**: Compare assigned vs completed

---

**Related Documentation:**
- `MULTI_CLIENT_CALENDAR_FEATURE.md` - Multi-client support
- `STAFF_HOURS_CALENDAR_FEATURE.md` - Base calendar features
- `CALENDAR_LEGEND_GUIDE.md` - Color coding reference

