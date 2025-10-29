# Firebase Firestore Collections Structure

## Overview
Firebase Firestore is a NoSQL document database. Data is organized into **Collections** (like folders) and **Documents** (like files in folders).

---

## Collections Structure

### 1. `users` Collection
**Purpose**: User authentication and profile data

**Document Structure**:
```javascript
users/{userId}
{
  uid: "abc123",
  email: "alice@company.com",
  displayName: "Alice Johnson",
  role: "staff", // or "hr"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Needed**:
- `email` (unique)

---

### 2. `staff` Collection
**Purpose**: Staff member profiles and details

**Document Structure**:
```javascript
staff/{staffId}
{
  staffId: "abc123", // References users.uid
  name: "Alice Johnson",
  email: "alice@company.com",
  rate: 45, // default hourly rate
  clients: [
    { name: "Acme Corp", rate: 45 },
    { name: "Globex", rate: 40 }
  ],
  primaryClient: "Acme Corp",
  status: "active", // active, inactive, pending
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Needed**:
- `staffId` (unique)
- `email`
- `status`

**Queries**:
```javascript
// Get all active staff
query(collection(db, 'staff'), where('status', '==', 'active'))

// Get staff by client
// Filter by clients array containing client name
```

---

### 3. `clients` Collection
**Purpose**: Client/customer information

**Document Structure**:
```javascript
clients/{clientId}
{
  clientId: "client1",
  name: "Acme Corp",
  status: "active", // active, inactive
  contactInfo: {
    email: "contact@acme.com",
    phone: "+1-555-0123"
  },
  totalHours: 315,
  totalRevenue: 14175,
  satisfaction: 4.8,
  avgVariance: -2.5,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Needed**:
- `name`
- `status`

---

### 4. `timeEntries` Collection
**Purpose**: Individual time clock entries

**Document Structure**:
```javascript
timeEntries/{entryId}
{
  entryId: "entry1",
  staffId: "abc123",
  client: "Acme Corp",
  date: "2024-01-15", // YYYY-MM-DD format
  startTime: Timestamp,
  endTime: Timestamp,
  totalTime: 14400, // seconds (4 hours)
  breakTime: 1800,  // seconds (30 minutes)
  workTime: 12600,  // seconds (3.5 hours)
  notes: "Worked on API integration",
  createdAt: Timestamp
}
```

**Indexes Needed**:
- `staffId` + `date` (compound)
- `staffId` + `date` + `client`
- `date`

**Queries**:
```javascript
// Get staff entries for a date range
query(
  collection(db, 'timeEntries'),
  where('staffId', '==', staffId),
  where('date', '>=', startDate),
  where('date', '<=', endDate),
  orderBy('date', 'desc')
)
```

---

### 5. `hourAssignments` Collection
**Purpose**: Daily hour assignments and breakdowns

**Document Structure**:
```javascript
hourAssignments/{assignmentId} // format: staffId_date (e.g., "abc123_2024-01-15")
{
  staffId: "abc123",
  date: "2024-01-15",
  hourBreakdown: {
    billedAssigned: 6,
    billedCompleted: 8,
    unbilledAssigned: 2,
    unbilledCompleted: 0
  },
  lastModified: Timestamp,
  createdAt: Timestamp
}
```

**Indexes Needed**:
- `staffId` + `date` (compound)

**Queries**:
```javascript
// Get all assignments for a staff member in a month
query(
  collection(db, 'hourAssignments'),
  where('staffId', '==', staffId),
  where('date', '>=', '2024-01-01'),
  where('date', '<=', '2024-01-31')
)
```

---

### 6. `staffAssignments` Collection
**Purpose**: Staff-to-client assignment relationships

**Document Structure**:
```javascript
staffAssignments/{assignmentId}
{
  assignmentId: "assign1",
  staffId: "abc123",
  clientId: "client1",
  role: "Developer",
  hourlyRate: 45,
  startDate: Timestamp,
  endDate: null, // null if ongoing
  status: "active", // active, completed, cancelled
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Needed**:
- `staffId` + `status` (compound)
- `clientId` + `status` (compound)

---

### 7. `staffHours` Collection
**Purpose**: Monthly billing summary per staff member

**Document Structure**:
```javascript
staffHours/{recordId}
{
  staffId: "abc123",
  month: 1,
  year: 2024,
  billedHours: 160,
  actualHours: 150,
  variance: -10, // actual - billed
  revenue: 6750, // actualHours * rate
  rate: 45,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Needed**:
- `staffId` + `year` + `month` (compound)
- `year` + `month`

---

### 8. `invoices` Collection
**Purpose**: Client invoice records

**Document Structure**:
```javascript
invoices/{invoiceId}
{
  invoiceId: "inv1",
  invoiceNumber: "INV-2024-001",
  clientId: "client1",
  clientName: "Acme Corp",
  billingPeriod: "2024-01",
  totalHours: 160,
  totalAmount: 7200,
  staffBreakdown: [
    {
      staffId: "abc123",
      staffName: "Alice Johnson",
      hours: 80,
      rate: 45,
      amount: 3600
    }
  ],
  status: "sent", // draft, sent, paid, overdue
  dueDate: Timestamp,
  paidDate: null,
  notes: "Monthly billing",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Needed**:
- `clientId` + `status`
- `status` + `createdAt`
- `billingPeriod`

---

### 9. `varianceReports` Collection
**Purpose**: Variance analysis reports

**Document Structure**:
```javascript
varianceReports/{reportId}
{
  reportId: "report1",
  month: 1,
  year: 2024,
  totalVariance: 15, // hours
  totalMonetary: 675, // dollars
  staffBreakdown: [
    {
      staffId: "abc123",
      name: "Alice Johnson",
      billed: 160,
      actual: 150,
      variance: -10,
      monetary: -450
    }
  ],
  clientBreakdown: [
    {
      clientId: "client1",
      name: "Acme Corp",
      totalVariance: -5,
      staffCount: 2
    }
  ],
  createdAt: Timestamp
}
```

**Indexes Needed**:
- `year` + `month` (compound)

---

## Firebase Firestore Indexes Setup

### Required Composite Indexes

Create these in Firebase Console under Firestore > Indexes:

1. **timeEntries**: `staffId` (Ascending) + `date` (Ascending)
2. **timeEntries**: `staffId` (Ascending) + `date` (Ascending) + `client` (Ascending)
3. **hourAssignments**: `staffId` (Ascending) + `date` (Ascending)
4. **staffAssignments**: `staffId` (Ascending) + `status` (Ascending)
5. **staffAssignments**: `clientId` (Ascending) + `status` (Ascending)
6. **staffHours**: `staffId` (Ascending) + `year` (Ascending) + `month` (Ascending)
7. **invoices**: `clientId` (Ascending) + `status` (Ascending)
8. **invoices**: `status` (Ascending) + `createdAt` (Descending)

---

## Query Examples

### Get Staff Member's Time Entries for Current Week
```javascript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const startDate = '2024-01-08';
const endDate = '2024-01-14';

const q = query(
  collection(db, 'timeEntries'),
  where('staffId', '==', 'abc123'),
  where('date', '>=', startDate),
  where('date', '<=', endDate),
  orderBy('date', 'desc')
);

const querySnapshot = await getDocs(q);
const entries = querySnapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get Month's Hour Assignments for Staff
```javascript
const q = query(
  collection(db, 'hourAssignments'),
  where('staffId', '==', 'abc123'),
  where('date', '>=', '2024-01-01'),
  where('date', '<=', '2024-01-31')
);

const snapshot = await getDocs(q);
```

### Get Active Staff for a Client
```javascript
const q = query(
  collection(db, 'staffAssignments'),
  where('clientId', '==', 'client1'),
  where('status', '==', 'active')
);

const snapshot = await getDocs(q);
```

---

## Benefits of NoSQL Structure

1. **Flexible Schema**: Add new fields without migrations
2. **Scalable**: Handles growth automatically
3. **Real-time**: Built-in subscription capabilities
4. **Document-based**: Store related data together
5. **Subcollections**: Can nest data hierarchically (e.g., `staff/{id}/timeEntries/{entryId}`)

---

## Migration Path

Currently using mock data. To migrate:

1. Create collections in Firebase Console
2. Create indexes
3. Update component data fetching to use Firebase hooks
4. Implement real-time subscriptions for live updates
5. Add offline persistence support

