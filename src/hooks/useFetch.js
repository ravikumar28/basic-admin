import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useFetch = (service, immediate = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      
      if (err.response && err.response.status === 401) {
        logout();
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, logout]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute };
};