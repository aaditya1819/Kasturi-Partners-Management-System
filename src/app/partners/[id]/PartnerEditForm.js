'use client';

import { useState } from 'react';
import { updatePartnerAction, deletePartnerAction } from '../../actions.js';

export default function PartnerEditForm({ partner }) {
  // Helper to format date string to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [name, setName] = useState(partner.name);
  const [phone, setPhone] = useState(partner.phone);
  const [location, setLocation] = useState(partner.location);
  const [address, setAddress] = useState(partner.address);
  const [joinedDate, setJoinedDate] = useState(formatDateForInput(partner.joined_date));
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete ${partner.name}? This will remove her profile from the portal.`)) {
      setLoading(true);
      try {
        await deletePartnerAction(partner.id);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="form-card">
      <h3 className="form-title">✏️ Edit Partner Profile</h3>
      <form action={async (formData) => {
        setLoading(true);
        try {
          await updatePartnerAction(partner.id, formData);
          alert('Partner profile updated successfully!');
        } catch (err) {
          alert('Error updating partner: ' + err.message);
        } finally {
          setLoading(false);
        }
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">Location / City</label>
            <input
              type="text"
              name="location"
              id="location"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="joined_date">Date Joined</label>
            <input
              type="date"
              name="joined_date"
              id="joined_date"
              className="form-input"
              value={joinedDate}
              onChange={(e) => setJoinedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Default Delivery Address</label>
            <textarea
              name="address"
              id="address"
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-secondary" 
              style={{ background: 'var(--danger-bg)', color: 'var(--danger)', borderColor: 'var(--danger)' }}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
