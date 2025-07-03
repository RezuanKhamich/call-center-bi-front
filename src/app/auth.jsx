export async function login(role, password) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Ошибка авторизации');
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}
