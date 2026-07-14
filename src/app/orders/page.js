import { getOrders, getSarees, getPartners } from '@/db/queries.js';
import { createOrderAction } from '../actions.js';
import OrderRow from './OrderRow.js';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await getOrders();
  const sarees = await getSarees();
  const partners = await getPartners();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="header-title">Orders & Delivery Tracker</h2>
          <p className="header-subtitle">Track payment credit status, log tracking details, and verify delivered sarees.</p>
        </div>
      </div>

      <div className="dashboard-split">
        
        {/* Orders Table Container */}
        <div className="table-container">
          <div className="table-header-actions">
            <h3 className="table-title">Delivery Status Ledger</h3>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders logged in the delivery ledger yet. Use the form on the right to log your first sale!
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Saree Name</th>
                  <th style={{ width: '15%' }}>Partner Name</th>
                  <th style={{ width: '30%' }}>Customer Delivery Address</th>
                  <th style={{ width: '10%' }}>Amount Credit</th>
                  <th style={{ width: '12%' }}>Despatched</th>
                  <th style={{ width: '10%' }}>Delivered</th>
                  <th style={{ width: '8%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Order / Log Sale Form */}
        <div className="form-card">
          <h3 className="form-title">⚡ Log a New Sale (Add Order)</h3>
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
