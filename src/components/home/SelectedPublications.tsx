'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {groupPublications(publications).map((item, index) => (
                    <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        {item.group ? (
                            <>
                                <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">{item.group}</p>
                                <div className="space-y-3">
                                    {item.pubs.map((pub) => (
                                        <div key={pub.id} className="flex flex-col sm:flex-row gap-4">
                                            {pub.preview && (
                                                <div className="w-full sm:w-44 flex-shrink-0 self-center rounded-md overflow-hidden bg-white">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={`/papers/${pub.preview}`} alt={pub.title} className="w-full h-auto object-contain" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <PubTitle pub={pub} className="font-semibold text-primary mb-1 leading-tight text-[0.95rem]" />
                                                <PubAuthors pub={pub} className="text-sm text-neutral-600 dark:text-neutral-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                {item.pubs[0].preview && (
                                    <div className="w-full sm:w-44 flex-shrink-0 self-center rounded-md overflow-hidden bg-white">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={`/papers/${item.pubs[0].preview}`} alt={item.pubs[0].title} className="w-full h-auto object-contain" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                <PubTitle pub={item.pubs[0]} className="font-semibold text-primary mb-2 leading-tight" />
                                <PubAuthors pub={item.pubs[0]} className="text-sm text-neutral-600 dark:text-neutral-500 mb-1" />
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                                    {item.pubs[0].journal || item.pubs[0].conference}
                                </p>
                                {item.pubs[0].description && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                        {item.pubs[0].description}
                                    </p>
                                )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

// Merge publications that share a `group` field (e.g. several submissions to one venue) into a single card.
function groupPublications(publications: Publication[]) {
    const items: { key: string; group?: string; pubs: Publication[] }[] = [];
    for (const pub of publications) {
        const existing = pub.group ? items.find((item) => item.group === pub.group) : undefined;
        if (existing) existing.pubs.push(pub);
        else items.push({ key: pub.group ? `group-${pub.group}` : pub.id, group: pub.group, pubs: [pub] });
    }
    return items;
}

function PubTitle({ pub, className }: { pub: Publication; className: string }) {
    const href = pub.url || (pub.doi ? `https://doi.org/${pub.doi}` : undefined);
    const title = <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />;
    return (
        <h3 className={className}>
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{title}</a>
            ) : title}
        </h3>
    );
}

function PubAuthors({ pub, className }: { pub: Publication; className: string }) {
    return (
        <p className={className}>
            {pub.authors.map((author, idx) => (
                <span key={idx}>
                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                        {author.name}
                    </span>
                    {author.isCorresponding && (
                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                    )}
                    {idx < pub.authors.length - 1 && ', '}
                </span>
            ))}
        </p>
    );
}
