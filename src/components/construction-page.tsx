import React from 'react'
import { MemoriesLogo } from './landing-page'
import StampPreview from './stamp-preview'
import { useIsMobile } from '../hooks/use-mobile'

const ConstructionPage: React.FC = () => {
    const isMobile = useIsMobile()

    return (
        <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-16 py-16 gap-12">
                <div className="text-center space-y-6 max-w-2xl">
                    <div className="z-10 p-6 flex align-middle justify-center">
                        <MemoriesLogo />
                    </div>
                    <h2 className="text-white font-instrument text-5xl lg:text-8xl lg:leading-[90px]">
                        Something special<br />is coming
                    </h2>
                    <p className="font-montserrat text-white/70 text-sm md:text-xl leading-relaxed">
                        We're building a place to preserve your favourite memories forever on Arweave. Stay tuned.
                    </p>
                </div>

                {/* Decorative stamp cards */}
                <div className="relative w-full max-w-sm h-64 md:h-80">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full transform -rotate-6">
                        <StampPreview
                            headline="Your first memory"
                            location="ANYWHERE, EARTH"
                            handle="YOU"
                            date="COMING SOON"
                            imageSrc=""
                            layout="horizontal"
                        />
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full transform rotate-3">
                        <StampPreview
                            headline="Memories, forever"
                            location="THE PERMAWEB"
                            handle="MEMORIES"
                            date="COMING SOON"
                            imageSrc=""
                            layout="horizontal"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-2 left-2 z-20 text-muted-foreground/80 text-sm">
                <span>Powered by Arweave</span>
            </div>
        </div>
    )
}

export default ConstructionPage
