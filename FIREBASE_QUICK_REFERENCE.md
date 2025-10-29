# Firebase Structure - Quick Reference

## 📊 Structure Overview

```
📁 Firebase Project: variance-tracker
  └─ 🔵 Firestore Database
      ├─ 📁 users
      ├─ 📁 staff
      ├─ 📁 clients
      ├─ 📁 timeEntries
      ├─ 📁 hourAssignments
      ├─ 📁 staffAssignments
      ├─ 📁 staffHours
      ├─ 📁 invoices
      └─ 📁 varianceReports
```

---

## 📋 Collections Breakdown

### 1️⃣ `users`
**What**: Authentication & user profiles  
**Documents**: User accounts (HR and Staff)  
**Subcollections**: None

### 2️⃣ `staff`
**What**: Staff member profiles  
**Documents**: Individual staff members  
**Subcollections**: 
- `timeEntries` - Time entries for this staff
- `assignments` - Assignments for this staff
- `hoursSummary` - Monthly summaries

### 3️⃣ `clients`
**What**: Client/customer information  
**Documents**: Individual clients  
**Subcollections**:
- `staffMembers` - Staff assigned to client
- `invoices` - Invoices for client
- `assignments` - All assignments

### 4️⃣ `timeEntries`
**What**: Time clock entries  
**Documents**: Individual time entries  
**Subcollections**: None

### 5️⃣ `hourAssignments`
**What**: Daily hour assignments  
**Documents**: Daily breakdowns (staffId_date format)  
**Subcollections**: None

### 6️⃣ `staffAssignments`
**What**: Staff-to-client assignments  
**Documents**: Individual assignments  
**Subcollections**:
- `hours` - Hours worked per period
- `timeEntries` - Time entries for assignment

### 7️⃣ `staffHours`
**What**: Monthly billing summaries  
**Documents**: Monthly records per staff  
**Subcollections**: None

### 8️⃣ `invoices`
**What**: Client invoice records  
**Documents**: Individual invoices  
**Subcollections**:
- `lineItems` - Invoice line items
- `payments` - Payment records

### 9️⃣ `varianceReports`
**What**: Variance analysis reports  
**Documents**: Individual reports  
**Subcollections**:
- `details` - Detailed variance analysis

---

## 🎯 Document ID Conventions

| Collection | Document ID Format | Example |
|------------|-------------------|---------|
| `users` | `{userId}` (uid) | `abc123xyz` |
| `staff` | `{staffId}` (uid) | `abc123xyz` |
| `clients` | `{clientId}` | `client1` |
| `timeEntries` | `entry_{staffId}_{date}_{index}` | `entry_abc123_2024-01-15_0` |
| `hourAssignments` | `{staffId}_{date}` | `abc123xyz_2024-01-15` |
| `staffAssignments` | `assign_{staffId}_{clientId}` | `assign_abc123_client1` |
| `staffHours` | `staffhours_{staffId}_{year}_{month}` | `staffhours_abc123_2024_01` |
| `invoices` | `inv_{year}_{number}` | `inv_2024_001` |
| `varianceReports` | `variance_{year}_{month}` | `variance_2024_01` |

---

## 📊 Data Flow

### Staff Time Tracking Flow:
```
1. Staff clock in/out → timeEntries collection
2. Time entry creates → staff/{staffId}/timeEntries subcollection
3. Daily processing → hourAssignments collection
4. Monthly summary → staffHours collection
5. Invoice generation → invoices collection
```

### HR Management Flow:
```
1. Create staff → staff collection
2. Assign to clients → staffAssignments collection
3. Monitor hours → hourAssignments collection
4. Generate reports → varianceReports collection
5. Create invoices → invoices collection
```

---

## 🔍 Common Queries

### Get All Staff for a Client
```javascript
collection(db, 'staffAssignments')
  .where('clientId', '==', 'client1')
  .where('status', '==', 'active')
```

### Get Staff Time Entries for a Month
```javascript
collection(db, 'timeEntries')
  .where('staffId', '==', 'abc123xyz')
  .where('date', '>=', '2024-01-01')
  .where('date', '<=', '2024-01-31')
```

### Get Month's Hour Assignments
```javascript
collection(db, 'hourAssignments')
  .where('date', '>=', '2024-01-01')
  .where('date', '<=', '2024-01-31')
```

### Get Monthly Staff Summary
```javascript
collection(db, 'staffHours')
  .where('staffId', '==', 'abc123xyz')
  .where('year', '==', 2024)
  .where('month', '==', 1)
```

---

## 🚀 Getting Started

### 1. Create Collections in Firebase Console
Go to Firestore Database and create all 9 collections.

### 2. Set Up Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Staff can read their own staff document
    match /staff/{staffId} {
      allow read: if request.auth.uid == staffId;
      allow write: if request.auth.token.role == 'hr';
    }
    
    // Time entries: staff can read/write their own, HR can read all
    match /timeEntries/{entryId} {
      allow read: if request.auth.uid == resource.data.staffId 
                  || request.auth.token.role == 'hr';
      allow write: if request.auth.uid == resource.data.staffId;
    }
    
    // HR only collections
    match /hourAssignments/{doc} {
      allow read, write: if request.auth.token.role == 'hr';
    }
    
    match /staffAssignments/{doc} {
      allow read, write: if request.auth.token.role == 'hr';
    }
    
    match /invoices/{doc} {
      allow read, write: if request.auth.token.role == 'hr';
    }
    
    match /varianceReports/{doc} {
      allow read, write: if request.auth.token.role == 'hr';
    }
  }
}
```

### 3. Create Indexes
Create composite indexes for efficient queries (see main structure document).

### 4. Initialize Data
Start with:
- Creating users through authentication
- Adding clients
- Assigning staff to clients
- Allowing staff to track time

---

## 📈 Next Steps

1. ✅ Review collection structure
2. ✅ Set up Firebase project
3. ✅ Configure security rules
4. ✅ Create composite indexes
5. ✅ Update React components to use real data
6. ✅ Implement real-time listeners
7. ✅ Add offline persistence
8. ✅ Test with real data

