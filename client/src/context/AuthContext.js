import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { TOKEN_KEY } from '../api/axios';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the API who we are if a token is stored.
  useEffect(function () {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then(function (res) {
        setUser(res.data.user);
      })
      .catch(function () {
        localStorage.removeItem(TOKEN_KEY);
      })
      .then(function () {
        setLoading(false);
      });
  }, []);

  function saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    saveSession(res.data);
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  const value = {
    user: user,
    loading: loading,
    register: register,
    login: login,
    logout: logout
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
