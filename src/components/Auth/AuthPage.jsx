import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-card">
        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Register onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;


