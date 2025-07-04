export async function login(role, password) {
  const currentTime = new Date();
  const res = await fetch('http://localhost:5009/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, password, currentTime }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Ошибка авторизации');
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}
