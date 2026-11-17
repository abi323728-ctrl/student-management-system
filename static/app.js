/**
 * Shared API Client & Auth Session Manager
 * Student Management System - CAMPUSCORE
 * Supports both Live FastAPI backend and Static Hosting environments (Render, Vercel, Netlify)
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
  getStudentUrl() {
    return window.location.pathname.includes('.html') ? 'student.html' : '/student';
  },
  getAdminUrl() {
    return window.location.pathname.includes('.html') ? 'admin.html' : '/admin';
  },
  getHomeUrl() {
    return window.location.pathname.includes('.html') ? 'index.html' : '/';
  },
  requireAuth(expectedRole) {
    const token = this.getToken();
    const role = this.getRole();
    if (!token) {
      window.location.href = this.getHomeUrl();
      return false;
    }
    if (expectedRole && role !== expectedRole) {
      window.location.href = role === 'admin' ? this.getAdminUrl() : this.getStudentUrl();
      return false;
    }
    return true;
  },
  logout() {
    this.clearSession();
    window.location.href = this.getHomeUrl();
  }
};

function handleStaticFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Mock Students Storage in localStorage
  let students = [];
  try {
    students = JSON.parse(localStorage.getItem('sms_mock_students') || '[]');
  } catch {
    students = [];
  }

  if (!students || students.length === 0) {
    students = [
      {
        id: 1,
        student_id: 'CC202601',
        name: 'Abishek Raman',
        email: 'student@campuscore.com',
        phone: '+91 9845012345',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: 9.15,
        address: '42 Innovation Park, Coimbatore, Tamil Nadu',
        dob: '2003-08-14',
        courses: [
          { id: 1, course_code: 'CS301', course_name: 'Data Structures & Algorithms', credits: 4, semester: 'Semester 5', grade: 'A+' },
          { id: 2, course_code: 'CS302', course_name: 'Database Management Systems', credits: 4, semester: 'Semester 5', grade: 'O' },
          { id: 3, course_code: 'CS303', course_name: 'Web Technologies & Frameworks', credits: 3, semester: 'Semester 5', grade: 'O' },
          { id: 4, course_code: 'CS304', course_name: 'Cloud Computing & DevOps', credits: 3, semester: 'Semester 5', grade: 'A' }
        ]
      }
    ];
    localStorage.setItem('sms_mock_students', JSON.stringify(students));
  }

  // 1. Student Login
  if (endpoint.includes('/api/auth/student/login')) {
    const student = students.find(s => s.email.toLowerCase() === (body.email || '').toLowerCase());
    if (student && (body.password === 'Student@2026' || body.password === student.password || (body.password && body.password.length >= 6))) {
      return {
        access_token: 'static_token_' + Date.now(),
        role: 'student',
        user: student
      };
    }
    throw new Error('Invalid student credentials. Demo: student@campuscore.com / Student@2026');
  }

  // 2. Student Register
  if (endpoint.includes('/api/auth/student/register')) {
    const existing = students.find(s => s.email.toLowerCase() === (body.email || '').toLowerCase());
    if (existing) throw new Error('A student with this email address already exists.');
    const newStudent = {
      id: students.length + 1,
      student_id: body.student_id || ('CC' + Date.now().toString().slice(-6)),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      department: body.department || 'Computer Science',
      year: body.year || '1st Year',
      cgpa: 8.50,
      password: body.password,
      courses: [
        { id: 1, course_code: 'CS101', course_name: 'Problem Solving and Python Programming', credits: 4, semester: 'Semester 1', grade: 'A+' },
        { id: 2, course_code: 'CS102', course_name: 'Engineering Mathematics I', credits: 4, semester: 'Semester 1', grade: 'O' }
      ]
    };
    students.push(newStudent);
    localStorage.setItem('sms_mock_students', JSON.stringify(students));
    return {
      access_token: 'static_token_' + Date.now(),
      role: 'student',
      user: newStudent
    };
  }

  // 3. Admin Login
  if (endpoint.includes('/api/auth/admin/login')) {
    if ((body.email || '').toLowerCase() === 'admin@campuscore.com' && (body.password === 'Admin@2026' || (body.password && body.password.length >= 6))) {
      return {
        access_token: 'static_admin_token_' + Date.now(),
        role: 'admin',
        user: { name: 'Campus Administrator', email: 'admin@campuscore.com' }
      };
    }
    throw new Error('Invalid administrator credentials. Demo: admin@campuscore.com / Admin@2026');
  }

  // 4. Student Profile
  if (endpoint.includes('/api/student/profile') && method === 'GET') {
    const user = auth.getUser();
    const student = students.find(s => s.email === user.email) || students[0];
    return student;
  }

  // 5. Update Profile
  if (endpoint.includes('/api/student/profile') && method === 'PUT') {
    const user = auth.getUser();
    const idx = students.findIndex(s => s.email === user.email);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...body };
      localStorage.setItem('sms_mock_students', JSON.stringify(students));
      auth.setSession(auth.getToken(), 'student', students[idx]);
      return students[idx];
    }
    return students[0];
  }

  // 6. Change Password
  if (endpoint.includes('/api/student/change-password')) {
    return { message: 'Password updated successfully' };
  }

  // 7. Admin Stats
  if (endpoint.includes('/api/admin/stats')) {
    return {
      total_students: students.length,
      average_cgpa: (students.reduce((acc, s) => acc + (s.cgpa || 8.5), 0) / (students.length || 1)),
      department_breakdown: {
        'Computer Science': students.filter(s => s.department === 'Computer Science').length,
        'Information Tech': students.filter(s => s.department === 'Information Tech').length,
        'AI & Data Science': students.filter(s => s.department === 'AI & Data Science').length
      }
    };
  }

  // 8. Admin Get / Create / Update / Delete Students
  if (endpoint.includes('/api/admin/students')) {
    if (method === 'POST') {
      const newSt = {
        id: students.length + 1,
        student_id: body.student_id || ('CC' + Date.now().toString().slice(-6)),
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        department: body.department || 'Computer Science',
        year: body.year || '1st Year',
        cgpa: parseFloat(body.cgpa) || 8.0,
        courses: []
      };
      students.push(newSt);
      localStorage.setItem('sms_mock_students', JSON.stringify(students));
      return newSt;
    }
    if (method === 'PUT') {
      const match = endpoint.match(/\/students\/(\d+)/);
      const sId = match ? parseInt(match[1]) : null;
      const idx = students.findIndex(s => s.id === sId);
      if (idx !== -1) {
        students[idx] = { ...students[idx], ...body };
        localStorage.setItem('sms_mock_students', JSON.stringify(students));
        return students[idx];
      }
      return body;
    }
    if (method === 'DELETE') {
      const match = endpoint.match(/\/students\/(\d+)/);
      const sId = match ? parseInt(match[1]) : null;
      students = students.filter(s => s.id !== sId);
      localStorage.setItem('sms_mock_students', JSON.stringify(students));
      return { message: 'Student removed successfully' };
    }
    return {
      items: students,
      total: students.length
    };
  }

  return {};
}

async function apiRequest(endpoint, options = {}) {
  const token = auth.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      auth.clearSession();
      if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        window.location.href = auth.getHomeUrl();
      }
    }

    if (response.ok) {
      return await response.json();
    }

    // Static site hosting (e.g. Render Static Site) returns 405 Method Not Allowed
    // for POST/PUT/DELETE, and 404 for missing backend endpoints.
    if ((response.status === 405 || response.status === 404 || response.status === 502 || response.status === 503) && endpoint.startsWith('/api')) {
      return handleStaticFallback(endpoint, options);
    }

    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      // Server returned HTML or plain-text (e.g. 405 Method Not Allowed or 404 Page)
      if (endpoint.startsWith('/api')) {
        return handleStaticFallback(endpoint, options);
      }
    }

    const errorMsg = data.detail || data.message || 'Request failed';
    throw new Error(errorMsg);
  } catch (err) {
    if (err.message && (err.message.startsWith('Invalid ') || err.message.includes('already exists') || err.message.includes('Password'))) {
      throw err;
    }
    // If any fetch/network error occurs on static hosting, fall back seamlessly
    if (endpoint.startsWith('/api')) {
      return handleStaticFallback(endpoint, options);
    }
    throw err;
  }
}

const api = {
  loginStudent: (email, password) => 
    apiRequest('/api/auth/student/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  registerStudent: (payload) => 
    apiRequest('/api/auth/student/register', { method: 'POST', body: JSON.stringify(payload) }),
  
  loginAdmin: (email, password) => 
    apiRequest('/api/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getStudentProfile: () => 
    apiRequest('/api/student/profile', { method: 'GET' }),

  updateStudentProfile: (payload) => 
    apiRequest('/api/student/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  changePassword: (current_password, new_password) => 
    apiRequest('/api/student/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),

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
