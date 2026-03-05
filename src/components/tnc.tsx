import React from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { MemoriesLogo } from './landing-page'
import { Button } from './ui/button'
import tncMarkdown from '../assets/tnc.md?raw'

const TermsAndConditions: React.FC = () => {
    const markdownComponents = {
        h1: ({ node, ...props }: any) => (
            <h1 className="text-white font-instrument text-4xl md:text-6xl mb-8" {...props} />
        ),
        h2: ({ node, ...props }: any) => (
            <h2 className="text-2xl font-semibold text-white mb-4 mt-8" {...props} />
        ),
        p: ({ node, ...props }: any) => (
            <p className="font-montserrat text-white/80 leading-relaxed mb-3" {...props} />
        ),
        ul: ({ node, ...props }: any) => (
            <ul className="list-disc space-y-2 ml-4 font-montserrat text-white/80 leading-relaxed mb-4" {...props} />
        ),
        li: ({ node, ...props }: any) => (
            <li {...props} />
        ),
        a: ({ node, href, ...props }: any) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#000DFF] underline hover:text-[#0008CC]"
                {...props}
            />
        ),
        strong: ({ node, ...props }: any) => (
            <strong className="font-semibold text-white" {...props} />
        ),
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                    <MemoriesLogo />
                    <Link to="/">
                        <Button
                            variant="ghost"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 md:px-16 py-10">
                <div className="space-y-4">
                    <ReactMarkdown components={markdownComponents}>
                        {tncMarkdown}
                    </ReactMarkdown>
                </div>

                {/* Last Updated */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-sm text-white/60">
                        Last updated: March 5, 2026
                    </p>
                </div>

                {/* Back to home button at bottom */}
                <div className="mt-12 pb-12">
                    <Link to="/">
                        <Button
                            className="bg-[#000DFF] h-14 text-white border border-[#2C2C2C] px-8 py-4 text-lg font-semibold rounded-md hover:bg-[#0008CC] transition-colors"
                            variant="ghost"
                            size="lg"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions
