const API_URL = import.meta.env.VITE_API_URL || '/api'

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

export function updateUser(id, changes, token) {
  return request(`/users/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(changes),
  })
}

export function getSystemInfo(token) {
  return request('/system/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function registerUser(name, email, password) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}
