// Use localhost for better stability
const API_BASE_URL = 'http://localhost:4000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log('🔐 Attempting login...');
      
      // For demo purposes, accept any login
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (credentials.username && credentials.password) {
        console.log('✅ Login successful');
        return { success: true, data: { token: 'demo-token', user: credentials.username } };
      } else {
        return { success: false, message: 'Please enter username and password' };
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Cannot connect to server. Make sure backend is running on port 4000.' };
    }
  },
};


