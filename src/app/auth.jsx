export async function login(email, password, remember) {
  const currentTime = new Date();

  const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember, currentTime }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Ошибка авторизации');
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem(
    'user',
    JSON.stringify({
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      moId: data.user.moId,
      fullName: data.user.fullName,
      lastLogin: data.user.lastLogin,
      passwordCreatedAt: data.user.passwordCreatedAt,
    })
  );
  return data;
}
