'use client';

import { useState } from 'react';
import { loginAction } from './actions.js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const res = await loginAction(null, formData);
      if (res && !res.success) {
        setError(res.error);
      } else {
        window.location.reload(); // Reload page to trigger layout re-render with cookie
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#0f060c', 
      padding: '1.5rem',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10000
    }}>
      <div className="form-card" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        backgroundColor: 'var(--bg-sidebar)', 
        border: '1px solid var(--accent-color)', 
        color: 'var(--text-light)', 
        boxShadow: 'var(--shadow-lg)', 
        borderRadius: 'var(--radius-md)',
        padding: '2.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            color: 'var(--accent-color)', 
            fontSize: '2.6rem', 
            marginBottom: '0.25rem',
            fontStyle: 'italic'
          }}>Kasturi</h2>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '3px', 
            fontSize: '0.8rem', 
            opacity: 0.7,
            fontWeight: '600'
          }}>Partners Portal Login</p>
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(198, 40, 40, 0.15)', 
            borderLeft: '3px solid var(--danger)', 
            padding: '0.75rem 1rem', 
            borderRadius: '4px', 
            fontSize: '0.9rem', 
            color: '#ff8a80', 
            marginBottom: '1.5rem',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '1px' }} htmlFor="email">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.15)',
                  fontSize: '1rem',
                  padding: '0.85rem'
                }}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '1px' }} htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.15)',
                  fontSize: '1rem',
                  padding: '0.85rem'
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-accent" 
              style={{ 
                marginTop: '1rem', 
                width: '100%', 
                padding: '0.95rem',
                fontSize: '1rem',
                letterSpacing: '1px'
              }} 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
