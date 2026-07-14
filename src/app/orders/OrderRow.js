'use client';

import { useState } from 'react';
import { updateOrderAction, deleteOrderAction } from '../actions.js';

export default function OrderRow({ order }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amountCredited, setAmountCredited] = useState(order.amount_credited);
  const [despatchedStatus, setDespatchedStatus] = useState(order.despatched_status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [deliveredStatus, setDeliveredStatus] = useState(order.delivered_status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateOrderAction(
        order.id,
        amountCredited,
        despatchedStatus,
        trackingNumber,
        deliveredStatus
      );
      setIsEditing(false);
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this order for ${order.saree_name} sold by ${order.partner_name}?`)) {
      setLoading(true);
      try {
        await deleteOrderAction(order.id);
      } catch (err) {
        alert('Error deleting order: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setAmountCredited(order.amount_credited);
    setDespatchedStatus(order.despatched_status);
    setTrackingNumber(order.tracking_number || '');
    setDeliveredStatus(order.delivered_status);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr style={{ backgroundColor: '#FFFDF6' }}>
        <td style={{ fontWeight: '600' }}>{order.saree_name}</td>
        <td>{order.partner_name}</td>
        <td>
          <textarea
            className="form-textarea"
            style={{ width: '100%', minHeight: '60px', padding: '0.4rem', fontSize: '0.85rem' }}
            value={order.delivery_address}
            disabled
          />
        </td>
        <td>
          <select
            className="form-select"
            style={{ padding: '0.3rem', fontSize: '0.85rem' }}
            value={amountCredited}
            onChange={(e) => setAmountCredited(e.target.value)}
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
            <option value="PENDING">PENDING</option>
          </select>
        </td>
        <td>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <select
              className="form-select"
              style={{ padding: '0.3rem', fontSize: '0.85rem' }}
              value={despatchedStatus}
              onChange={(e) => {
                setDespatchedStatus(e.target.value);
                if (e.target.value === 'NO') setTrackingNumber('');
              }}
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
            {despatchedStatus === 'YES' && (
              <input
                type="text"
                placeholder="Tracking ID"
                className="form-input"
                style={{ padding: '0.3rem', fontSize: '0.85rem' }}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            )}
          </div>
        </td>
        <td>
          <select
            className="form-select"
            style={{ padding: '0.3rem', fontSize: '0.85rem' }}
            value={deliveredStatus}
            onChange={(e) => setDeliveredStatus(e.target.value)}
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
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
      <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{order.saree_name}</td>
      <td style={{ fontWeight: '500' }}>{order.partner_name}</td>
      <td style={{ fontSize: '0.85rem', color: 'var(--text-main)', maxWidth: '280px', whiteSpace: 'pre-wrap' }}>
        {order.delivery_address}
      </td>
      <td>
        <span className={`badge ${order.amount_credited === 'YES' ? 'badge-success' : 'badge-danger'}`}>
          {order.amount_credited}
        </span>
      </td>
      <td>
        {order.despatched_status === 'YES' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span className="badge badge-success">YES</span>
            {order.tracking_number && (
              <code style={{ fontSize: '0.75rem', backgroundColor: '#F1EFF2', padding: '2px 4px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                {order.tracking_number}
              </code>
            )}
          </div>
        ) : (
          <span className="badge badge-warning">NO</span>
        )}
      </td>
      <td>
        <span className={`badge ${order.delivered_status === 'YES' ? 'badge-success' : 'badge-warning'}`}>
          {order.delivered_status === 'YES' ? 'YES' : 'NO'}
        </span>
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
