import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, registerWithEmail, logout } from '../../firebase/auth';
import { getDocument, addDocument, getUserProfile, createStaffProfile } from '../../firebase/firestore';

export default function StaffAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    confirmPassword: '',
    phone: '',
    rate: 40,
    selectedClients: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Available clients for selection
  const availableClients = ['Acme Corp', 'Globex', 'Initech', 'TechCorp', 'InnovateCo', 'DataSystems'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'client') {
      // Handle multi-select clients
      setFormData(prev => ({
        ...prev,
        selectedClients: checked 
          ? [...prev.selectedClients, value]
          : prev.selectedClients.filter(c => c !== value)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic using Firebase
        const userCredential = await signInWithEmail(formData.email, formData.password);
        const user = userCredential.user;
        
        // Get user profile from Firestore to check role
        const userProfile = await getUserProfile(user.uid);
        
        if (userProfile && userProfile.role === 'staff') {
          setSuccess('Login successful! Redirecting...');
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate('/staff/dashboard');
          }, 500);
        } else {
          setError('Access denied. This account is not authorized for staff portal.');
          // Sign out the user since they're not staff
          await logout();
        }
      } else {
        // Registration validation
        if (!formData.name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        
        if (!formData.phone.trim()) {
          setError('Please enter your phone number');
          setLoading(false);
          return;
        }

        if (formData.rate < 10 || formData.rate > 500) {
          setError('Please enter a valid hourly rate (between $10 and $500)');
          setLoading(false);
          return;
        }

        // Register with Firebase (role will be 'staff' by default)
        const userCredential = await registerWithEmail(
          formData.email, 
          formData.password, 
          formData.name, 
          'staff'
        );
        const user = userCredential.user;

        // Create comprehensive staff profile in Firestore
        const clientData = formData.selectedClients.map(clientName => ({
          name: clientName,
          rate: parseFloat(formData.rate) // Same rate for all clients initially
        }));
        
        await createStaffProfile(user.uid, {
          email: user.email,
          displayName: formData.name,
          name: formData.name, // Also store as 'name' for compatibility
          phone: formData.phone,
          clients: clientData, // Array of client objects with rates
          rate: parseFloat(formData.rate), // Default hourly rate
          status: 'pending', // New staff need approval from HR
          project: formData.selectedClients[0] || 'Unassigned', // Primary client for backward compatibility
          billedHours: 0,
          actualHours: 0
        });

        setSuccess('Account created successfully! Your account is pending HR approval. Redirecting...');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/staff/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Staff Time Tracking' : 'Join Our Team'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to track your hours' : 'Create your staff account'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required={!isLogin}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate ($)
                  </label>
                  <div className="mt-1">
                    <input
                      id="rate"
                      name="rate"
                      type="number"
                      min="10"
                      max="500"
                      step="0.01"
                      required={!isLogin}
                      value={formData.rate}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Your expected hourly rate</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Assignments (Optional)
                  </label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {availableClients.map(client => (
                      <div key={client} className="flex items-center">
                        <input
                          id={`client-${client}`}
                          name="client"
                          type="checkbox"
                          value={client}
                          checked={formData.selectedClients.includes(client)}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`client-${client}`} className="ml-2 text-sm text-gray-700">
                          {client}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Select clients you'll be working with (can be assigned by HR later)
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>

           {/* Information Panel */}
           <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
             <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
               <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
               </svg>
               {isLogin ? 'Welcome Back!' : 'Registration Information'}
             </h3>
             <div className="text-xs text-blue-800 space-y-1">
               {isLogin ? (
                 <>
                   <div>Sign in with your staff credentials to access your dashboard</div>
                   <div className="mt-2">Track hours, view assignments, and manage your timesheet</div>
                 </>
               ) : (
                 <>
                   <div className="font-medium">What happens next:</div>
                   <ul className="list-disc list-inside space-y-1 text-blue-700 mt-1">
                     <li>Your account will be created with "Pending" status</li>
                     <li>HR will review and approve your account</li>
                     <li>You can log in immediately to view your dashboard</li>
                     <li>Client assignments can be updated by HR later</li>
                   </ul>
                 </>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
