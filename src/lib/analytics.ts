import posthog from 'posthog-js'

const ATTRIBUTION_KEY = 'memories_attribution_v1'
const LAST_UPLOAD_KEY = 'memories_last_upload_v1'

export type UploadSurface = 'landing' | 'gallery'
export type ShareSurface = 'uploaded_page' | 'image_modal' | 'list_view'
type SharePlatform = 'twitter' | 'telegram' | 'whatsapp' | 'native'

interface AttributionContext {
    channel: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    referrer?: string
    referrer_domain?: string
    attribution_type: 'utm' | 'referrer'
}

interface RecentUploadContext {
    memoryId: string
    surface: UploadSurface
    uploadedAt: number
}

let cachedAttribution: AttributionContext | null = null

const getReferrerDomain = (referrer: string) => {
    try {
        return new URL(referrer).hostname.replace(/^www\./, '')
    } catch {
        return ''
    }
}

const classifyChannelFromReferrer = (referrer: string) => {
    if (!referrer) return 'direct'

    const host = getReferrerDomain(referrer)
    if (!host) return 'referral'

    if (/(x\.com|twitter\.com)/.test(host)) return 'x'
    if (/instagram\.com/.test(host)) return 'instagram'
    if (/facebook\.com/.test(host)) return 'facebook'
    if (/t\.me|telegram/.test(host)) return 'telegram'
    if (/whatsapp/.test(host)) return 'whatsapp'
    if (/reddit\.com/.test(host)) return 'reddit'
    if (/(google\.|bing\.|yahoo\.|duckduckgo\.)/.test(host)) return 'search'

    return 'referral'
}

const applyUtmFromParams = (params: URLSearchParams, target: Partial<AttributionContext>) => {
    const source = params.get('utm_source')?.trim()
    const medium = params.get('utm_medium')?.trim()
    const campaign = params.get('utm_campaign')?.trim()
    const content = params.get('utm_content')?.trim()
    const term = params.get('utm_term')?.trim()

    if (source) target.utm_source = source
    if (medium) target.utm_medium = medium
    if (campaign) target.utm_campaign = campaign
    if (content) target.utm_content = content
    if (term) target.utm_term = term
}

const parseAttributionFromLocation = (): AttributionContext => {
    const fromParams: Partial<AttributionContext> = {}

    applyUtmFromParams(new URLSearchParams(window.location.search), fromParams)

    const hash = window.location.hash || ''
    const hashQueryIndex = hash.indexOf('?')
    if (hashQueryIndex >= 0) {
        const hashSearch = hash.slice(hashQueryIndex + 1)
        applyUtmFromParams(new URLSearchParams(hashSearch), fromParams)
    }

    const referrer = document.referrer || ''
    const referrerDomain = getReferrerDomain(referrer)

    if (fromParams.utm_source) {
        return {
            channel: fromParams.utm_source,
            attribution_type: 'utm',
            referrer,
            referrer_domain: referrerDomain,
            ...fromParams,
        }
    }

    return {
        channel: classifyChannelFromReferrer(referrer),
        attribution_type: 'referrer',
        referrer,
        referrer_domain: referrerDomain,
        ...fromParams,
    }
}

const readStoredAttribution = (): AttributionContext | null => {
    try {
        const raw = sessionStorage.getItem(ATTRIBUTION_KEY)
        if (!raw) return null
        return JSON.parse(raw) as AttributionContext
    } catch {
        return null
    }
}

const storeAttribution = (context: AttributionContext) => {
    try {
        sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(context))
    } catch {
        return
    }
}

const withAttribution = (props?: Record<string, unknown>) => {
    const attribution = getSessionAttribution()
    return {
        ...attribution,
        ...props,
    }
}

export const initializeSessionAttribution = () => {
    if (cachedAttribution) return cachedAttribution

    const stored = readStoredAttribution()
    if (stored) {
        cachedAttribution = stored
        posthog.register(stored)
        return stored
    }

    const context = parseAttributionFromLocation()
    cachedAttribution = context
    storeAttribution(context)
    posthog.register(context)
    posthog.capture('session_attributed', {
        ...context,
        landing_url: window.location.href,
    })

    return context
}

export const getSessionAttribution = () => {
    if (cachedAttribution) return cachedAttribution
    return initializeSessionAttribution()
}

export const trackPageView = (route: string) => {
    posthog.capture('page_viewed', withAttribution({
        route,
        full_url: window.location.href,
    }))
}

export const trackUploadSubmitted = (props: {
    surface: UploadSurface
    isValid: boolean
    fileType?: string
    fileSizeBytes?: number
    hasDescription: boolean
    hasDatetime: boolean
    isPublic: boolean
    blockedReason?: string
}) => {
    posthog.capture('upload_submitted', withAttribution(props))
}

export const setRecentSuccessfulUpload = (memoryId: string, surface: UploadSurface) => {
    const context: RecentUploadContext = {
        memoryId,
        surface,
        uploadedAt: Date.now(),
    }

    try {
        sessionStorage.setItem(LAST_UPLOAD_KEY, JSON.stringify(context))
    } catch {
        return
    }
}

const getRecentSuccessfulUpload = (): RecentUploadContext | null => {
    try {
        const raw = sessionStorage.getItem(LAST_UPLOAD_KEY)
        if (!raw) return null
        return JSON.parse(raw) as RecentUploadContext
    } catch {
        return null
    }
}

const isShareQualifiedForRecentUpload = (memoryId?: string) => {
    if (!memoryId) return false
    const recent = getRecentSuccessfulUpload()
    if (!recent) return false
    return recent.memoryId === memoryId
}

export const trackUploadSucceeded = (props: {
    memoryId: string
    surface: UploadSurface
    durationMs: number
    isPublic: boolean
}) => {
    setRecentSuccessfulUpload(props.memoryId, props.surface)
    posthog.capture('upload_succeeded', withAttribution(props))
}

export const trackUploadFailed = (props: {
    surface: UploadSurface
    stage: 'upload' | 'validation'
    errorMessage?: string
}) => {
    posthog.capture('upload_failed', withAttribution(props))
}

export const trackShareInitiated = (props: {
    memoryId?: string
    surface: ShareSurface
}) => {
    posthog.capture('share_initiated', withAttribution({
        ...props,
        qualified_share_per_upload: isShareQualifiedForRecentUpload(props.memoryId),
    }))
}

export const trackShareClipboardResult = (props: {
    memoryId?: string
    surface: ShareSurface
    success: boolean
    errorMessage?: string
}) => {
    posthog.capture('share_clipboard_result', withAttribution({
        ...props,
        qualified_share_per_upload: isShareQualifiedForRecentUpload(props.memoryId),
    }))
}

export const trackSharePlatformOpened = (props: {
    memoryId?: string
    surface: ShareSurface
    platform: SharePlatform
}) => {
    posthog.capture('share_platform_opened', withAttribution({
        ...props,
        qualified_share_per_upload: isShareQualifiedForRecentUpload(props.memoryId),
    }))
}