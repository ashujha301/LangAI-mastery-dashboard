import { useAuth } from '@clerk/clerk-react'

export function useApi() {
  const { getToken } = useAuth()

  const apiCall = async (endpoint, options = {}) => {
    const token = await getToken()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  return { apiCall }
}
