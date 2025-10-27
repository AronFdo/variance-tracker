# Staff Hours Calendar Visualization

## Overview
A comprehensive monthly calendar view in HR -> Staff Management that provides granular hour-by-hour tracking of staff schedules, showing assigned hours, completed hours, and variance.

## Features

### 1. **Monthly Calendar View**
- Navigate between months using Previous/Next buttons
- Current month display with year
- Calendar grid showing all days of the month

### 2. **Per-Staff Visualization**
Each staff member has their own calendar card showing:
- **Staff Header**: Name, project/client, hourly rate, and total hours
- **Calendar Grid**: Full month view with day-by-day breakdown
- **Summary Footer**: Totals for assigned, completed, and variance hours

### 3. **Daily Hour Breakdown with Billing Status**
Each day in the calendar displays:
- **Day Number**: With today highlighted in blue
- **Hourly Slots**: Visual representation of 8 hours (9 AM - 5 PM) as colored blocks showing both work status AND billing status
  - 🔵 Dark Blue: **Billed/Completed** - Work done and already billed to client
  - 🔷 Light Blue: **Billed/Assigned** - Work assigned and pre-billed to client (not yet completed)
  - 🟢 Green: **Unbilled/Completed** - Work done but not yet billed to client
  - 🟡 Yellow: **Unbilled/Assigned** - Work assigned but not completed or billed
  - ⚪ Gray: **Unassigned** - No work scheduled
- **BA (Billed Assigned)**: Hours pre-billed to client and assigned to staff
- **BC (Billed Completed)**: Hours pre-billed to client and completed by staff
- **UA (Unbilled Assigned)**: Hours assigned but not yet billed to client
- **UC (Unbilled Completed)**: Hours completed but not yet billed to client
- **V (Variance)**: Unbilled variance (UC - UA) for tracking next billing cycle

### 4. **Color Coding System**
The visualization uses a comprehensive 5-tier color system:

#### Billing + Work Status:
- **Billed/Completed** (bg-blue-500): Dark blue - Revenue secured, work delivered
- **Billed/Assigned** (bg-blue-300): Light blue - Revenue secured, work pending
- **Unbilled/Completed** (bg-green-500): Green - Work delivered, ready to bill
- **Unbilled/Assigned** (bg-yellow-400): Yellow - Work scheduled, pending completion and billing
- **Unassigned** (bg-gray-200): Gray - No work scheduled

#### Variance Indicators:
- **Positive Variance**: Green text (over-delivered, additional revenue opportunity)
- **Negative Variance**: Red text (under-delivered, potential revenue loss)

### 5. **Summary Metrics**
For each staff member, three comprehensive sections:

#### Billed Hours (Blue Section):
- **Assigned**: Total pre-billed hours assigned to staff
- **Completed**: Total pre-billed hours completed by staff

#### Unbilled Hours (Green Section):
- **Assigned**: Total unbilled hours assigned to staff
- **Completed**: Total unbilled hours completed by staff (ready for next billing cycle)

#### Variance Analysis (Purple Section):
- **Overall Variance**: Total difference between all completed and assigned hours
- **Unbilled Variance**: Difference between unbilled completed and unbilled assigned (critical for next invoice)

## How to Access
1. Navigate to HR Dashboard
2. Go to "Staff Management"
3. Click the "📅 Hours Calendar" button in the top right
4. Use Previous/Next buttons to navigate between months

## Data Structure

### Enhanced Schedule Data Format (with Billing Status)
```javascript
{
  staffId: {
    day: {
      billedAssigned: 6,       // Hours pre-billed and assigned
      billedCompleted: 5,      // Hours pre-billed and completed
      unbilledAssigned: 2,     // Hours assigned but not billed
      unbilledCompleted: 3,    // Hours completed but not billed (ready to bill)
      totalAssigned: 8,        // Total hours assigned (billed + unbilled)
      totalCompleted: 8,       // Total hours completed (billed + unbilled)
      variance: 0,             // Overall variance (completed - assigned)
      unbilledVariance: 1,     // Unbilled variance (unbilled completed - unbilled assigned)
      hours: [                 // Hourly breakdown (9 AM - 5 PM)
        {
          hour: 9,
          assigned: true,
          completed: true,
          status: 'completed' | 'pending' | 'unassigned',
          billingStatus: 'billed' | 'unbilled',
          combinedStatus: 'billed-completed' | 'billed-assigned' | 
                         'unbilled-completed' | 'unbilled-assigned' | 'unassigned'
        },
        // ... more hours (8 slots total)
      ]
    }
  }
}
```

## Visual Elements

### Enhanced Legend (5 States)
- **🔵 Billed/Completed**: Dark blue - Revenue secured and work delivered
- **🔷 Billed/Assigned**: Light blue - Revenue secured, work in progress
- **🟢 Unbilled/Completed**: Green - Work finished, ready to invoice
- **🟡 Unbilled/Assigned**: Yellow - Work scheduled, not yet completed or billed
- **⚪ Unassigned**: Gray - No work scheduled

### Enhanced Calendar Cell Layout
```
┌─────────────────────┐
│ 15          +2      │ ← Day number & Overall variance
│ ████████████        │ ← 8 hourly slots (5-color coded)
│ BA: 6h    BC: 5h    │ ← Billed Assigned | Billed Completed
│ UA: 2h    UC: 3h    │ ← Unbilled Assigned | Unbilled Completed
│      V: +1h         │ ← Unbilled Variance (for next billing)
└─────────────────────┘
```

## Mock Data Generation
The system currently uses `generateStaffSchedule()` to create realistic mock data:
- **Weekdays**: 8 hours assigned (standard workday, 9 AM - 5 PM)
- **Weekends**: 0 hours (no work)
- **Variance**: Random -2 to +2 hours per day
- **Billing Logic**: 
  - Past dates: 70% of hours are marked as billed (already invoiced)
  - Current/Future dates: All hours marked as unbilled (pending next billing cycle)
- **Hourly slots**: 8 slots representing 9 AM to 5 PM

## Multi-Client Support ✅ NEW!
The calendar now supports staff members working with multiple clients. See `MULTI_CLIENT_CALENDAR_FEATURE.md` for complete details.

**Key Features:**
- Staff can be assigned to multiple clients with different rates
- Filter calendar by specific client or view all clients
- Per-client hour breakdown in calendar and summary
- Automatic hour distribution across clients

**To Use:**
- Use the "Filter by Client" dropdown in the calendar view
- Select "All Clients" to see combined hours with per-client breakdowns
- Select a specific client to see only that client's hours

## Hour Assignment Feature ✅ NEW!
HR managers can now manually assign hours to staff! See `HOUR_ASSIGNMENT_FEATURE.md` for complete details.

**Key Features:**
- Click any calendar day to assign specific hours to specific clients
- Hour-by-hour selection (9 AM - 4 PM)
- Multi-client assignments per day
- Billing status management (billed/unbilled)
- Visual indicators for assigned days

**To Use:**
- Click any day cell in the calendar
- Select client, hours, and billing status  
- Click "Save Assignments"
- Day shows green ring and checkmark when assigned

## Future Enhancements
1. **Real-time Data**: Connect to Firebase/backend for actual timesheet data
2. **Drill-down**: Click on a day to see detailed hourly breakdown
3. **Export**: Generate PDF reports of monthly hours
4. ~~**Filters**: Filter by client, project, or variance threshold~~ ✅ **COMPLETED** (Multi-client filtering)
5. **Pre-billed vs To-be-billed**: Add billing cycle tracking
6. **Week View**: Toggle between monthly and weekly views
7. **Hover Details**: Show more information on hover over hourly slots
8. **Client Assignment UI**: Interface to manage staff-client assignments

## Technical Implementation

### Key Components
- `StaffManagement.jsx`: Main component
- `generateStaffSchedule()`: Generates mock schedule data
- `getCalendarData`: Computes calendar grid layout
- State management for month navigation and view switching

### Dependencies
- React hooks: `useState`, `useEffect`, `useMemo`
- Tailwind CSS for styling
- No external calendar libraries

## Benefits

### Revenue Management
1. **Billing Status Visibility**: Instantly see which hours are already billed vs pending
2. **Next Cycle Planning**: Identify unbilled completed work ready for next invoice
3. **Revenue Recognition**: Track pre-billed hours vs actual delivery
4. **Cash Flow Forecasting**: Understand upcoming billable work completion

### Operational Excellence
5. **Granular Hour Tracking**: Hour-by-hour visibility of work assignments and completion
6. **Variance Analysis**: Separate overall variance from unbilled variance for better decision-making
7. **Resource Optimization**: Plan future assignments based on billed/unbilled capacity
8. **Performance Monitoring**: Track staff productivity against both billed and unbilled commitments

### Financial Accuracy
9. **Billing Cycle Management**: Clear distinction between current and future billing cycles
10. **Revenue Leakage Prevention**: Identify completed unbilled work to prevent revenue loss
11. **Client Relationship**: Balance pre-billed commitments vs actual delivery
12. **Audit Trail**: Color-coded visual proof of work assigned, completed, and billed status

