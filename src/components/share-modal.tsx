import React from 'react'
import { X, Twitter } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useIsMobile } from '../hooks/use-mobile'
import ArweaveImage from './arweave-image'
import { buildArweaveTransactionUrl } from '@/lib/arweave-gateway'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    imageId: string
    imageUrl?: string
    imageTitle?: string
    onContinue: () => void
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, imageId, imageUrl, imageTitle, onContinue }) => {
    const isMobile = useIsMobile()

    const handleShareOnX = () => {
        const tweetText = "I just preserved my most cherished memory on Arweave"
        const arweaveUrl = buildArweaveTransactionUrl(imageId)
        const websiteUrl = "onememory.xyz"

        const fullTweetText = `${tweetText} at ${arweaveUrl}`
        const encodedText = encodeURIComponent(fullTweetText)
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`

        window.open(twitterUrl, '_blank', 'noopener,noreferrer')
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center ${isMobile ? 'p-4' : 'p-8'}`}
            onClick={handleBackdropClick}
        >
            <Card className={`bg-slate-900/95 border-white/10 w-full overflow-hidden shadow-2xl ${isMobile ? 'max-w-sm rounded-xl' : 'max-w-xl rounded-xl'}`}>
                <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className={`text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>
                            🎉 Memory Uploaded!
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full w-8 h-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className={`${isMobile ? 'p-4 space-y-4' : 'p-6 space-y-6'}`}>
                    <div className="text-center space-y-4">
                        {imageUrl ? (
                            <div className="space-y-3">
                                <div className="relative mx-auto w-fit">
                                    <ArweaveImage
                                        src={imageUrl}
                                        alt={imageTitle || "Uploaded memory"}
                                        className={`rounded-lg shadow-lg object-contain ${isMobile ? 'max-w-[280px] max-h-[350px]' : 'max-w-[350px] max-h-[450px]'}`}
                                    />
                                </div>
                                {imageTitle && (
                                    <p className="text-white/80 text-sm font-medium">
                                        "{imageTitle}"
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className="text-white font-semibold text-lg">
                                Your memory is now preserved forever!
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Your image has been successfully uploaded to Arweave and will be accessible permanently.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Arweave Transaction ID:</p>
                            <p className="text-white font-mono text-sm break-all">
                                {imageId}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-white/80 text-sm text-center">
                            Share your achievement with the world!
                        </p>

                        <Button
                            onClick={handleShareOnX}
                            className="w-full bg-black hover:bg-gray-900 text-white border border-white/20 h-12 text-base font-medium"
                        >
                            <Twitter className="w-5 h-5 mr-2" />
                            Share on X
                        </Button>

                        <Button
                            onClick={onContinue}
                            variant="outline"
                            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 h-10"
                        >
                            Continue to Gallery
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ShareModal

