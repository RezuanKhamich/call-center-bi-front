import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { getReq } from '../app/api/routes'; // твоя функция запроса
import { biStore } from './store/store';
import { login } from './auth';

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

export const useMoList = () => {
  const moList = biStore((state) => state.moList);
  const setMoList = biStore((state) => state.setMoList);

  useEffect(() => {
    if (moList.length) return;

    const fetchMoList = async () => {
      try {
        const res = await getReq('moderator/get-mo-list');
        setMoList(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMoList();
  }, [moList.length, setMoList]);

  return { moList };
};

export const useReportsLastMonthList = () => {
  const reportsList = biStore((state) => state.reports);
  const setReportsList = biStore((state) => state.setReports);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const startDate = oneMonthAgo.toISOString();
        const endDate = now.toISOString();

        const res = await getReq(
          `moderator/reports-by-date?start-date=${startDate}&end-date=${endDate}`
        );

        setReportsList(res);
      } catch (err) {
        console.error('❌ Ошибка загрузки отчетов:', err);
      }
    };

    fetchReports();
  }, [setReportsList]);

  return { reportsList };
};

export const useGetUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const res = await getReq('moderator/get-users');
        setUsers(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsersList();
  }, []);

  return { users };
};

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, addToast };
}
