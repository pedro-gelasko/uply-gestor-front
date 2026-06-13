import { useState, useEffect, useCallback } from 'react'
import { getEvents } from '../services/eventService'
import { mapEventToFC } from '../data/mappers'

export function useClientCalendar(calendarId) {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!calendarId) {
      setEvents([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const raw = await getEvents({ calendarId })
      setEvents(raw.map(mapEventToFC))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [calendarId])

  useEffect(() => { fetch() }, [fetch])

  return { events, loading, error, refetch: fetch }
}
