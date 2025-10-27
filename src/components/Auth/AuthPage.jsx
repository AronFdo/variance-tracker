import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-illustration" aria-hidden="true">
          <div className="auth-illustration-overlay" />
          <div className="brand">
            <div className="brand-mark">VT</div>
            <div className="brand-text">
              <h1>Staffing Variance Tracker</h1>
              <p>Track, analyze, and act on staffing variances in real time.</p>
            </div>
          </div>
        </aside>

        <main className="auth-card" role="main">
          {isLogin ? (
            <Login onToggleMode={() => setIsLogin(false)} />
          ) : (
            <Register onToggleMode={() => setIsLogin(true)} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AuthPage;


