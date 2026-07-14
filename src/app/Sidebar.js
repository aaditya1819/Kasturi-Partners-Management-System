'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from './actions.js';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      )
    },
    { 
      name: 'Partners Directory', 
      path: '/partners', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    { 
      name: 'Saree Pricing', 
      path: '/sarees', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      )
    },
    { 
      name: 'Orders & Delivery', 
      path: '/orders', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      )
    }
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the admin portal?')) {
      await logoutAction();
      window.location.reload();
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand-section">
        <h1 className="brand-title">Kasturi</h1>
        <span className="brand-subtitle">Partners Portal</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-menu">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Admin Sign Out Option */}
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            width: '100%', 
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            color: 'rgba(255, 255, 255, 0.55)',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span>Logout</span>
        </button>

        <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
          <p>© 2026 Kasturi Sarees</p>
          <p style={{ marginTop: '2px', opacity: 0.6 }}>v1.1.0</p>
        </div>
      </div>
    </aside>
  );
}
