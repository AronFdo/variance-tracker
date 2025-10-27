# Staff Registration & Authentication System

## Overview
A comprehensive staff registration and authentication system integrated with Firebase Authentication and Firestore. Staff members can self-register with detailed profiles, and the system stores all data in the Firestore `users` collection.

## Features

### 1. **Staff Registration**
Self-service registration portal for new staff members with comprehensive profile data.

#### Registration Fields:
- **Full Name**: Staff member's display name
- **Email**: Unique email address (used for authentication)
- **Password**: Minimum 6 characters (Firebase requirement)
- **Confirm Password**: Must match password
- **Phone Number**: Contact phone number
- **Hourly Rate**: Default rate ($10-$500 range)
- **Client Assignments**: Multi-select checkboxes for initial client assignments (optional)

### 2. **Firebase Integration**
- **Authentication**: Firebase Auth for secure sign-up and sign-in
- **Data Storage**: All staff profiles stored in Firestore `users` collection
- **Real-time Sync**: Profile data syncs across the application

### 3. **Staff Sign-In**
- Email and password authentication
- Role verification (staff-only access to staff portal)
- Automatic profile loading from Firestore
- Session management

### 4. **Security Features**
- Password validation (minimum 6 characters)
- Email validation
- Role-based access control
- Automatic logout for non-staff accounts
- Firebase security rules enforcement

## User Flow

### Registration Process

```
1. Visit Staff Portal (/staff)
2. Click "Sign up"
3. Fill in registration form:
   - Full Name
   - Email
   - Password & Confirm Password
   - Phone Number
   - Hourly Rate (default: $40)
   - Select Client Assignments (optional)
4. Click "Create account"
5. System creates:
   - Firebase Auth account
   - Firestore user profile in 'users' collection
6. Status: "Pending" (awaits HR approval)
7. Redirect to Staff Dashboard
```

### Sign-In Process

```
1. Visit Staff Portal (/staff)
2. Enter email and password
3. Click "Sign in"
4. System:
   - Authenticates with Firebase
   - Loads profile from Firestore
   - Verifies role === 'staff'
5. Redirect to Staff Dashboard
```

## Data Structure

### Firestore `users` Collection

**Document ID**: Firebase Auth UID

**Document Structure**:
```javascript
{
  uid: "firebase-auth-uid",
  email: "staff@example.com",
  displayName: "John Doe",
  name: "John Doe", // Compatibility field
  phone: "(555) 123-4567",
  role: "staff", // Always 'staff' for staff portal registrations
  
  // Client assignments
  clients: [
    {
      name: "Acme Corp",
      rate: 45 // Can have different rates per client
    },
    {
      name: "Globex",
      rate: 42
    }
  ],
  
  // Default rate
  rate: 40,
  
  // Status
  status: "pending", // pending | active | inactive
  
  // Compatibility fields
  project: "Acme Corp", // Primary client
  billedHours: 0,
  actualHours: 0,
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Staff Status Types

- **pending**: Newly registered, awaiting HR approval
- **active**: Approved by HR, full access
- **inactive**: Deactivated, no access

## Validation Rules

### Registration Validation

1. **Full Name**: Required, non-empty
2. **Email**: Valid email format, unique
3. **Password**: 
   - Minimum 6 characters
   - Must match confirmation
4. **Phone Number**: Required
5. **Hourly Rate**: 
   - Required
   - Between $10 and $500
   - Decimal values allowed

### Sign-In Validation

1. **Email**: Required, valid format
2. **Password**: Required
3. **Role Check**: Must be 'staff' role
4. **Account Status**: Profile must exist in Firestore

## UI Components

### Registration Form

```
┌──────────────────────────────────────┐
│  Staff Time Tracking                 │
│  Join Our Team                       │
├──────────────────────────────────────┤
│  Full Name:                          │
│  [____________________]              │
│                                      │
│  Email address:                      │
│  [____________________]              │
│                                      │
│  Password:                           │
│  [____________________]              │
│                                      │
│  Confirm Password:                   │
│  [____________________]              │
│                                      │
│  Phone Number:                       │
│  [____________________]              │
│                                      │
│  Hourly Rate ($):                    │
│  [____________________]              │
│  Your expected hourly rate           │
│                                      │
│  Client Assignments (Optional)       │
│  ┌──────────────────────────────┐   │
│  │ ☐ Acme Corp                  │   │
│  │ ☐ Globex                     │   │
│  │ ☐ Initech                    │   │
│  │ ☐ TechCorp                   │   │
│  │ ☐ InnovateCo                 │   │
│  │ ☐ DataSystems                │   │
│  └──────────────────────────────┘   │
│  Select clients you'll be working    │
│  with (can be assigned by HR later)  │
│                                      │
│  [Create account]                    │
│                                      │
│  Already have an account? Sign in    │
└──────────────────────────────────────┘
```

### Sign-In Form

```
┌──────────────────────────────────────┐
│  Staff Time Tracking                 │
│  Sign in to track your hours         │
├──────────────────────────────────────┤
│  Email address:                      │
│  [____________________]              │
│                                      │
│  Password:                           │
│  [____________________]              │
│                                      │
│  [Sign in]                           │
│                                      │
│  Don't have an account? Sign up      │
└──────────────────────────────────────┘
```

## Error Handling

### Firebase Error Codes

| Error Code | User Message | Action |
|------------|-------------|---------|
| `auth/user-not-found` | "No account found with this email address" | Check email or sign up |
| `auth/wrong-password` | "Incorrect password" | Try again or reset password |
| `auth/email-already-in-use` | "An account with this email already exists" | Sign in instead |
| `auth/weak-password` | "Password is too weak" | Use stronger password |
| `auth/invalid-email` | "Invalid email address" | Check email format |
| `auth/network-request-failed` | "Network error. Please check your connection" | Check internet |

### Custom Validation Errors

- "Please enter your full name"
- "Passwords do not match"
- "Password must be at least 6 characters long"
- "Please enter your phone number"
- "Please enter a valid hourly rate (between $10 and $500)"
- "Access denied. This account is not authorized for staff portal."

## Success Messages

### Registration Success
```
✓ Account created successfully! 
  Your account is pending HR approval. Redirecting...
```

### Sign-In Success
```
✓ Login successful! Redirecting...
```

## Available Clients

Pre-defined client list for registration:
- Acme Corp
- Globex
- Initech
- TechCorp
- InnovateCo
- DataSystems

*HR can assign additional clients or modify assignments later*

## HR Approval Workflow

### New Staff Registration Flow
1. Staff registers → Status: "pending"
2. HR views pending staff in Staff Management
3. HR can:
   - Approve: Change status to "active"
   - Update client assignments
   - Modify hourly rates
   - Add/remove clients
4. Staff can access dashboard regardless of status

### Status Implications

**Pending Status:**
- Can log in and access dashboard
- May have limited features (based on business rules)
- Badge shows "Pending Approval"

**Active Status:**
- Full access to all features
- Can clock in/out
- Hours tracked and billed

**Inactive Status:**
- Cannot log in
- Account effectively suspended

## Technical Implementation

### Key Functions

#### `registerWithEmail(email, password, displayName, portal)`
```javascript
// In: firebase/auth.js
// Creates Firebase Auth account
// Creates Firestore user document
// Returns: UserCredential
```

#### `signInWithEmail(email, password)`
```javascript
// In: firebase/auth.js
// Authenticates user
// Returns: UserCredential
```

#### `createStaffProfile(uid, profileData)`
```javascript
// In: firebase/firestore.js
// Creates/updates staff profile in Firestore
// Ensures 'staff' role
// Includes clients array and rate
```

#### `getUserProfile(uid)`
```javascript
// In: firebase/firestore.js
// Fetches user profile from Firestore
// Returns: User document or null
```

### Authentication Flow

```javascript
// Registration
1. registerWithEmail(email, password, name, 'staff')
   ↓
2. Firebase creates auth account
   ↓
3. createStaffProfile(uid, {...profileData})
   ↓
4. Firestore stores in users collection
   ↓
5. Redirect to dashboard

// Sign-In
1. signInWithEmail(email, password)
   ↓
2. Firebase authenticates
   ↓
3. getUserProfile(uid)
   ↓
4. Check role === 'staff'
   ↓
5. If staff → Dashboard
   If not staff → Logout + Error
```

### State Management

```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  phone: '',
  rate: 40,
  selectedClients: []
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
```

## Security Considerations

### Firebase Security Rules Example

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow users to read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to create their own profile on signup
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to update their own profile (limited fields)
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.role == resource.data.role; // Can't change role
      
      // Only HR can update status and critical fields
      // (Additional rules needed for HR role)
    }
  }
}
```

### Best Practices

1. **Never store passwords in Firestore** (Firebase Auth handles this)
2. **Validate all input on client and server**
3. **Use HTTPS** for all communications
4. **Implement rate limiting** for authentication attempts
5. **Log security events** (sign-ins, sign-ups, failures)
6. **Regular security audits** of Firestore rules

## Future Enhancements

1. **Email Verification**: Require email verification before access
2. **Password Reset**: "Forgot Password" functionality
3. **Two-Factor Authentication**: Add 2FA option
4. **Social Sign-In**: Google, Microsoft, etc.
5. **Profile Photo Upload**: Avatar images
6. **Skills & Certifications**: Additional profile fields
7. **Onboarding Flow**: Step-by-step setup wizard
8. **HR Notification**: Alert HR of new registrations
9. **Auto-Approval**: Automatic approval for verified domains
10. **Bulk Import**: HR can import multiple staff accounts

## Integration Points

### Staff Dashboard Integration
- Profile data loads automatically on sign-in
- AuthContext provides `userProfile` with all Firestore data
- Clients array populates time clock dropdown
- Rate used for billing calculations

### HR Dashboard Integration
- HR can view all staff from Firestore
- Can approve/reject pending registrations
- Can modify client assignments and rates
- Can activate/deactivate accounts

### Time Tracking Integration
- Staff profile determines available clients
- Rate used for payroll calculations
- Status affects ability to clock in

## Testing

### Test Scenarios

1. **New Registration**
   - Fill all fields correctly → Success
   - Leave required field empty → Error
   - Use existing email → "Email already in use"
   - Passwords don't match → Error
   - Invalid rate → Error

2. **Sign-In**
   - Correct credentials → Success
   - Wrong password → "Incorrect password"
   - Non-existent email → "No account found"
   - HR account trying staff portal → "Access denied"

3. **Profile Creation**
   - Verify Firestore document created
   - Check all fields populated correctly
   - Verify role === 'staff'
   - Verify status === 'pending'

4. **Multi-Client Selection**
   - Select 0 clients → Allowed
   - Select 1 client → Works
   - Select multiple clients → All saved
   - Clients array format correct

## Benefits

### For Staff
✅ **Self-Service**: Register without HR intervention
✅ **Immediate Access**: Can log in right away
✅ **Profile Control**: Set own rate and preferences
✅ **Multi-Client**: Can work for multiple clients

### For HR
✅ **Automated**: No manual account creation
✅ **Centralized**: All data in Firestore
✅ **Approval Workflow**: Review before activation
✅ **Flexible**: Easy to modify assignments

### For System
✅ **Secure**: Firebase Authentication
✅ **Scalable**: Cloud Firestore
✅ **Real-time**: Instant profile updates
✅ **Integrated**: Seamless with other features

---

**Related Documentation:**
- Firebase Authentication Setup
- Firestore Security Rules
- Staff Dashboard Features
- Hour Assignment System


