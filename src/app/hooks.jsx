import { useState } from 'react';
import { login } from '../api/auth';

export function useAuth() {
  const [error, setError] = useState(null);

  const loginUser = async (username, password) => {
    try {
      setError(null);
      const data = await login(username, password);
      return data;
    } catch (e) {
      setError(e.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  const token = localStorage.getItem('token');

  return { token, loginUser, logout, error };
}
