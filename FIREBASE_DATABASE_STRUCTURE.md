# Firebase Database Structure for HR Functionality

## Database Hierarchy

```
📁 Firebase Project: variance-tracker
  └─ 🔵 Firestore Database
      ├─ 📁 Collection: users (Authentication & Profiles)
      ├─ 📁 Collection: staff (Staff Members)
      ├─ 📁 Collection: clients (Clients)
      ├─ 📁 Collection: timeEntries (Time Tracking)
      ├─ 📁 Collection: hourAssignments (Daily Hour Assignments)
      ├─ 📁 Collection: staffAssignments (Staff-to-Client Assignments)
      ├─ 📁 Collection: staffHours (Monthly Billing Summary)
      ├─ 📁 Collection: invoices (Client Invoices)
      └─ 📁 Collection: varianceReports (Variance Reports)
```

---

## 1. COLLECTION: `users`
**Purpose**: Authentication and user profiles

### Document Structure:
```javascript
users/{userId}
{
  // Authentication fields
  uid: "abc123xyz",
  email: "alice.johnson@company.com",
  displayName: "Alice Johnson",
  
  // Role & permissions
  role: "staff", // "staff" | "hr"
  permissions: ["view_own", "submit_timesheet"], // For staff
  department: "Engineering", // Optional
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLogin: Timestamp
}
```

### Subcollections:
- None (flat structure)

### Example Document:
```javascript
users/abc123xyz
```

---

## 2. COLLECTION: `staff`
**Purpose**: Staff member profiles and details

### Document Structure:
```javascript
staff/{staffId}  // staffId = user's uid
{
  // Basic Info
  staffId: "abc123xyz",
  name: "Alice Johnson",
  email: "alice.johnson@company.com",
  
  // Financial
  rate: 45, // default hourly rate
  clients: [
    { 
      name: "Acme Corp", 
      rate: 45,
      startDate: Timestamp,
      endDate: Timestamp // null if active
    },
    { 
      name: "Globex", 
      rate: 40,
      startDate: Timestamp,
      endDate: Timestamp
    }
  ],
  primaryClient: "Acme Corp", // for backward compatibility
  
  // Status
  status: "active", // "active" | "inactive" | "pending"
  employmentType: "full-time", // "full-time" | "part-time" | "contractor"
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- **`timeEntries`** - Time entries for this staff
- **`assignments`** - Client assignments for this staff
- **`hoursSummary`** - Monthly summary for this staff

### Example Documents:
```javascript
staff/abc123xyz
  ├─ staff/abc123xyz/timeEntries/{entryId}
  ├─ staff/abc123xyz/assignments/{assignmentId}
  └─ staff/abc123xyz/hoursSummary/{summaryId}
```

---

## 3. COLLECTION: `clients`
**Purpose**: Client/customer information

### Document Structure:
```javascript
clients/{clientId}
{
  // Basic Info
  clientId: "client1",
  name: "Acme Corp",
  
  // Contact
  contactInfo: {
    email: "contact@acme.com",
    phone: "+1-555-0123",
    address: "123 Main St, City, ST 12345",
    contactPerson: "John Doe",
    contactPhone: "+1-555-0124"
  },
  
  // Status
  status: "active", // "active" | "inactive" | "prospect"
  
  // Metrics
  totalHours: 315,
  totalRevenue: 14175,
  satisfaction: 4.8, // rating out of 5
  avgVariance: -2.5,
  
  // Settings
  billingCycle: "monthly", // "monthly" | "weekly" | "bi-weekly"
  invoiceEmail: "billing@acme.com",
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- **`staffMembers`** - Staff assigned to this client
- **`invoices`** - Invoices for this client
- **`assignments`** - All assignments for this client

### Example Documents:
```javascript
clients/client1
  ├─ clients/client1/staffMembers/{staffId}
  ├─ clients/client1/invoices/{invoiceId}
  └─ clients/client1/assignments/{assignmentId}
```

---

## 4. COLLECTION: `timeEntries`
**Purpose**: Individual time clock entries

### Document Structure:
```javascript
timeEntries/{entryId}
{
  // References
  entryId: "entry_abc123_2024-01-15_0",
  staffId: "abc123xyz",
  client: "Acme Corp",
  
  // Time Data
  date: "2024-01-15", // YYYY-MM-DD
  startTime: Timestamp,
  endTime: Timestamp,
  
  // Duration (in seconds)
  totalTime: 14400,    // 4 hours
  breakTime: 1800,     // 30 minutes
  workTime: 12600,     // 3.5 hours
  
  // Details
  notes: "Worked on API integration",
  task: "Development", // Optional
  approved: false,
  approvedBy: null,
  approvedAt: null,
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- None (flat structure)

### Example Documents:
```javascript
timeEntries/entry_abc123_2024-01-15_0
timeEntries/entry_abc123_2024-01-15_1
timeEntries/entry_abc123_2024-01-16_0
```

---

## 5. COLLECTION: `hourAssignments`
**Purpose**: Daily hour assignments and breakdowns

### Document Structure:
```javascript
hourAssignments/{assignmentId}  // format: staffId_date
{
  // Identifier
  assignmentId: "abc123xyz_2024-01-15",
  staffId: "abc123xyz",
  date: "2024-01-15",
  
  // Hour Breakdown
  hourBreakdown: {
    billedAssigned: 6,      // Hours pre-billed & assigned
    billedCompleted: 8,     // Hours pre-billed & completed
    unbilledAssigned: 2,    // Hours assigned but not billed
    unbilledCompleted: 0    // Hours completed but not billed
  },
  
  // Per-client breakdown
  byClient: {
    "Acme Corp": {
      billedAssigned: 4,
      billedCompleted: 6,
      unbilledAssigned: 0,
      unbilledCompleted: 0,
      rate: 45
    },
    "Globex": {
      billedAssigned: 2,
      billedCompleted: 2,
      unbilledAssigned: 2,
      unbilledCompleted: 0,
      rate: 40
    }
  },
  
  // Calculations
  totalAssigned: 8,        // billedAssigned + unbilledAssigned
  totalCompleted: 8,       // billedCompleted + unbilledCompleted
  variance: 0,             // totalCompleted - totalAssigned
  unbilledVariance: -2,   // unbilledCompleted - unbilledAssigned
  
  // Metadata
  lastModified: Timestamp,
  modifiedBy: "hr_user_id",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- None (flat structure)

### Example Documents:
```javascript
hourAssignments/abc123xyz_2024-01-15
hourAssignments/abc123xyz_2024-01-16
hourAssignments/def456abc_2024-01-15
```

---

## 6. COLLECTION: `staffAssignments`
**Purpose**: Staff-to-client assignment relationships

### Document Structure:
```javascript
staffAssignments/{assignmentId}
{
  // Identifiers
  assignmentId: "assign_abc123_client1",
  staffId: "abc123xyz",
  clientId: "client1",
  
  // Assignment Details
  role: "Senior Developer",
  hourlyRate: 45,
  startDate: Timestamp,
  endDate: null, // null if ongoing
  
  // Status
  status: "active", // "active" | "completed" | "cancelled"
  
  // Billing
  billingStatus: "unbilled", // "unbilled" | "billed" | "invoiced"
  totalHours: 160,
  totalRevenue: 7200,
  
  // Notes
  notes: "Primary assignment for Q1 2024",
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- **`hours`** - Hours worked per period for this assignment
- **`timeEntries`** - Time entries for this specific assignment

### Example Documents:
```javascript
staffAssignments/assign_abc123_client1
  ├─ staffAssignments/assign_abc123_client1/hours/{hoursId}
  └─ staffAssignments/assign_abc123_client1/timeEntries/{entryId}
```

---

## 7. COLLECTION: `staffHours`
**Purpose**: Monthly billing summary per staff member

### Document Structure:
```javascript
staffHours/{recordId}
{
  // Identifiers
  recordId: "staffhours_abc123_2024_01",
  staffId: "abc123xyz",
  month: 1,
  year: 2024,
  
  // Hours Summary
  billedHours: 160,
  actualHours: 150,
  variance: -10, // actual - billed
  
  // Financial
  revenue: 6750, // actualHours * rate
  rate: 45,
  
  // Breakdown by client
  byClient: {
    "Acme Corp": {
      hours: 100,
      rate: 45,
      revenue: 4500,
      variance: -5
    },
    "Globex": {
      hours: 50,
      rate: 45,
      revenue: 2250,
      variance: -5
    }
  },
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- None (flat structure)

### Example Documents:
```javascript
staffHours/staffhours_abc123_2024_01
staffHours/staffhours_abc123_2024_02
staffHours/staffhours_def456_2024_01
```

---

## 8. COLLECTION: `invoices`
**Purpose**: Client invoice records

### Document Structure:
```javascript
invoices/{invoiceId}
{
  // Invoice Info
  invoiceId: "inv_2024_001",
  invoiceNumber: "INV-2024-001",
  clientId: "client1",
  clientName: "Acme Corp",
  
  // Billing Period
  billingPeriod: "2024-01",
  startDate: Timestamp,
  endDate: Timestamp,
  
  // Financial
  totalHours: 160,
  totalAmount: 7200,
  subtotal: 7200,
  tax: 576, // 8%
  total: 7776,
  
  // Staff Breakdown
  staffBreakdown: [
    {
      staffId: "abc123xyz",
      staffName: "Alice Johnson",
      hours: 80,
      rate: 45,
      amount: 3600
    },
    {
      staffId: "def456abc",
      staffName: "Bob Smith",
      hours: 80,
      rate: 42,
      amount: 3360
    }
  ],
  
  // Status
  status: "sent", // "draft" | "sent" | "paid" | "overdue" | "cancelled"
  
  // Dates
  issuedDate: Timestamp,
  dueDate: Timestamp,
  paidDate: null,
  
  // Notes
  notes: "Monthly billing - January 2024",
  paymentMethod: null,
  
  // Metadata
  createdBy: "hr_user_id",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- **`lineItems`** - Detailed line items
- **`payments`** - Payment records

### Example Documents:
```javascript
invoices/inv_2024_001
  ├─ invoices/inv_2024_001/lineItems/{itemId}
  └─ invoices/inv_2024_001/payments/{paymentId}
```

---

## 9. COLLECTION: `varianceReports`
**Purpose**: Variance analysis reports

### Document Structure:
```javascript
varianceReports/{reportId}
{
  // Report Info
  reportId: "variance_2024_01",
  month: 1,
  year: 2024,
  reportType: "monthly", // "weekly" | "monthly" | "yearly"
  
  // Overall Summary
  totalBilledHours: 480,
  totalActualHours: 495,
  totalVariance: 15, // hours
  totalMonetary: 675, // dollars
  
  // Staff Breakdown
  staffBreakdown: [
    {
      staffId: "abc123xyz",
      name: "Alice Johnson",
      billedHours: 160,
      actualHours: 150,
      variance: -10,
      monetary: -450,
      rate: 45
    }
  ],
  
  // Client Breakdown
  clientBreakdown: [
    {
      clientId: "client1",
      name: "Acme Corp",
      totalVariance: -5,
      totalMonetary: -225,
      staffCount: 2,
      avgVariance: -2.5
    }
  ],
  
  // Alerts
  alerts: [
    {
      type: "warning",
      message: "Alice Johnson has exceeded billed hours",
      staffId: "abc123xyz",
      variance: 10
    }
  ],
  
  // Metadata
  createdBy: "hr_user_id",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollections:
- **`details`** - Detailed variance analysis

### Example Documents:
```javascript
varianceReports/variance_2024_01
  └─ varianceReports/variance_2024_01/details/{detailId}
```

---

## Complete Hierarchical Structure

```
📁 Firebase Project: variance-tracker
  └─ 🔵 Firestore Database
    
    // Top-Level Collections
    ├─ 📁 users
    │   └─ 📄 {userId}
    │
    ├─ 📁 staff
    │   └─ 📄 {staffId}
    │       ├─ 📁 timeEntries
    │       │   └─ 📄 {entryId}
    │       ├─ 📁 assignments
    │       │   └─ 📄 {assignmentId}
    │       └─ 📁 hoursSummary
    │           └─ 📄 {summaryId}
    │
    ├─ 📁 clients
    │   └─ 📄 {clientId}
    │       ├─ 📁 staffMembers
    │       │   └─ 📄 {staffId}
    │       ├─ 📁 invoices
    │       │   └─ 📄 {invoiceId}
    │       │       ├─ 📁 lineItems
    │       │       │   └─ 📄 {itemId}
    │       │       └─ 📁 payments
    │       │           └─ 📄 {paymentId}
    │       └─ 📁 assignments
    │           └─ 📄 {assignmentId}
    │
    ├─ 📁 timeEntries
    │   └─ 📄 {entryId}
    │
    ├─ 📁 hourAssignments
    │   └─ 📄 {assignmentId}
    │
    ├─ 📁 staffAssignments
    │   └─ 📄 {assignmentId}
    │       ├─ 📁 hours
    │       │   └─ 📄 {hoursId}
    │       └─ 📁 timeEntries
    │           └─ 📄 {entryId}
    │
    ├─ 📁 staffHours
    │   └─ 📄 {recordId}
    │
    ├─ 📁 invoices
    │   └─ 📄 {invoiceId}
    │       ├─ 📁 lineItems
    │       │   └─ 📄 {itemId}
    │       └─ 📁 payments
    │           └─ 📄 {paymentId}
    │
    └─ 📁 varianceReports
        └─ 📄 {reportId}
            └─ 📁 details
                └─ 📄 {detailId}
```

---

## Summary

### Top-Level Collections (9):
1. `users` - User authentication
2. `staff` - Staff profiles
3. `clients` - Client information
4. `timeEntries` - Time tracking
5. `hourAssignments` - Daily hour assignments
6. `staffAssignments` - Staff-client relationships
7. `staffHours` - Monthly summaries
8. `invoices` - Invoice records
9. `varianceReports` - Variance analysis

### Subcollections (7):
1. `staff/{id}/timeEntries`
2. `staff/{id}/assignments`
3. `staff/{id}/hoursSummary`
4. `clients/{id}/staffMembers`
5. `clients/{id}/invoices`
6. `clients/{id}/assignments`
7. `invoices/{id}/lineItems`
8. `invoices/{id}/payments`
9. `staffAssignments/{id}/hours`
10. `staffAssignments/{id}/timeEntries`
11. `varianceReports/{id}/details`

### Total Structure:
- **9 Collections** at top level
- **11 Subcollections** nested under documents
- Documents contain flexible JSON data
- No rigid schema - fields can vary per document

