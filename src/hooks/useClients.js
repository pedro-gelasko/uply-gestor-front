import { useState, useEffect, useCallback } from 'react'
import { getClients } from '../services/clientService'
import { mapClient } from '../data/mappers'

export function useClients() {
  const [clients, setClients]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = await getClients()
      setClients(raw.map((c, i) => mapClient(c, i)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { clients, loading, error, refetch: fetch }
}
