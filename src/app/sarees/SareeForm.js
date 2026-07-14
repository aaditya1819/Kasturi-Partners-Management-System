'use client';

import { useState, useEffect } from 'react';
import { createSareeAction } from '../actions.js';

export default function SareeForm() {
  const [name, setName] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [isRounded, setIsRounded] = useState(true);

  // States
  const [totalCost, setTotalCost] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [profitEach, setProfitEach] = useState(0);

  // Auto-calculate suggested values
  useEffect(() => {
    const buy = parseFloat(buyingPrice) || 0;
    const ship = parseFloat(shippingCost) || 0;
    
    const cost = buy + ship;
    setTotalCost(cost);

    if (cost > 0) {
      let rawRetail = cost * 1.30; // Suggested 30% markup
      let finalRetail = rawRetail;
      
      if (isRounded) {
        finalRetail = Math.round(rawRetail / 10) * 10;
      }
      
      setRetailPrice(finalRetail);

      // Profit split is (Retail - Cost) / 2
      const finalProfit = (finalRetail - cost) / 2;
      setProfitEach(finalProfit);
    } else {
      setRetailPrice(0);
      setProfitEach(0);
    }
  }, [buyingPrice, shippingCost, isRounded]);

  // Handle manual retail price override
  const handleRetailPriceChange = (val) => {
    const parsedVal = parseFloat(val) || 0;
    setRetailPrice(parsedVal);
    // Profit split: (Manual Retail - Cost) / 2
    setProfitEach((parsedVal - totalCost) / 2);
  };

  return (
    <div className="form-card">
      <h3 className="form-title">➕ Add New Saree Pricing</h3>
      <form action={async (formData) => {
        // Appending the calculated/overridden values so the server action receives them
        formData.append('retail_price', retailPrice.toString());
        formData.append('admin_profit', profitEach.toString());
        formData.append('partner_profit', profitEach.toString());
        
        try {
          await createSareeAction(formData);
          // Clear inputs on success
          setName('');
          setBuyingPrice('');
          setShippingCost('');
        } catch (err) {
          alert('Error adding saree: ' + err.message);
        }
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Saree Name / Code</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="e.g. Green Tea Batic"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="buying_price">Buying Price (₹)</label>
            <input
              type="number"
              name="buying_price"
              id="buying_price"
              placeholder="e.g. 480"
              className="form-input"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="shipping_cost">Shipping Cost (₹)</label>
            <input
              type="number"
              name="shipping_cost"
              id="shipping_cost"
              placeholder="e.g. 120"
              className="form-input"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0' }}>
            <input
              type="checkbox"
              id="is_rounded"
              checked={isRounded}
              onChange={(e) => setIsRounded(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="is_rounded" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500' }}>
              Round Retail Price to nearest ₹10
            </label>
          </div>

          {/* Editable Retail Price (calculated by default, overrideable) */}
          <div className="form-group">
            <label className="form-label" htmlFor="retail_price_input">Retail Price (₹) [Overrideable]</label>
            <input
              type="number"
              id="retail_price_input"
              className="form-input"
              style={{ borderColor: 'var(--accent-color)', fontWeight: '600' }}
              value={retailPrice || ''}
              onChange={(e) => handleRetailPriceChange(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>

          {/* Pricing Calculation Preview Panel */}
          <div className="pricing-formula-preview">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Cost (Buying + Shipping):</span>
              <span style={{ fontWeight: '600' }}>₹{totalCost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(88,24,69,0.06)', paddingTop: '0.4rem', color: 'var(--success)' }}>
              <span>Partner Profit (15%):</span>
              <span style={{ fontWeight: '600' }}>₹{profitEach.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-light)' }}>
              <span>Admin Profit (15%):</span>
              <span style={{ fontWeight: '600' }}>₹{profitEach.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Save Saree Price
          </button>
        </div>
      </form>
    </div>
  );
}
