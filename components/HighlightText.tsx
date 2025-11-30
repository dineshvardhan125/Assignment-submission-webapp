import React from 'react';

interface HighlightTextProps {
    text: string;
    highlight: string;
}

export default function HighlightText({ text, highlight }: HighlightTextProps) {
    if (!highlight || !text) {
        return <>{text}</>;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-900 text-foreground font-medium rounded px-0.5">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
}
