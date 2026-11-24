'use client';

import { useEffect, useRef } from 'react';

type Photo = { src: string; thumb: string; alt: string };
type Place = { name: string; lat: number; lng: number; photos: Photo[] };

// Places on the travel map with their photos (thumbnails live in /hobbies/thumbs/).
// To add a place, add a line; to add a photo, append it to that place's photos.
const PLACES: Place[] = [
    { name: "Seattle, Washington", lat: 47.61, lng: -122.33, photos: [{"src": "/hobbies/travel-33.jpg", "thumb": "/hobbies/thumbs/travel-33.jpg", "alt": "Night portrait with the city skyline"}, {"src": "/hobbies/travel-38.jpg", "thumb": "/hobbies/thumbs/travel-38.jpg", "alt": "Light trails over the city at night"}, {"src": "/hobbies/travel-32.jpg", "thumb": "/hobbies/thumbs/travel-32.jpg", "alt": "Golden larches after snowfall"}] },
    { name: "North Cascades, Washington", lat: 48.77, lng: -121.3, photos: [{"src": "/hobbies/hiking-2.jpg", "thumb": "/hobbies/thumbs/hiking-2.jpg", "alt": "North Cascades National Park"}, {"src": "/hobbies/hiking-10.jpg", "thumb": "/hobbies/thumbs/hiking-10.jpg", "alt": "Alpine lake among golden larches"}] },
    { name: "Maple Pass Loop, Washington", lat: 48.51, lng: -120.73, photos: [{"src": "/hobbies/hiking-9.jpg", "thumb": "/hobbies/thumbs/hiking-9.jpg", "alt": "Alpine valley under fresh snow"}] },
    { name: "Los Angeles, California", lat: 34.05, lng: -118.24, photos: [{"src": "/hobbies/travel-2.jpg", "thumb": "/hobbies/thumbs/travel-2.jpg", "alt": "Meeting Mickey at Disneyland"}] },
    { name: "San Diego, California", lat: 32.72, lng: -117.16, photos: [{"src": "/hobbies/travel-28.jpg", "thumb": "/hobbies/thumbs/travel-28.jpg", "alt": "Aircraft carrier island"}, {"src": "/hobbies/travel-13.jpg", "thumb": "/hobbies/thumbs/travel-13.jpg", "alt": "Plane on the flight deck"}, {"src": "/hobbies/travel-63.jpg", "thumb": "/hobbies/thumbs/travel-63.jpg", "alt": "Pink sunset over the Pacific"}] },
    { name: "Sequoia National Park, California", lat: 36.49, lng: -118.57, photos: [{"src": "/hobbies/travel-25.jpg", "thumb": "/hobbies/thumbs/travel-25.jpg", "alt": "Mountains under clouds"}] },
    { name: "Park City, Utah", lat: 40.65, lng: -111.5, photos: [{"src": "/hobbies/skiing-3.jpg", "thumb": "/hobbies/thumbs/skiing-3.jpg", "alt": "Slopes at Deer Valley Resort"}] },
    { name: "Denver, Colorado", lat: 39.74, lng: -104.99, photos: [{"src": "/hobbies/skiing-1.jpg", "thumb": "/hobbies/thumbs/skiing-1.jpg", "alt": "Skiing at the base of the mountain"}] },
    { name: "Phoenix, Arizona", lat: 33.45, lng: -112.07, photos: [{"src": "/hobbies/hiking-5.jpg", "thumb": "/hobbies/thumbs/hiking-5.jpg", "alt": "Sunset at South Mountain, Phoenix"}, {"src": "/hobbies/travel-10.jpg", "thumb": "/hobbies/thumbs/travel-10.jpg", "alt": "Pink desert sunset"}] },
    { name: "Camelback Mountain, Arizona", lat: 33.52, lng: -111.96, photos: [{"src": "/hobbies/hiking-7.jpg", "thumb": "/hobbies/thumbs/hiking-7.jpg", "alt": "Summit of Camelback Mountain"}, {"src": "/hobbies/hiking-3.jpg", "thumb": "/hobbies/thumbs/hiking-3.jpg", "alt": "Scrambling over desert boulders"}, {"src": "/hobbies/hiking-8.jpg", "thumb": "/hobbies/thumbs/hiking-8.jpg", "alt": "Spring blossoms on Camelback Mountain"}] },
    { name: "Lake Pleasant, Arizona", lat: 33.85, lng: -112.27, photos: [{"src": "/hobbies/hiking-1.jpg", "thumb": "/hobbies/thumbs/hiking-1.jpg", "alt": "Saguaro at Lake Pleasant"}, {"src": "/hobbies/travel-34.jpg", "thumb": "/hobbies/thumbs/travel-34.jpg", "alt": "On a boat with friends"}] },
    { name: "Tucson, Arizona", lat: 32.22, lng: -110.97, photos: [{"src": "/hobbies/travel-9.jpg", "thumb": "/hobbies/thumbs/travel-9.jpg", "alt": "Saguaros at sunset"}] },
    { name: "Sedona, Arizona", lat: 34.87, lng: -111.76, photos: [{"src": "/hobbies/travel-11.jpg", "thumb": "/hobbies/thumbs/travel-11.jpg", "alt": "In front of the red rocks of Sedona"}, {"src": "/hobbies/travel-16.jpg", "thumb": "/hobbies/thumbs/travel-16.jpg", "alt": "Snow on red rocks"}, {"src": "/hobbies/travel-61.jpg", "thumb": "/hobbies/thumbs/travel-61.jpg", "alt": "Bell Rock under storm light"}] },
    { name: "Flagstaff, Arizona", lat: 35.2, lng: -111.65, photos: [{"src": "/hobbies/skiing-2.jpg", "thumb": "/hobbies/thumbs/skiing-2.jpg", "alt": "On the slopes at Arizona Snowbowl"}, {"src": "/hobbies/hiking-6.jpg", "thumb": "/hobbies/thumbs/hiking-6.jpg", "alt": "Exploring a lava tube cave"}] },
    { name: "Payson, Arizona", lat: 34.23, lng: -111.33, photos: [{"src": "/hobbies/hiking-4.jpg", "thumb": "/hobbies/thumbs/hiking-4.jpg", "alt": "Forest valley under a storm"}, {"src": "/hobbies/travel-55.jpg", "thumb": "/hobbies/thumbs/travel-55.jpg", "alt": "Sitting by a forest lake"}, {"src": "/hobbies/travel-62.jpg", "thumb": "/hobbies/thumbs/travel-62.jpg", "alt": "Fallen log in a blue lake"}, {"src": "/hobbies/travel-64.jpg", "thumb": "/hobbies/thumbs/travel-64.jpg", "alt": "Cleaning fresh-caught trout"}, {"src": "/hobbies/travel-65.jpg", "thumb": "/hobbies/thumbs/travel-65.jpg", "alt": "Pine-ringed lake"}] },
    { name: "Beijing, China", lat: 39.9, lng: 116.4, photos: [{"src": "/hobbies/travel-1.jpg", "thumb": "/hobbies/thumbs/travel-1.jpg", "alt": "By the lake in Beihai Park, Beijing"}, {"src": "/hobbies/travel-36.jpg", "thumb": "/hobbies/thumbs/travel-36.jpg", "alt": "In a qipao at a classical courtyard"}, {"src": "/hobbies/travel-35.jpg", "thumb": "/hobbies/thumbs/travel-35.jpg", "alt": "Lakeside at dusk"}] },
    { name: "Tsingtao, China", lat: 36.07, lng: 120.38, photos: [{"src": "/hobbies/travel-14.jpg", "thumb": "/hobbies/thumbs/travel-14.jpg", "alt": "At the aquarium"}] },
    { name: "Nanjing, China", lat: 32.06, lng: 118.8, photos: [{"src": "/hobbies/travel-15.jpg", "thumb": "/hobbies/thumbs/travel-15.jpg", "alt": "Pagoda on a green hill"}, {"src": "/hobbies/travel-23.jpg", "thumb": "/hobbies/thumbs/travel-23.jpg", "alt": "Gate tower among trees"}] },
    { name: "Henan, China", lat: 34.75, lng: 113.62, photos: [{"src": "/hobbies/travel-39.jpg", "thumb": "/hobbies/thumbs/travel-39.jpg", "alt": "Pavilion among green mountains"}] },
    { name: "Nuodeng, Yunnan", lat: 25.8, lng: 99.43, photos: [{"src": "/hobbies/travel-37.jpg", "thumb": "/hobbies/thumbs/travel-37.jpg", "alt": "Hillside village of earthen houses"}] },
    { name: "Bangchuidao Scenic Area, Dalian", lat: 38.88, lng: 121.7, photos: [{"src": "/hobbies/travel-66.jpg", "thumb": "/hobbies/thumbs/travel-66.jpg", "alt": "Sea through the pines"}, {"src": "/hobbies/travel-68.jpg", "thumb": "/hobbies/thumbs/travel-68.jpg", "alt": "Pink balloons in a blue sky"}, {"src": "/hobbies/travel-70.jpg", "thumb": "/hobbies/thumbs/travel-70.jpg", "alt": "Sea beyond an iron fence"}] },
    { name: "Dali, Yunnan", lat: 25.61, lng: 100.27, photos: [{"src": "/hobbies/travel-67.jpg", "thumb": "/hobbies/thumbs/travel-67.jpg", "alt": "Butterfly among wildflowers"}, {"src": "/hobbies/travel-73.jpg", "thumb": "/hobbies/thumbs/travel-73.jpg", "alt": "Baskets of rose petals"}] },
    { name: "Kaulbachstraße 49, Munich", lat: 48.152, lng: 11.582, photos: [{"src": "/hobbies/travel-69.jpg", "thumb": "/hobbies/thumbs/travel-69.jpg", "alt": "Flowers in hanging bottles"}, {"src": "/hobbies/travel-71.jpg", "thumb": "/hobbies/thumbs/travel-71.jpg", "alt": "Torches at the summer festival"}, {"src": "/hobbies/travel-74.jpg", "thumb": "/hobbies/thumbs/travel-74.jpg", "alt": "Campfire with friends"}] },
    { name: "Leshan, Sichuan", lat: 29.52, lng: 103.33, photos: [{"src": "/hobbies/travel-72.jpg", "thumb": "/hobbies/thumbs/travel-72.jpg", "alt": "Golden Summit of Mount Emei"}] },
    { name: "Guangzhou, China", lat: 23.13, lng: 113.26, photos: [{"src": "/hobbies/travel-47.jpg", "thumb": "/hobbies/thumbs/travel-47.jpg", "alt": "Riverside at night"}, {"src": "/hobbies/travel-52.jpg", "thumb": "/hobbies/thumbs/travel-52.jpg", "alt": "City lights along the Pearl River"}] },
    { name: "Shanghai, China", lat: 31.23, lng: 121.47, photos: [{"src": "/hobbies/travel-48.jpg", "thumb": "/hobbies/thumbs/travel-48.jpg", "alt": "Bonjour Art Book Fair guide paper"}, {"src": "/hobbies/travel-51.jpg", "thumb": "/hobbies/thumbs/travel-51.jpg", "alt": "At an art exhibition"}] },
    { name: "Weizhou Island, China", lat: 21.04, lng: 109.11, photos: [{"src": "/hobbies/travel-49.jpg", "thumb": "/hobbies/thumbs/travel-49.jpg", "alt": "Storm clouds over the beach"}] },
    { name: "Beihai, China", lat: 21.48, lng: 109.12, photos: [{"src": "/hobbies/travel-50.jpg", "thumb": "/hobbies/thumbs/travel-50.jpg", "alt": "Lifeguard tower on the beach"}] },
    { name: "Bali, Indonesia", lat: -8.34, lng: 115.09, photos: [{"src": "/hobbies/travel-12.jpg", "thumb": "/hobbies/thumbs/travel-12.jpg", "alt": "Stormy sunset over the ocean"}, {"src": "/hobbies/travel-26.jpg", "thumb": "/hobbies/thumbs/travel-26.jpg", "alt": "Plumeria against blue sky"}] },
    { name: "Bogor, Indonesia", lat: -6.6, lng: 106.8, photos: [{"src": "/hobbies/travel-29.jpg", "thumb": "/hobbies/thumbs/travel-29.jpg", "alt": "Sunlight through tall forest"}, {"src": "/hobbies/travel-27.jpg", "thumb": "/hobbies/thumbs/travel-27.jpg", "alt": "Moss on a tree trunk"}] },
    { name: "BSD City, Indonesia", lat: -6.3, lng: 106.65, photos: [] },
    { name: "Pulau Pramuka, Indonesia", lat: -5.75, lng: 106.61, photos: [{"src": "/hobbies/travel-24.jpg", "thumb": "/hobbies/thumbs/travel-24.jpg", "alt": "Harbor at sunset"}] },
    { name: "Jakarta, Indonesia", lat: -6.21, lng: 106.85, photos: [{"src": "/hobbies/travel-53.jpg", "thumb": "/hobbies/thumbs/travel-53.jpg", "alt": "Colorful shophouse facades"}] },
    { name: "Tangerang, Indonesia", lat: -6.18, lng: 106.63, photos: [{"src": "/hobbies/travel-54.jpg", "thumb": "/hobbies/thumbs/travel-54.jpg", "alt": "Rambutan in a bamboo cup"}, {"src": "/hobbies/travel-56.jpg", "thumb": "/hobbies/thumbs/travel-56.jpg", "alt": "Passion fruit on the vine"}] },
    { name: "Saguaro Lake, Arizona", lat: 33.57, lng: -111.53, photos: [{"src": "/hobbies/travel-57.jpg", "thumb": "/hobbies/thumbs/travel-57.jpg", "alt": "Bronze wind bell"}, {"src": "/hobbies/travel-58.jpg", "thumb": "/hobbies/thumbs/travel-58.jpg", "alt": "Blooming saguaro by the lake"}, {"src": "/hobbies/travel-59.jpg", "thumb": "/hobbies/thumbs/travel-59.jpg", "alt": "Boats at the dock"}] },
    { name: "Tempe, Arizona", lat: 33.42, lng: -111.94, photos: [{"src": "/hobbies/travel-60.jpg", "thumb": "/hobbies/thumbs/travel-60.jpg", "alt": "Palm tree on campus"}] },
    { name: "Amsterdam, Netherlands", lat: 52.37, lng: 4.9, photos: [{"src": "/hobbies/travel-19.jpg", "thumb": "/hobbies/thumbs/travel-19.jpg", "alt": "Tulip market"}] },
    { name: "Rotterdam, Netherlands", lat: 51.92, lng: 4.48, photos: [{"src": "/hobbies/travel-41.jpg", "thumb": "/hobbies/thumbs/travel-41.jpg", "alt": "Canals and windmills in the Netherlands"}] },
    { name: "Munich, Germany", lat: 48.14, lng: 11.58, photos: [{"src": "/hobbies/travel-42.jpg", "thumb": "/hobbies/thumbs/travel-42.jpg", "alt": "Propylaea at Königsplatz"}, {"src": "/hobbies/travel-43.jpg", "thumb": "/hobbies/thumbs/travel-43.jpg", "alt": "Old Town Hall tower"}, {"src": "/hobbies/travel-45.jpg", "thumb": "/hobbies/thumbs/travel-45.jpg", "alt": "Palace reflected in the water"}] },
    { name: "Neuschwanstein, Germany", lat: 47.56, lng: 10.75, photos: [{"src": "/hobbies/travel-46.jpg", "thumb": "/hobbies/thumbs/travel-46.jpg", "alt": "Neuschwanstein Castle"}] },
    { name: "Milan, Italy", lat: 45.46, lng: 9.19, photos: [{"src": "/hobbies/travel-5.jpg", "thumb": "/hobbies/thumbs/travel-5.jpg", "alt": "Milan Cathedral"}, {"src": "/hobbies/travel-6.jpg", "thumb": "/hobbies/thumbs/travel-6.jpg", "alt": "Piazza del Duomo, Milan"}] },
    { name: "Lake Como, Italy", lat: 45.81, lng: 9.09, photos: [{"src": "/hobbies/travel-4.jpg", "thumb": "/hobbies/thumbs/travel-4.jpg", "alt": "Overlooking Lake Como"}, {"src": "/hobbies/travel-3.jpg", "thumb": "/hobbies/thumbs/travel-3.jpg", "alt": "Palms above Lake Como"}, {"src": "/hobbies/travel-7.jpg", "thumb": "/hobbies/thumbs/travel-7.jpg", "alt": "Como waterfront at sunset"}] },
    { name: "Barcelona, Spain", lat: 41.39, lng: 2.17, photos: [{"src": "/hobbies/travel-20.jpg", "thumb": "/hobbies/thumbs/travel-20.jpg", "alt": "Inside the Sagrada Familia"}, {"src": "/hobbies/travel-22.jpg", "thumb": "/hobbies/thumbs/travel-22.jpg", "alt": "Casa Batllo"}, {"src": "/hobbies/travel-31.jpg", "thumb": "/hobbies/thumbs/travel-31.jpg", "alt": "Rooftop of Casa Mila"}, {"src": "/hobbies/travel-21.jpg", "thumb": "/hobbies/thumbs/travel-21.jpg", "alt": "Palm trees at sunset"}] },
    { name: "Athens, Greece", lat: 37.98, lng: 23.73, photos: [{"src": "/hobbies/travel-30.jpg", "thumb": "/hobbies/thumbs/travel-30.jpg", "alt": "Looking out to sea together"}] },
    { name: "Santorini, Greece", lat: 36.39, lng: 25.46, photos: [{"src": "/hobbies/travel-17.jpg", "thumb": "/hobbies/thumbs/travel-17.jpg", "alt": "Cafe at dusk in Santorini"}, {"src": "/hobbies/travel-18.jpg", "thumb": "/hobbies/thumbs/travel-18.jpg", "alt": "Blue glassware at night"}, {"src": "/hobbies/travel-44.jpg", "thumb": "/hobbies/thumbs/travel-44.jpg", "alt": "Santorini at night"}] },
    { name: "Aegean Sea, Greece", lat: 37.0, lng: 24.6, photos: [{"src": "/hobbies/travel-8.jpg", "thumb": "/hobbies/thumbs/travel-8.jpg", "alt": "Ferry wake on the Aegean Sea"}] },
];

const US_STATES = ['Washington', 'California', 'Utah', 'Colorado', 'Arizona'];
const COUNTRIES = new Set(PLACES.map((p) => {
    const tail = p.name.split(', ').pop() || '';
    return US_STATES.includes(tail) ? 'United States' : tail === 'Yunnan' ? 'China' : tail;
}));

const LEAFLET = 'https://unpkg.com/leaflet@1.9.4/dist';
const CLUSTER = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist';
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
// OpenStreetMap has no free dark style, so dark mode inverts the tiles instead.
const DARK_TILE_FILTER = 'invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9)';

// Styles for the photo pins and the photo popup.
const MAP_CSS = `
.tm-pin { position: relative; width: 44px; height: 44px; border-radius: 9999px; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.35); background: #ccc center/cover no-repeat; }
.tm-pin:hover { transform: scale(1.12); z-index: 1000; }
.tm-count { position: absolute; right: -6px; top: -6px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9999px; background: var(--accent, #d4a562); color: #fff; font: 600 11px/18px system-ui, sans-serif; text-align: center; border: 1.5px solid #fff; }
.tm-dot { width: 12px; height: 12px; border-radius: 9999px; background: var(--accent, #d4a562); border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,.35); }
.tm-popup .leaflet-popup-content { margin: 10px 12px; }
.tm-popup h4 { margin: 0 0 8px; font: 600 13px/1.3 system-ui, sans-serif; color: #111; }
.tm-grid { display: grid; grid-template-columns: repeat(3, 72px); gap: 6px; max-height: 236px; overflow-y: auto; }
.tm-grid a { display: block; width: 72px; height: 72px; border-radius: 6px; overflow: hidden; }
.tm-grid img { width: 100%; height: 100%; object-fit: cover; transition: transform .2s; }
.tm-grid a:hover img { transform: scale(1.08); }
`;

type LeafletWindow = Window & { L?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

function loadCss(href: string) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
        if (existing?.dataset.loaded) return resolve();
        const script = existing || document.createElement('script');
        script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); });
        script.addEventListener('error', reject);
        if (!existing) {
            script.src = src;
            document.body.appendChild(script);
        }
    });
}

// Loads Leaflet and its clustering plugin from a CDN once, so the map adds no npm dependency.
async function loadLeaflet() {
    loadCss(`${LEAFLET}/leaflet.css`);
    loadCss(`${CLUSTER}/MarkerCluster.css`);
    if (!document.getElementById('tm-style')) {
        const style = document.createElement('style');
        style.id = 'tm-style';
        style.textContent = MAP_CSS;
        document.head.appendChild(style);
    }
    await loadScript(`${LEAFLET}/leaflet.js`);
    await loadScript(`${CLUSTER}/leaflet.markercluster.js`);
    return (window as LeafletWindow).L;
}

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

function pinHtml(thumb: string | undefined, count: number) {
    if (!thumb) return '<div class="tm-dot"></div>';
    const badge = count > 1 ? `<span class="tm-count">${count}</span>` : '';
    return `<div class="tm-pin" style="background-image:url('${thumb}')">${badge}</div>`;
}

function popupHtml(place: Place) {
    const photos = place.photos
        .map((p) => `<a href="${p.src}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(p.alt)}"><img src="${p.thumb}" alt="${escapeHtml(p.alt)}" loading="lazy"></a>`)
        .join('');
    return `<h4>📍 ${escapeHtml(place.name)}</h4><div class="tm-grid">${photos}</div>`;
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

            map = L.map(ref.current, { scrollWheelZoom: false, worldCopyJump: true, minZoom: 1 });
            L.tileLayer(TILE_URL, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
            }).addTo(map);
            const applyTheme = () => {
                map.getPane('tilePane').style.filter = isDark() ? DARK_TILE_FILTER : '';
            };
            applyTheme();

            // Nearby places merge into one pin showing a photo and the total photo count; clicking zooms in.
            const clusters = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 45,
                iconCreateFunction: (cluster: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    const places: Place[] = cluster.getAllChildMarkers().map((m: any) => m.options.place); // eslint-disable-line @typescript-eslint/no-explicit-any
                    const thumb = places.find((p) => p.photos.length)?.photos[0].thumb;
                    const count = places.reduce((sum, p) => sum + p.photos.length, 0);
                    return L.divIcon({ html: pinHtml(thumb, count), className: '', iconSize: [44, 44] });
                },
            });

            PLACES.forEach((place) => {
                const first = place.photos[0]?.thumb;
                const icon = L.divIcon({ html: pinHtml(first, place.photos.length), className: '', iconSize: first ? [44, 44] : [12, 12] });
                const marker = L.marker([place.lat, place.lng], { icon, place, title: place.name });
                if (place.photos.length) marker.bindPopup(popupHtml(place), { className: 'tm-popup', maxWidth: 260 });
                else marker.bindTooltip(place.name, { direction: 'top' });
                clusters.addLayer(marker);
            });
            map.addLayer(clusters);
            map.fitBounds(L.latLngBounds(PLACES.map((p) => [p.lat, p.lng])), { padding: [30, 30] });

            // Follow the site theme when it changes.
            observer = new MutationObserver(applyTheme);
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        }).catch(() => { /* map stays empty if the CDN is unreachable */ });

        return () => {
            cancelled = true;
            observer?.disconnect();
            map?.remove();
        };
    }, []);

    const photoCount = PLACES.reduce((sum, p) => sum + p.photos.length, 0);
    return (
        <div className="my-6">
            <div
                ref={ref}
                className="relative z-0 h-[26rem] sm:h-[30rem] w-full overflow-hidden rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
                aria-label="Map of places I have traveled, with photos"
            />
            <p className="mt-2 text-sm text-neutral-500">
                📍 {PLACES.length} places across {COUNTRIES.size} countries · {photoCount} photos. Click a photo pin to see the pictures taken there.
            </p>
        </div>
    );
}
