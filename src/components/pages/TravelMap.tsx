'use client';

import { useEffect, useRef } from 'react';

// Places shown on the travel map. Add a line here to pin a new place.
const PLACES: { name: string; lat: number; lng: number }[] = [
    // United States
    { name: 'Seattle, Washington', lat: 47.61, lng: -122.33 },
    { name: 'North Cascades, Washington', lat: 48.77, lng: -121.3 },
    { name: 'Maple Pass Loop, Washington', lat: 48.51, lng: -120.73 },
    { name: 'Los Angeles, California', lat: 34.05, lng: -118.24 },
    { name: 'San Diego, California', lat: 32.72, lng: -117.16 },
    { name: 'Sequoia National Park, California', lat: 36.49, lng: -118.57 },
    { name: 'Park City, Utah', lat: 40.65, lng: -111.5 },
    { name: 'Denver, Colorado', lat: 39.74, lng: -104.99 },
    { name: 'Phoenix, Arizona', lat: 33.45, lng: -112.07 },
    { name: 'Camelback Mountain, Arizona', lat: 33.52, lng: -111.96 },
    { name: 'Lake Pleasant, Arizona', lat: 33.85, lng: -112.27 },
    { name: 'Tucson, Arizona', lat: 32.22, lng: -110.97 },
    { name: 'Sedona, Arizona', lat: 34.87, lng: -111.76 },
    { name: 'Flagstaff, Arizona', lat: 35.2, lng: -111.65 },
    { name: 'Payson, Arizona', lat: 34.23, lng: -111.33 },
    // China
    { name: 'Beijing, China', lat: 39.9, lng: 116.4 },
    { name: 'Tsingtao, China', lat: 36.07, lng: 120.38 },
    { name: 'Nanjing, China', lat: 32.06, lng: 118.8 },
    { name: 'Henan, China', lat: 34.75, lng: 113.62 },
    { name: 'Nuodeng, Yunnan', lat: 25.8, lng: 99.43 },
    // Indonesia
    { name: 'Bali, Indonesia', lat: -8.34, lng: 115.09 },
    { name: 'Bogor, Indonesia', lat: -6.6, lng: 106.8 },
    { name: 'BSD City, Indonesia', lat: -6.3, lng: 106.65 },
    { name: 'Pulau Pramuka, Indonesia', lat: -5.75, lng: 106.61 },
    // Europe
    { name: 'Amsterdam, Netherlands', lat: 52.37, lng: 4.9 },
    { name: 'Rotterdam, Netherlands', lat: 51.92, lng: 4.48 },
    { name: 'Munich, Germany', lat: 48.14, lng: 11.58 },
    { name: 'Neuschwanstein, Germany', lat: 47.56, lng: 10.75 },
    { name: 'Milan, Italy', lat: 45.46, lng: 9.19 },
    { name: 'Lake Como, Italy', lat: 45.99, lng: 9.26 },
    { name: 'Barcelona, Spain', lat: 41.39, lng: 2.17 },
    { name: 'Athens, Greece', lat: 37.98, lng: 23.73 },
    { name: 'Santorini, Greece', lat: 36.39, lng: 25.46 },
];

const COUNTRIES = new Set(PLACES.map((p) => {
    const tail = p.name.split(', ').pop() || '';
    const usStates = ['Washington', 'California', 'Utah', 'Colorado', 'Arizona'];
    return usStates.includes(tail) ? 'United States' : tail === 'Yunnan' ? 'China' : tail;
}));

const LEAFLET_VERSION = '1.9.4';
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
// OpenStreetMap has no free dark style, so dark mode inverts the tiles instead.
const DARK_TILE_FILTER = 'invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9)';

type LeafletWindow = Window & { L?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

// Loads Leaflet from a CDN once, so the map adds no npm dependency.
function loadLeaflet(): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const w = window as LeafletWindow;
    if (w.L) return Promise.resolve(w.L);
    if (!document.querySelector('link[data-leaflet]')) {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
        css.dataset.leaflet = 'true';
        document.head.appendChild(css);
    }
    return new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-leaflet]');
        const script = existing || document.createElement('script');
        script.addEventListener('load', () => resolve(w.L));
        script.addEventListener('error', reject);
        if (!existing) {
            script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
            script.dataset.leaflet = 'true';
            document.body.appendChild(script);
        }
    });
}

export default function TravelMap() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let map: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        let observer: MutationObserver | undefined;
        let cancelled = false;

        loadLeaflet().then((L) => {
            if (cancelled || !ref.current) return;
            const isDark = () => document.documentElement.classList.contains('dark');
            const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a562';

            map = L.map(ref.current, { scrollWheelZoom: false, worldCopyJump: true, minZoom: 1 });
            L.tileLayer(TILE_URL, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
            }).addTo(map);
            const applyTheme = () => {
                map.getPane('tilePane').style.filter = isDark() ? DARK_TILE_FILTER : '';
            };
            applyTheme();

            PLACES.forEach((p) => {
                L.circleMarker([p.lat, p.lng], { radius: 6, color: '#fff', weight: 1.5, fillColor: accent, fillOpacity: 0.95 })
                    .bindTooltip(p.name, { direction: 'top', offset: [0, -6] })
                    .addTo(map);
            });
            map.fitBounds(L.latLngBounds(PLACES.map((p) => [p.lat, p.lng])), { padding: [24, 24] });

            // Follow the site theme when it changes.
            observer = new MutationObserver(applyTheme);
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        }).catch(() => { /* map stays hidden if the CDN is unreachable */ });

        return () => {
            cancelled = true;
            observer?.disconnect();
            map?.remove();
        };
    }, []);

    return (
        <div className="my-6">
            <div
                ref={ref}
                className="relative z-0 h-80 sm:h-96 w-full overflow-hidden rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
                aria-label="Map of places I have traveled"
            />
            <p className="mt-2 text-sm text-neutral-500">
                📍 {PLACES.length} places across {COUNTRIES.size} countries
            </p>
        </div>
    );
}
