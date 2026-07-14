import { getPartnerById, getPartnerSales } from '@/db/queries.js';
import Link from 'next/link';
import PartnerEditForm from './PartnerEditForm.js';

export const dynamic = 'force-dynamic';

export default async function PartnerDetailPage(props) {
  const params = await props.params;
  const id = parseInt(params.id, 10);

  const partner = await getPartnerById(id);
  
  if (!partner) {
    return (
      <div>
        <Link href="/partners" className="back-link">
          ← Back to Partners
        </Link>
        <div className="form-card">
          <h2>Partner Not Found</h2>
          <p>The partner with ID {id} does not exist in the database.</p>
        </div>
      </div>
    );
  }

  const sales = await getPartnerSales(id);

  // Math Calculations
  const totalSales = sales.length;
  const totalPartnerProfit = sales.reduce((acc, sale) => acc + parseFloat(sale.partner_profit), 0);
  const totalAdminProfit = sales.reduce((acc, sale) => acc + parseFloat(sale.admin_profit), 0);
  
  // Calculate payouts pending (uncredited profit)
  const pendingPayout = sales
    .filter(sale => sale.amount_credited === 'NO' || sale.amount_credited === 'PENDING')
    .reduce((acc, sale) => acc + parseFloat(sale.partner_profit), 0);

  // Group sales month-wise for the timeline bar chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySales = {};
  
  sales.forEach(sale => {
    const d = new Date(sale.ordered_date);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (!monthlySales[key]) {
      monthlySales[key] = { count: 0, profit: 0 };
    }
    monthlySales[key].count += 1;
    monthlySales[key].profit += parseFloat(sale.partner_profit);
  });

  const sortedMonths = Object.keys(monthlySales).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  const maxCount = Math.max(...Object.values(monthlySales).map(m => m.count), 1);

  return (
    <div>
      {/* Back navigation */}
      <Link href="/partners" className="back-link">
        ← Back to Partners Directory
      </Link>

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="header-title">{partner.name}</h2>
          <p className="header-subtitle">Reseller Profile & Sales Ledger</p>
        </div>
        <div>
          <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            📍 {partner.location}
          </span>
        </div>
      </div>

      {/* Profile Details Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-accent-border" style={{ background: 'var(--accent-color)' }}></div>
          <div className="card-title">Sarees Sold</div>
          <div className="card-value">{totalSales}</div>
          <div className="card-desc">Total successful referrals</div>
        </div>

        <div className="card">
          <div className="card-accent-border" style={{ background: 'var(--success)' }}></div>
          <div className="card-title">Reseller Profit Earned</div>
          <div className="card-value" style={{ color: 'var(--success)' }}>
            ₹{totalPartnerProfit.toLocaleString('en-IN')}
          </div>
          <div className="card-desc">15% share of total cost</div>
        </div>

        <div className="card">
          <div className="card-accent-border" style={{ background: 'var(--warning)' }}></div>
          <div className="card-title">Payouts Pending</div>
          <div className="card-value" style={{ color: 'var(--warning)' }}>
            ₹{pendingPayout.toLocaleString('en-IN')}
          </div>
          <div className="card-desc">Owed profit from pending credits</div>
        </div>

        <div className="card">
          <div className="card-accent-border" style={{ background: 'var(--primary-color)' }}></div>
          <div className="card-title">Your Profit (Admin)</div>
          <div className="card-value" style={{ color: 'var(--primary-color)' }}>
            ₹{totalAdminProfit.toLocaleString('en-IN')}
          </div>
          <div className="card-desc">Your 15% split from these sales</div>
        </div>
      </div>

      <div className="partner-split-top">
        {/* Month-wise Sales Bar Chart */}
        <div className="form-card">
          <h3 className="form-title">📈 Monthly Sales Volume</h3>
          {sortedMonths.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No monthly sales volume data available.
            </div>
          ) : (
            <div style={{ display: 'flex', height: '220px', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem 0', borderBottom: '2px solid var(--border-color)', position: 'relative' }}>
              {sortedMonths.map(month => {
                const { count, profit } = monthlySales[month];
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                    {/* Bar Tooltip on Hover */}
                    <div className="chart-tooltip" style={{ fontSize: '0.75rem', position: 'absolute', bottom: `${percentage + 12}%`, background: 'var(--primary-dark)', color: 'white', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}>
                      {count} sold (₹{profit})
                    </div>
                    {/* CSS Bar element */}
                    <div 
                      className="chart-bar"
                      style={{ 
                        height: `${percentage}%`, 
                        width: '28px', 
                        background: 'linear-gradient(to top, var(--primary-color), var(--accent-color))', 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.5s ease',
                        cursor: 'pointer'
                      }}
                    ></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '600' }}>
                      {month}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline Timeline Graph */}
        <div className="form-card" style={{ maxHeight: '315px', overflowY: 'auto' }}>
          <h3 className="form-title">⏱️ Sales Timeline History</h3>
          {sales.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No history recorded yet.
            </div>
          ) : (
            <div className="timeline-container" style={{ position: 'relative', paddingLeft: '1.8rem', borderLeft: '2px solid var(--border-color)', margin: '0.5rem 0 0.5rem 0.5rem' }}>
              {sales.map((sale) => (
                <div key={sale.id} className="timeline-item" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  {/* Timeline Marker Dot */}
                  <div className="timeline-marker" style={{ position: 'absolute', left: '-2.35rem', top: '0.2rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', border: '2px solid white', boxShadow: '0 0 0 2px var(--primary-color)' }}></div>
                  <div style={{ fontWeight: '700', color: 'var(--primary-color)', fontSize: '0.85rem' }}>
                    {new Date(sale.ordered_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.15rem', fontWeight: '500' }}>
                    Referenced sale for <strong style={{ color: 'var(--primary-light)' }}>{sale.saree_name}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Profit Generated: <strong style={{ color: 'var(--success)' }}>₹{parseFloat(sale.partner_profit)}</strong> | Payout: {sale.amount_credited}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="partner-split-bottom">
        
        {/* Left Column: Edit Profile Form */}
        <PartnerEditForm partner={partner} />

        {/* Right Column: Sales Ledger Table */}
        <div className="table-container">
          <div className="table-header-actions">
            <h3 className="table-title">Sales Ledger & Orders</h3>
          </div>
          {sales.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              This partner has not logged any sales yet.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Saree Code</th>
                  <th>Order Date</th>
                  <th>Saree Price</th>
                  <th>Commission (15%)</th>
                  <th>Amount Credit</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td style={{ fontWeight: '600' }}>{sale.saree_name}</td>
                    <td>{new Date(sale.ordered_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ fontWeight: '600' }}>₹{parseFloat(sale.retail_price).toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: '600', color: 'var(--success)' }}>
                      ₹{parseFloat(sale.partner_profit).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge ${sale.amount_credited === 'YES' ? 'badge-success' : 'badge-danger'}`}>
                        {sale.amount_credited}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${sale.delivered_status === 'YES' ? 'badge-success' : 'badge-warning'}`}>
                        {sale.delivered_status === 'YES' ? 'DELIVERED' : 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
