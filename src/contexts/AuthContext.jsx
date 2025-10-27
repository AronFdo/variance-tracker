import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getCurrentUser } from '../firebase/auth';
import { getUserProfile, createUserProfile } from '../firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile(user.uid);
          
          // If no profile exists, create a basic one
          if (!profile) {
            await createUserProfile(user.uid, {
              email: user.email,
              displayName: user.displayName || '',
              role: 'staff', // Default role
              createdAt: new Date(),
              updatedAt: new Date()
            });
            
            // Fetch the newly created profile
            const newProfile = await getUserProfile(user.uid);
            setUserProfile(newProfile);
          } else {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error handling user profile:', error);
          // Still set the user even if profile fetch fails
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: !!currentUser,
    isHR: userProfile?.role === 'hr',
    isStaff: userProfile?.role === 'staff'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


