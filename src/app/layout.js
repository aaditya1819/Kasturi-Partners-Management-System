import './globals.css';
import Sidebar from './Sidebar';
import LoginForm from './LoginForm';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Kasturi Partners & Sales Portal',
  description: 'Enterprise partner, price listing, and order delivery tracker for Kasturi Sarees.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_session')?.value === 'authenticated';

  return (
    <html lang="en">
      <body>
        {isAuthenticated ? (
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        ) : (
          <LoginForm />
        )}
      </body>
    </html>
  );
}
