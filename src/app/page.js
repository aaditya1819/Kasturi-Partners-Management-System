import { getDashboardStats, getPartners, getSarees, getOrders } from '@/db/queries.js';
import { createOrderAction, setupDBAction } from './actions.js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let stats = null;
  let partners = [];
  let sarees = [];
  let recentOrders = [];
  let isConnected = true;
  let needsInit = false;
  let errorMessage = '';

  try {
    // Try to run a quick test query to check connection
    stats = await getDashboardStats();
    partners = await getPartners();
    sarees = await getSarees();
    
    // Check if tables are missing
    if (partners.length === 0 && sarees.length === 0) {
      needsInit = true;
    } else {
      const allOrders = await getOrders();
      recentOrders = allOrders.slice(0, 5);
    }
  } catch (error) {
    errorMessage = error.message;
    // Detect if database tables are missing
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation "partners"')) {
      needsInit = true;
      isConnected = true;
    } else {
      isConnected = false;
    }
  }

  // State A: DB Connection Failed (e.g., placeholder password)
  if (!isConnected) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
        <div className="form-card" style={{ borderTop: '4px solid var(--danger)' }}>
          <h2 className="form-title" style={{ color: 'var(--danger)' }}>⚠️ Neon Database Connection Required</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            We could not connect to your Neon PostgreSQL database. This is usually because the connection string in your <code>.env.local</code> file is using a placeholder password.
          </p>
          <div style={{ backgroundColor: '#FAF9FB', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>How to fix:</p>
            <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
              <li>Open the <strong><code>.env.local</code></strong> file in the root of this project.</li>
              <li>Replace <code>YOUR_PASSWORD_HERE</code> with your actual Neon database password.</li>
              <li>Restart the application server.</li>
            </ol>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Error details: {errorMessage || 'Connection timeout or invalid credentials'}
          </p>
        </div>
      </div>
    );
  }

  // State B: Database Connected but empty (Tables need creation & seeding)
  if (needsInit) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
        <div className="form-card" style={{ borderTop: '4px solid var(--accent-color)' }}>
          <h2 className="form-title" style={{ color: 'var(--primary-color)' }}>✨ Welcome to Kasturi Partners Portal</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Your database connection is successful! To get started, we need to create the database tables (Partners, Sarees, and Orders) and seed them with your sample spreadsheet data.
          </p>
          <form action={setupDBAction} style={{ textAlign: 'center', margin: '2rem 0' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              🛠️ Create Tables & Load Sample Data
            </button>
          </form>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            This will create tables matching your Google Sheet columns and add 8 partners, 2 sarees, and 2 sample orders.
          </p>
        </div>
      </div>
    );
  }

  // State C: Normal Dashboard
  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h2 className="header-title">Welcome back, Admin</h2>
          <p className="header-subtitle">Here is what is happening with Kasturi Sarees today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <form action={setupDBAction}>
            <button type="submit" className="btn btn-secondary btn-small">
              🔄 Reset/Seed Sample Data
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card">
          <div className="card-accent-border"></div>
          <div className="card-title">Total Revenue</div>
          <div className="card-value">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
          <div className="card-desc">Lifetime retail value sold</div>
        </div>

        <div className="card">
          <div className="card-accent-border"></div>
          <div className="card-title">Your Profit</div>
          <div className="card-value" style={{ color: 'var(--success)' }}>
            ₹{(stats.adminProfit || 0).toLocaleString('en-IN')}
          </div>
          <div className="card-desc">15% share of total cost sales</div>
        </div>

        <div className="card">
          <div className="card-accent-border"></div>
          <div className="card-title">Pending Partner Payouts</div>
          <div className="card-value" style={{ color: 'var(--warning)' }}>
            ₹{(stats.partnerProfitDue || 0).toLocaleString('en-IN')}
          </div>
          <div className="card-desc">Profit owed to resellers</div>
        </div>

        <div className="card">
          <div className="card-accent-border"></div>
          <div className="card-title">Sarees Sold</div>
          <div className="card-value">{stats.totalSales || 0}</div>
          <div className="card-desc">Total orders recorded</div>
        </div>

        <div className="card">
          <div className="card-accent-border"></div>
          <div className="card-title">Pending Dispatches</div>
          <div className="card-value" style={{ color: 'var(--info)' }}>
            {stats.pendingShipments || 0}
          </div>
          <div className="card-desc">Orders to be shipped</div>
        </div>
      </div>

      {/* Main Grid: Quick Order and Recent Sales */}
      <div className="dashboard-split">
        {/* Left column: Recent Orders */}
        <div className="table-container">
          <div className="table-header-actions">
            <h3 className="table-title">Recent Orders</h3>
            <Link href="/orders" className="btn btn-secondary btn-small">
              View All Orders →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders logged yet. Use the form on the right to log your first sale!
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Saree</th>
                  <th>Partner</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '500' }}>{order.saree_name}</td>
                    <td>{order.partner_name}</td>
                    <td>{new Date(order.ordered_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td style={{ fontWeight: '600' }}>₹{parseFloat(order.retail_price).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${order.amount_credited === 'YES' ? 'badge-success' : 'badge-danger'}`}>
                        {order.amount_credited}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${order.delivered_status === 'YES' ? 'badge-success' : 'badge-warning'}`}>
                        {order.delivered_status === 'YES' ? 'YES' : 'NO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column: Quick Order Form */}
        <div className="form-card">
          <h3 className="form-title">⚡ Log a New Sale</h3>
          {sarees.length === 0 || partners.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Please add at least one saree product and one partner to log a sale.
            </p>
          ) : (
            <form action={createOrderAction}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="saree_id">Select Saree</label>
                  <select name="saree_id" id="saree_id" className="form-select" required defaultValue="">
                    <option value="" disabled>-- Choose Saree --</option>
                    {sarees.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Price: ₹{parseFloat(s.retail_price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="partner_id">Reseller Partner</label>
                  <select name="partner_id" id="partner_id" className="form-select" required defaultValue="">
                    <option value="" disabled>-- Choose Partner --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="delivery_address">Customer Delivery Address</label>
                  <textarea
                    name="delivery_address"
                    id="delivery_address"
                    className="form-textarea"
                    placeholder="Enter customer's full shipping address (Name, Phone, Address, PIN)"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Record Sale & Order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
