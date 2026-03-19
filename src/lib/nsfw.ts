import * as nsfwjs from 'nsfwjs'

let model: nsfwjs.NSFWJS | null = null
let modelLoadPromise: Promise<nsfwjs.NSFWJS> | null = null

/**
 * Load the NSFW model. This should be called early in the app lifecycle.
 * Subsequent calls will return the same promise/model.
 */
export async function loadNSFWModel(): Promise<nsfwjs.NSFWJS> {
    if (model) {
        return model
    }

    if (modelLoadPromise) {
        return modelLoadPromise
    }

    modelLoadPromise = nsfwjs.load()
        .then(loadedModel => {
            model = loadedModel
            return loadedModel
        })
        .catch(error => {
            console.error('Error loading NSFW model:', error)
            modelLoadPromise = null
            throw error
        })

    return modelLoadPromise
}

/**
 * Check if an image contains NSFW content
 * @param imageElement - Image or Canvas element to check
 * @returns Object with unsafe flag and reason
 */
export async function checkNSFW(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<{
    unsafe: boolean
    reason?: string
}> {
    try {
        const nsfwModel = await loadNSFWModel()
        const predictions = await nsfwModel.classify(imageElement)

        // Predictions format: [{ className: 'Porn', probability: 0.9 }, ...]
        // Classes: Porn, Sexy, Hentai, Neutral, Drawing
        const pornPrediction = predictions.find(p => p.className === 'Porn')
        const sexyPrediction = predictions.find(p => p.className === 'Sexy')
        const hentaiPrediction = predictions.find(p => p.className === 'Hentai')

        const pornScore = pornPrediction?.probability || 0
        const sexyScore = sexyPrediction?.probability || 0
        const hentaiScore = hentaiPrediction?.probability || 0

        const PORN_THRESHOLD = 0.3
        const SEXY_THRESHOLD = 0.5
        const HENTAI_THRESHOLD = 0.3
        const COMBINED_THRESHOLD = 0.6

        if (pornScore > PORN_THRESHOLD) {
            return {
                unsafe: true,
                reason: 'This image was flagged as containing explicit content and cannot be uploaded.',
            }
        }

        if (hentaiScore > HENTAI_THRESHOLD) {
            return {
                unsafe: true,
                reason: 'This image contains Hentai and cannot be uploaded.',
            }
        }

        if (sexyScore > SEXY_THRESHOLD) {
            return {
                unsafe: true,
                reason: 'This image was flagged as containing inappropriate content and cannot be uploaded.',
            }
        }

        if (pornScore + sexyScore + hentaiScore > COMBINED_THRESHOLD) {
            return {
                unsafe: true,
                reason: 'This image was flagged as containing inappropriate content and cannot be uploaded.',
            }
        }

        return { unsafe: false }
    } catch (error) {
        console.error('Error checking NSFW content:', error)
        return { unsafe: true, reason: 'Content safety check failed. Please try again.' }
    }
}
