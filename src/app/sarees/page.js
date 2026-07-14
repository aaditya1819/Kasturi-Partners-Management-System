import { getSarees } from '@/db/queries.js';
import SareeForm from './SareeForm.js';
import SareeRow from './SareeRow.js';

export const dynamic = 'force-dynamic';

export default async function SareesPage() {
  const sarees = await getSarees();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="header-title">Saree Pricing Catalog</h2>
          <p className="header-subtitle">Define saree wholesale rates, shipping, and automatic reseller profit splits.</p>
        </div>
      </div>

      <div className="dashboard-split">
        
        {/* Sarees Table */}
        <div className="table-container">
          <div className="table-header-actions">
            <h3 className="table-title">Product & Price Catalog</h3>
          </div>

          {sarees.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No sarees found in the catalog. Add one using the form on the right!
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Saree Name</th>
                  <th>Buying Price</th>
                  <th>Shipping</th>
                  <th>Retail Price</th>
                  <th>Admin / Partner Profit (15% each)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sarees.map((saree, index) => (
                  <SareeRow key={saree.id} saree={saree} index={index} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Saree Form */}
        <SareeForm />

      </div>
    </div>
  );
}
