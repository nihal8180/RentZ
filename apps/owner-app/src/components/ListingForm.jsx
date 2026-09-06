'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const TYPES = ['ROOM', 'HOUSE', 'PG', 'FLAT'];
const FURNISHING = ['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'];

const emptyForm = {
  type: 'ROOM',
  title: '',
  description: '',
  rent: '',
  deposit: '',
  bhk: '',
  bathrooms: 1,
  furnishing: 'UNFURNISHED',
  amenities: '',
  images: [],
  location: { city: '', locality: '', pincode: '', addressLine: '' },
};

export default function ListingForm({ initialValue, listingId, onSaved }) {
  const [form, setForm] = useState(() => {
    if (!initialValue) return emptyForm;
    return {
      ...emptyForm,
      ...initialValue,
      amenities: (initialValue.amenities || []).join(', '),
      location: { ...emptyForm.location, ...initialValue.location },
    };
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateLocation(field, value) {
    setForm((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));

    setUploading(true);
    setError('');
    try {
      const { urls } = await api.uploadImages(formData);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((u) => u !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      rent: Number(form.rent),
      deposit: Number(form.deposit) || 0,
      bhk: Number(form.bhk) || 0,
      bathrooms: Number(form.bathrooms) || 1,
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      if (listingId) {
        await api.updateListing(listingId, payload);
      } else {
        await api.createListing(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label>Property type</label>
          <select value={form.type} onChange={(e) => updateField('type', e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Furnishing</label>
          <select value={form.furnishing} onChange={(e) => updateField('furnishing', e.target.value)}>
            {FURNISHING.map((f) => (
              <option key={f} value={f}>
                {f.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="field field-full">
          <label>Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Spacious 2BHK near Gomti Nagar metro"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>

        <div className="field field-full">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Rent (₹/month)</label>
          <input
            type="number"
            required
            min="0"
            value={form.rent}
            onChange={(e) => updateField('rent', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Deposit (₹)</label>
          <input
            type="number"
            min="0"
            value={form.deposit}
            onChange={(e) => updateField('deposit', e.target.value)}
          />
        </div>

        <div className="field">
          <label>BHK</label>
          <input type="number" min="0" value={form.bhk} onChange={(e) => updateField('bhk', e.target.value)} />
        </div>
        <div className="field">
          <label>Bathrooms</label>
          <input
            type="number"
            min="1"
            value={form.bathrooms}
            onChange={(e) => updateField('bathrooms', e.target.value)}
          />
        </div>

        <div className="field field-full">
          <label>Amenities (comma-separated)</label>
          <input
            type="text"
            placeholder="WIFI, PARKING, LIFT"
            value={form.amenities}
            onChange={(e) => updateField('amenities', e.target.value)}
          />
        </div>

        <div className="field">
          <label>City</label>
          <input
            type="text"
            required
            value={form.location.city}
            onChange={(e) => updateLocation('city', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Locality</label>
          <input
            type="text"
            required
            value={form.location.locality}
            onChange={(e) => updateLocation('locality', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Pincode</label>
          <input
            type="text"
            value={form.location.pincode}
            onChange={(e) => updateLocation('pincode', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Address line</label>
          <input
            type="text"
            value={form.location.addressLine}
            onChange={(e) => updateLocation('addressLine', e.target.value)}
          />
        </div>

        <div className="field field-full">
          <label>Photos</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageUpload} />
          {uploading && <p style={{ fontSize: 13 }}>Uploading...</p>}
          {form.images.length > 0 && (
            <div className="image-preview">
              {form.images.map((url) => (
                <div key={url} style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Listing" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: '#b3311f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn" type="submit" disabled={saving || uploading}>
          {saving ? 'Saving...' : listingId ? 'Save changes' : 'Publish listing'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
