import { useState, useEffect } from 'react'
import { fetchCommunities } from '../api/client'

export function useCommunities() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommunities()
      .then(({ data }) => setCommunities(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false))
  }, [])

  return { communities, loading }
}
