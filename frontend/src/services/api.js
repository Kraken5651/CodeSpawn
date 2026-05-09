import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

        localStorage.setItem('accessToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        client.defaults.headers.common.Authorization = `Bearer ${response.data.data.token}`;

        return client(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  logout: () => client.post('/auth/logout'),
  getCurrentUser: () => client.get('/auth/me'),
  refreshToken: (refreshToken) => client.post('/auth/refresh', { refreshToken })
};

export const userService = {
  getUserProfile: (id) => client.get(`/users/${id}`),
  updateProfile: (id, data) => client.put(`/users/${id}`, data),
  getUserProblems: (id, params) => client.get(`/users/${id}/problems`, { params }),
  getStreak: (id) => client.get(`/users/${id}/streak`),
  getLeaderboard: (params) => client.get('/users/leaderboard', { params }),
  followUser: (id) => client.post(`/users/${id}/follow`),
  unfollowUser: (id) => client.delete(`/users/${id}/follow`)
};

export const problemService = {
  getAllProblems: (params) => client.get('/problems', { params }),
  getProblem: (id) => client.get(`/problems/${id}`),
  createProblem: (data) => client.post('/problems', data),
  updateProblem: (id, data) => client.put(`/problems/${id}`, data),
  deleteProblem: (id) => client.delete(`/problems/${id}`)
};

export const submissionService = {
  submitCode: (data) => client.post('/submissions', data),
  getSubmission: (id) => client.get(`/submissions/${id}`),
  getSubmissionsByProblem: (problemId, params) => 
    client.get(`/submissions/problem/${problemId}`, { params })
};

export default client;
