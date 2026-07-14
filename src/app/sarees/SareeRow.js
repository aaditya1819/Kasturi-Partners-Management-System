'use client';

import { useState, useEffect } from 'react';
import { updateSareeAction, deleteSareeAction } from '../actions.js';

export default function SareeRow({ saree, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(saree.name);
  const [buyingPrice, setBuyingPrice] = useState(saree.buying_price);
  const [shippingCost, setShippingCost] = useState(saree.shipping_cost);
  const [isRounded, setIsRounded] = useState(true);
  
  // Math preview states for edit mode
  const [retailPrice, setRetailPrice] = useState(parseFloat(saree.retail_price));
  const [profitEach, setProfitEach] = useState(parseFloat(saree.admin_profit));
  const [loading, setLoading] = useState(false);

  // Auto-calculate suggested retail price and splits
  useEffect(() => {
    const buy = parseFloat(buyingPrice) || 0;
    const ship = parseFloat(shippingCost) || 0;
    const cost = buy + ship;

    if (cost > 0) {
      const rawRetail = cost * 1.30;
      const finalRetail = isRounded ? Math.round(rawRetail / 10) * 10 : rawRetail;
      setRetailPrice(finalRetail);
      setProfitEach((finalRetail - cost) / 2);
    } else {
      setRetailPrice(0);
      setProfitEach(0);
    }
  }, [buyingPrice, shippingCost, isRounded]);

  // Handle manual retail price override in edit mode
  const handleRetailPriceChange = (val) => {
    const parsedVal = parseFloat(val) || 0;
    setRetailPrice(parsedVal);
    const buy = parseFloat(buyingPrice) || 0;
    const ship = parseFloat(shippingCost) || 0;
    const cost = buy + ship;
    setProfitEach((parsedVal - cost) / 2);
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('buying_price', buyingPrice.toString());
    formData.append('shipping_cost', shippingCost.toString());
    formData.append('retail_price', retailPrice.toString());
    formData.append('admin_profit', profitEach.toString());
    formData.append('partner_profit', profitEach.toString());

    try {
      await updateSareeAction(saree.id, formData);
      setIsEditing(false);
    } catch (err) {
      alert('Error updating saree: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${saree.name}? This will remove it from the catalog.`)) {
      setLoading(true);
      try {
        await deleteSareeAction(saree.id);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setName(saree.name);
    setBuyingPrice(saree.buying_price);
    setShippingCost(saree.shipping_cost);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr style={{ backgroundColor: '#FFFDF6' }}>
        <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{index + 1}</td>
        <td>
          <input
            type="text"
            className="form-input"
            style={{ padding: '0.3rem', fontSize: '0.85rem', width: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </td>
        <td>
          <input
            type="number"
            className="form-input"
            style={{ padding: '0.3rem', fontSize: '0.85rem', width: '80px' }}
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
            required
          />
        </td>
        <td>
          <input
            type="number"
            className="form-input"
            style={{ padding: '0.3rem', fontSize: '0.85rem', width: '80px' }}
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            required
          />
        </td>
        <td>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <input
              type="number"
              className="form-input"
              style={{ padding: '0.3rem', fontSize: '0.85rem', width: '100px', fontWeight: '700', borderColor: 'var(--accent-color)' }}
              value={retailPrice || ''}
              onChange={(e) => handleRetailPriceChange(e.target.value)}
              required
            />
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
              <input
                type="checkbox"
                checked={isRounded}
                onChange={(e) => setIsRounded(e.target.checked)}
              />
              Round (₹10)
            </label>
          </div>
        </td>
        <td style={{ color: 'var(--success)', fontWeight: '600' }}>
          ₹{profitEach.toFixed(2)}
        </td>
        <td style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary btn-small"
              style={{ background: 'var(--success)' }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="btn btn-secondary btn-small"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{index + 1}</td>
      <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{saree.name}</td>
      <td>₹{parseFloat(saree.buying_price).toLocaleString('en-IN')}</td>
      <td>₹{parseFloat(saree.shipping_cost).toLocaleString('en-IN')}</td>
      <td style={{ fontWeight: '700' }}>₹{parseFloat(saree.retail_price).toLocaleString('en-IN')}</td>
      <td style={{ color: 'var(--success)', fontWeight: '600' }}>
        ₹{parseFloat(saree.admin_profit).toLocaleString('en-IN')}
      </td>
      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary btn-small"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-secondary btn-small"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
