export async function removeReportByDate(date) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/moderator/delete-reports-by-date`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Ошибка при удалении отчётов');
  }

  const data = await res.json();
  return data;
}
