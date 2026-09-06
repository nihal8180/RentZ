import { getToken, clearSession } from './auth';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080';

async function request(path, { method = 'GET', body, isFormData = false } = {}) {
  const token = getToken();

  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearSession();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  me: () => request('/api/auth/me'),

  myListings: () => request('/api/listings/mine/all'),
  createListing: (payload) => request('/api/listings', { method: 'POST', body: payload }),
  updateListing: (id, payload) => request(`/api/listings/${id}`, { method: 'PUT', body: payload }),
  deleteListing: (id) => request(`/api/listings/${id}`, { method: 'DELETE' }),
  getListing: (id) => request(`/api/listings/${id}`),

  uploadImages: (formData) =>
    request('/api/media/upload', { method: 'POST', body: formData, isFormData: true }),

  ownerInquiries: () => request('/api/inquiries/owner'),
  updateInquiryStatus: (id, status) =>
    request(`/api/inquiries/${id}/status`, { method: 'PUT', body: { status } }),
};
