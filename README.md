# Staffing Variance Tracker

A React application with Firebase Authentication and Firestore database integration.

## Features

- ✅ Firebase Authentication (Email/Password & Google Sign-In)
- ✅ Cloud Firestore Database
- ✅ Protected Routes
- ✅ User Context Management
- ✅ Modern UI with Responsive Design

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional)
4. Create a Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (or production mode with rules)
5. Get your Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Copy the configuration object

### 2. Update Firebase Config

Open `src/firebase/config.js` and replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── AuthPage.jsx      # Main auth page with login/register toggle
│   │   ├── AuthPage.css      # Auth page styles
│   │   ├── Login.jsx         # Login component
│   │   └── Register.jsx      # Register component
│   ├── Dashboard.jsx         # Protected dashboard page
│   ├── Dashboard.css         # Dashboard styles
│   └── ProtectedRoute.jsx    # Route protection component
├── contexts/
│   └── AuthContext.jsx       # Authentication context
├── firebase/
│   ├── config.js             # Firebase initialization
│   ├── auth.js               # Authentication functions
│   └── firestore.js          # Firestore database functions
├── App.jsx                   # Main app component with routing
├── App.css                   # Global styles
└── main.jsx                  # App entry point
```

## Usage Examples

### Authentication

```javascript
import { signInWithEmail, registerWithEmail, logout } from './firebase/auth';

// Sign in
await signInWithEmail('user@example.com', 'password123');

// Register
await registerWithEmail('user@example.com', 'password123', 'John Doe');

// Sign out
await logout();
```

### Firestore Operations

```javascript
import { 
  addDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument 
} from './firebase/firestore';

// Add a document
const docId = await addDocument('users', { 
  name: 'John Doe', 
  email: 'john@example.com' 
});

// Get all documents
const users = await getDocuments('users');

// Update a document
await updateDocument('users', docId, { name: 'Jane Doe' });

// Delete a document
await deleteDocument('users', docId);
```

### Using Auth Context

```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {currentUser.email}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add your own rules here
  }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 19
- Vite
- Firebase (Auth & Firestore)
- React Router

## License

MIT
