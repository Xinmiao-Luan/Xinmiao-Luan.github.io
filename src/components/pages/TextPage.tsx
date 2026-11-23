'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ node, children }) => {
                            // A paragraph made only of images becomes a row of photos with equal heights.
                            const kids = (node?.children ?? []).filter((c) => !(c.type === 'text' && !c.value.trim()));
                            if (kids.length > 0 && kids.every((c) => c.type === 'element' && c.tagName === 'img')) {
                                return <PhotoRow images={kids as unknown as ImgNode[]} />;
                            }
                            // A paragraph starting with "[placeholder]" becomes an empty dashed photo frame with a note.
                            const first = kids[0];
                            if (kids.length === 1 && first.type === 'text' && first.value.startsWith('[placeholder]')) {
                                return (
                                    <div className="my-6 flex min-h-48 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 px-6 py-10 text-center text-neutral-500">
                                        {first.value.replace('[placeholder]', '').trim()}
                                    </div>
                                );
                            }
                            return <p className="mb-4 last:mb-0">{children}</p>;
                        },
                        // Optional image title = width/height ratio, so photos in a row line up at the same height.
                        img: ({ src, alt, title }) => (
                            <span className="block min-w-0" style={{ flex: Number(title) || 1 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={typeof src === 'string' ? src : undefined} alt={alt || ''} loading="lazy" className="w-full h-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200" />
                            </span>
                        ),
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}

type ImgNode = { properties: { src?: string; alt?: string; title?: string } };

const photoClass = 'w-full rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200';

// Lays out a row of photos at one shared height. Each image title is its width/height ratio.
// Consecutive images titled "stack <ratio>" are stacked into one column, filling the row height.
// Add "| <text>" after the ratio to show a location label in the photo's bottom-left corner.
function PhotoRow({ images }: { images: ImgNode[] }) {
    const groups: { stacked: boolean; items: { src?: string; alt?: string; ratio: number; caption?: string }[] }[] = [];
    for (const img of images) {
        const [title, caption] = String(img.properties.title ?? '').split('|').map((part) => part.trim());
        const stacked = title.startsWith('stack');
        const ratio = Number(title.replace('stack', '').trim()) || 1;
        const item = { src: img.properties.src, alt: img.properties.alt, ratio, caption: caption || undefined };
        const last = groups[groups.length - 1];
        if (stacked && last?.stacked) last.items.push(item);
        else groups.push({ stacked, items: [item] });
    }
    return (
        <div className="flex flex-col sm:flex-row gap-4 my-6">
            {groups.map((group, i) =>
                group.stacked ? (
                    <span key={i} className="relative block min-w-0" style={{ flex: 1 / group.items.reduce((sum, it) => sum + 1 / it.ratio, 0) }}>
                        {/* On wide screens the stack fills the height set by its neighbours instead of adding to it. */}
                        <span className="flex flex-col gap-4 sm:absolute sm:inset-0">
                        {group.items.map((it) => (
                            <span key={it.src} className="relative block flex-1 min-h-0" style={{ flexGrow: 1 / it.ratio }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={it.src} alt={it.alt || ''} loading="lazy" className={`${photoClass} h-full object-cover`} />
                                {it.caption && <PhotoCaption text={it.caption} />}
                            </span>
                        ))}
                        </span>
                    </span>
                ) : (
                    <span key={i} className="relative block min-w-0" style={{ flex: group.items[0].ratio }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={group.items[0].src} alt={group.items[0].alt || ''} loading="lazy" className={`${photoClass} h-auto`} />
                        {group.items[0].caption && <PhotoCaption text={group.items[0].caption} />}
                    </span>
                )
            )}
        </div>
    );
}

function PhotoCaption({ text }: { text: string }) {
    return (
        <span className="absolute left-3 bottom-3 max-w-[calc(100%-1.5rem)] inline-flex items-start gap-1 rounded-md bg-black/55 backdrop-blur-sm px-2 py-1 text-xs leading-snug font-medium text-white pointer-events-none">
            <svg viewBox="0 0 24 24" className="h-3 w-3 mt-0.5 flex-shrink-0 fill-current" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
            {text}
        </span>
    );
}
