import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles

interface TypewriterMarkdownProps {
    content: string;
    speed?: number;
    onComplete?: () => void;
}

const TypewriterMarkdown: React.FC<TypewriterMarkdownProps> = ({ content, speed = 1, onComplete }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        setDisplayedContent('');
        indexRef.current = 0;
    }, [content]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (indexRef.current < content.length) {
                // ULTRA FAST: Large chunks
                const chunkSize = 15; // Reveal 15 chars at a time

                const nextIndex = Math.min(indexRef.current + chunkSize, content.length);
                setDisplayedContent(content.substring(0, nextIndex));
                indexRef.current = nextIndex;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [content, speed, onComplete]);

    return (
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-light">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {displayedContent}
            </ReactMarkdown>
            {indexRef.current < content.length && (
                <span className="inline-block w-2 h-4 bg-cyan-500 animate-pulse ml-1 align-middle" />
            )}
        </div>
    );
};

export default TypewriterMarkdown;
