import React, { useEffect, useMemo, useState } from 'react'
import { getGatewayFallbackUrls } from '@/lib/arweave-gateway'

type ArweaveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
    src: string
}

const isGatewayCandidate = (value: string) => {
    if (!value) return false

    if (value.startsWith('http://') || value.startsWith('https://')) {
        try {
            const parsed = new URL(value)
            return ['arweave.net', 'ardrive.net', 'turbo-gateway.com'].includes(parsed.hostname)
        } catch {
            return false
        }
    }

    return !value.startsWith('blob:') && !value.startsWith('data:') && !value.startsWith('/')
}

export default function ArweaveImage({ src, onError, onLoad, ...props }: ArweaveImageProps) {
    const sourceCandidates = useMemo(() => {
        if (!src) return ['']
        if (!isGatewayCandidate(src)) return [src]
        return getGatewayFallbackUrls(src)
    }, [src])

    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        setActiveIndex(0)
    }, [sourceCandidates])

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
        if (activeIndex < sourceCandidates.length - 1) {
            setActiveIndex((previous) => previous + 1)
            return
        }

        onError?.(event)
    }

    return (
        <img
            {...props}
            src={sourceCandidates[activeIndex] ?? src}
            onLoad={onLoad}
            onError={handleError}
        />
    )
}
