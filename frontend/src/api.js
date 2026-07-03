const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is required')
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = response.status === 204 ? null : await response.json()

  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Request failed')
  }

  return data
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getUser(id, token) {
  return request(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}