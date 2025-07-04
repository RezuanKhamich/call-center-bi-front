export async function getDashboard(role) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/${role}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Ошибка доступа');
  }

  return await res.json();
}
