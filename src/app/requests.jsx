export async function removeReportByDate(createdAt) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/moderator/delete-reports-by-date`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ createdAt }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Ошибка при удалении отчётов');
  }

  const data = await res.json();
  return data;
}
