// ── Category ──────────────────────────────────────────────────────────────────
export const CATEGORY_LABELS = {
  VIDEO:         'Vídeo',
  REELS:         'Reels',
  STORY:         'Story',
  CREATIVE:      'Criativo',
  CAMPAIGN:      'Campanha',
  INSTITUTIONAL: 'Institucional',
  COMMEMORATIVE: 'Comemorativo',
  OTHER:         'Outro',
}

export const CATEGORY_COLORS = {
  VIDEO:         { bg: '#FF6B00', text: '#fff', border: 'transparent' },
  REELS:         { bg: '#FF6B00', text: '#fff', border: 'transparent' },
  STORY:         { bg: '#FF8C42', text: '#fff', border: 'transparent' },
  CREATIVE:      { bg: '#2a2a2a', text: '#FF8C42', border: '#FF6B00' },
  CAMPAIGN:      { bg: '#FF6B00', text: '#fff', border: 'transparent' },
  INSTITUTIONAL: { bg: '#333333', text: '#B3B3B3', border: 'transparent' },
  COMMEMORATIVE: { bg: '#FF8C42', text: '#fff', border: 'transparent' },
  OTHER:         { bg: '#2a2a2a', text: '#B3B3B3', border: 'transparent' },
}

// ── Status ────────────────────────────────────────────────────────────────────
export const STATUS_LABELS = {
  PLANNED:          'Planejado',
  IN_PRODUCTION:    'Em Produção',
  WAITING_APPROVAL: 'Aguardando Aprovação',
  PUBLISHED:        'Publicado',
  CANCELLED:        'Cancelado',
}

// ── Client colors (cycle) ─────────────────────────────────────────────────────
const PALETTE = ['#FF6B00', '#FF8C42']

const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// ── Mappers ───────────────────────────────────────────────────────────────────
export const mapClient = (client, index = 0) => {
  const allEvents = client.calendars?.flatMap((c) => c.events || []) || []
  const today     = new Date()
  const upcoming  = allEvents
    .filter((e) => new Date(e.eventDate) >= today)
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
  const next = upcoming[0]

  const nextDate = next
    ? new Date(next.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : '—'

  return {
    id:                   client.id,
    uuid:                 client.uuid,
    name:                 client.name,
    initials:             initials(client.name),
    logoPath:             client.logoPath || null,
    color:                PALETTE[index % PALETTE.length],
    actionsCount:         allEvents.length,
    nextPublicationDate:  nextDate,
    nextPublicationTitle: next?.title || '—',
    segment:              'Provedor de Internet',
    city:                 '',
    contactName:          client.responsibleName,
    contactEmail:         client.email,
    description:          client.notes || '',
    phone:                client.phone || '',
    status:               client.status,
    calendars:            client.calendars || [],
    _count:               client._count || {},
  }
}

export const mapEvent = (event) => ({
  ...event,
  category:      event.category,
  categoryLabel: CATEGORY_LABELS[event.category] || event.category,
  statusLabel:   STATUS_LABELS[event.status]     || event.status,
  files:         event.attachments?.map((a) => a.fileName) || [],
  start:         event.eventDate,
  description:   event.description || '',
  imageUrl:      event.imageUrl || null,
})

export const mapEventToFC = (event) => {
  const colors = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTHER
  return {
    id:              String(event.id),
    title:           event.title,
    start:           event.eventDate,
    allDay:          true,
    backgroundColor: colors.bg,
    textColor:       colors.text,
    borderColor:     colors.border,
    extendedProps:   mapEvent(event),
  }
}

export const mapShare = (share, index = 0) => ({
  id:         share.id,
  uuid:       share.uuid,
  clientId:   share.clientId,
  clientName: share.client?.name || '—',
  link:       `/cliente/${share.token}`,
  token:      share.token,
  status:     share.active ? 'Ativo' : 'Inativo',
  createdAt:  new Date(share.createdAt).toLocaleDateString('pt-BR'),
  expiresAt:  share.expiresAt
    ? new Date(share.expiresAt).toLocaleDateString('pt-BR')
    : null,
  views:      0,
  lastViewed: '—',
})

export const mapHistory = (item) => {
  const actionMap = {
    CREATE: 'create',
    UPDATE: 'edit',
    DELETE: 'delete',
    SEED:   'create',
    SHARE:  'share',
  }
  const d = new Date(item.createdAt)
  return {
    id:     item.id,
    date:   d.toLocaleDateString('pt-BR'),
    time:   d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    action: item.action,
    detail: item.description,
    type:   actionMap[item.action] || 'create',
    user:   'Sistema',
  }
}
