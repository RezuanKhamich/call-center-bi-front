const API_URL = import.meta.env.VITE_API_URL || ''; // если есть базовый URL

export const postReq = async (url, body) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ POST ${API_URL}:`, err.message);
    throw err;
  }
};

export const getReq = async (url, keys) => {
  const token = localStorage.getItem('token'); // или sessionStorage, или из cookies

  try {
    const res = await fetch(`${API_URL}/${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ GET ${API_URL}/${url}:`, err.message);
    throw err;
  }
};
