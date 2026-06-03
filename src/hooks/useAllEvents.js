import { useState, useEffect, useCallback } from 'react'
import { getClients } from '../services/clientService'

const CLIENT_COLORS = [
  '#FF6B00', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#eab308',
]

export function useAllEvents() {
  const [fcEvents, setFcEvents] = useState([])
  const [clients,  setClients]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const raw = await getClients()
      setClients(raw.map((c, i) => ({ ...c, clientColor: CLIENT_COLORS[i % CLIENT_COLORS.length] })))

      const all = []
      raw.forEach((client, idx) => {
        const color = CLIENT_COLORS[idx % CLIENT_COLORS.length]
        client.calendars?.forEach((cal) => {
          cal.events?.forEach((ev) => {
            all.push({
              id:              String(ev.id),
              title:           ev.title,
              start:           ev.eventDate,
              allDay:          true,
              backgroundColor: color,
              textColor:       '#fff',
              borderColor:     'transparent',
              extendedProps:   {
                ...ev,
                clientName:  client.name,
                clientColor: color,
                clientInitials: client.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
              },
            })
          })
        })
      })

      setFcEvents(all)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { fcEvents, clients, loading, error, refetch: fetch }
}
