/**
 * Shared API Client & Auth Session Manager
 * Student Management System - NXTLOGIC
 */

const API_BASE = '';

const auth = {
  getToken() {
    return localStorage.getItem('nxt_token');
  },
  getRole() {
    return localStorage.getItem('nxt_role');
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('nxt_user') || '{}');
    } catch {
      return {};
    }
  },
  setSession(token, role, user) {
    localStorage.setItem('nxt_token', token);
    localStorage.setItem('nxt_role', role);
    localStorage.setItem('nxt_user', JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem('nxt_token');
    localStorage.removeItem('nxt_role');
    localStorage.removeItem('nxt_user');
  },
  requireAuth(expectedRole) {
    const token = this.getToken();
    const role = this.getRole();
    if (!token) {
      window.location.href = '/';
      return false;
    }
    if (expectedRole && role !== expectedRole) {
      window.location.href = role === 'admin' ? '/admin' : '/student';
      return false;
    }
    return true;
  },
  logout() {
    this.clearSession();
    window.location.href = '/';
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = auth.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    auth.clearSession();
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      window.location.href = '/';
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || data.message || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

const api = {
  // Auth
  loginStudent: (email, password) => 
    apiRequest('/api/auth/student/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  registerStudent: (payload) => 
    apiRequest('/api/auth/student/register', { method: 'POST', body: JSON.stringify(payload) }),
  
  loginAdmin: (email, password) => 
    apiRequest('/api/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Student
  getStudentProfile: () => 
    apiRequest('/api/student/profile', { method: 'GET' }),

  updateStudentProfile: (payload) => 
    apiRequest('/api/student/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  changePassword: (current_password, new_password) => 
    apiRequest('/api/student/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),

  // Admin
  getAdminStats: () => 
    apiRequest('/api/admin/stats', { method: 'GET' }),

  getStudents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/students?${query}`, { method: 'GET' });
  },

  createStudent: (payload) => 
    apiRequest('/api/admin/students', { method: 'POST', body: JSON.stringify(payload) }),

  getSingleStudent: (id) => 
    apiRequest(`/api/admin/students/${id}`, { method: 'GET' }),

  updateStudent: (id, payload) => 
    apiRequest(`/api/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  deleteStudent: (id) => 
    apiRequest(`/api/admin/students/${id}`, { method: 'DELETE' })
};

window.auth = auth;
window.api = api;
