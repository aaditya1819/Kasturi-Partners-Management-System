import { getPartners } from '@/db/queries.js';
import { createPartnerAction } from '../actions.js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PartnersPage(props) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || '';
  const partners = await getPartners(search);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="header-title">Reseller Partners</h2>
          <p className="header-subtitle">Manage and track your active sales network of reseller women.</p>
        </div>
      </div>

      <div className="dashboard-split">
        {/* Partners List & Search */}
        <div>
          <div className="table-container">
            <div className="table-header-actions">
              <h3 className="table-title">Partner Directory</h3>
              <form method="GET" action="/partners" style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search name or city..."
                  className="table-search"
                  defaultValue={search}
                  style={{ width: '220px' }}
                />
                <button type="submit" className="btn btn-secondary btn-small" style={{ padding: '0 0.8rem' }}>
                  Search
                </button>
                {search && (
                  <Link href="/partners" className="btn btn-secondary btn-small" style={{ padding: '0 0.8rem', display: 'flex', alignItems: 'center' }}>
                    Clear
                  </Link>
                )}
              </form>
            </div>
            
            {partners.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No partners found matching "{search}".
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Joined Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner, index) => (
                    <tr key={partner.id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{index + 1}</td>
                      <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{partner.name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{partner.phone}</td>
                      <td>
                        <span className="badge badge-info">{partner.location}</span>
                      </td>
                      <td>{new Date(partner.joined_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`/partners/${partner.id}`} className="btn btn-primary btn-small">
                          View & Edit Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add Partner Form */}
        <div className="form-card">
          <h3 className="form-title">➕ Add New Partner</h3>
          <form action={createPartnerAction}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g. Mrs. Archna Sandip Khalane"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="e.g. 94059 36252"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">Location / City</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g. Dhule"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">Full Delivery Address</label>
                <textarea
                  name="address"
                  id="address"
                  placeholder="Enter house details, landmark, and PIN code..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                Register Partner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
