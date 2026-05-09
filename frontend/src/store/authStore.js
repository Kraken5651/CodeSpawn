import { create } from 'zustand';
import { authService } from '../services/api';

const DEV_BYPASS_AUTH = import.meta.env.DEV || import.meta.env.VITE_BYPASS_AUTH === 'true';

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@codespawn.dev',
  username: 'DemoDeveloper',
  role: 'user'
};

const useAuthStore = create((set) => ({
  user: DEV_BYPASS_AUTH ? DEMO_USER : null,
  isAuthenticated: DEV_BYPASS_AUTH,
  isLoading: false,
  error: null,

  // Load user from localStorage on init
  initAuth: async () => {
    if (DEV_BYPASS_AUTH) {
      set({
        user: DEMO_USER,
        isAuthenticated: true
      });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        set({
          user: response.data.data.user,
          isAuthenticated: true
        });
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      const { user, token, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Login failed',
        isLoading: false
      });
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  },

  register: async (email, username, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName
      });

      const { user, token, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Registration failed',
        isLoading: false
      });
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Registration failed'
      };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    set({
      user: DEV_BYPASS_AUTH ? DEMO_USER : null,
      isAuthenticated: DEV_BYPASS_AUTH
    });
  }
}));

export default useAuthStore;
