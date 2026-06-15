import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Map, Mail, ArrowRight } from "lucide-react";
import type { Community } from "@/lib/supabase/types";
import "leaflet/dist/leaflet.css";

function InstagramIcon({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Madura island bounds for focusing the map
const MADURA_CENTER: [number, number] = [-7.05, 113.4];
const MADURA_BOUNDS: [[number, number], [number, number]] = [
  [-7.3, 112.6],
  [-6.8, 114.2],
];

interface MapCommunityMaduraProps {
  communities?: Community[];
  maxLegend?: number;
}

// Leaflet map component - must be client-only (uses window)
function LeafletMap({ communities }: { communities: Community[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  // Load Leaflet once
  useEffect(() => {
    if (mapInstanceRef.current) return;

    Promise.all([import("leaflet"), import("react-leaflet")]).then(
      ([leaflet]) => {
        // Fix default marker icon path issue
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        if (!mapContainerRef.current) return;

        const map = leaflet.map(mapContainerRef.current, {
          center: MADURA_CENTER,
          zoom: 10,
          scrollWheelZoom: false,
          zoomControl: false,
        });

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          })
          .addTo(map);

        map.fitBounds(MADURA_BOUNDS);
        mapInstanceRef.current = map;
        markersLayerRef.current = leaflet.layerGroup().addTo(map);
        setL(leaflet);
      }
    );

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when communities change
  useEffect(() => {
    if (!L || !markersLayerRef.current || !mapInstanceRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    if (communities.length === 0) return;

    // Group communities by exact coordinates to prevent overlaps
    const groupedByCoords: Record<string, Community[]> = {};
    communities.forEach((c) => {
      // Use 5 decimal places precision (approx 1 meter)
      const key = `${c.latitude.toFixed(5)},${c.longitude.toFixed(5)}`;
      if (!groupedByCoords[key]) {
        groupedByCoords[key] = [];
      }
      groupedByCoords[key].push(c);
    });

    // Calculate offset positions for communities at the exact same location
    const communityPositions: Record<string, [number, number]> = {};
    Object.entries(groupedByCoords).forEach(([coordKey, coordCommunities]) => {
      if (coordCommunities.length === 1) {
        const c = coordCommunities[0];
        communityPositions[c.id] = [c.latitude, c.longitude];
      } else {
        const [lat, lng] = coordKey.split(",").map(Number);
        // Apply a tiny offset step (approx 15-20 meters) so overlapping pins are distinguishable
        const offsetStep = 0.00015;
        coordCommunities.forEach((c, i) => {
          const angle = (2 * Math.PI * i) / coordCommunities.length;
          communityPositions[c.id] = [
            lat + offsetStep * Math.sin(angle),
            lng + offsetStep * Math.cos(angle),
          ];
        });
      }
    });

    // Add markers
    communities.forEach((community) => {
      const pos = communityPositions[community.id] || [
        community.latitude,
        community.longitude,
      ];

      const logoHtml = community.logo_url
        ? `<img src="${community.logo_url}" alt="${community.name}" class="w-full h-full object-contain" />`
        : `<div class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">${community.name.charAt(0).toUpperCase()}</div>`;

      const icon = L.divIcon({
        html: `<div class="community-marker">${logoHtml}</div>`,
        className: "community-icon",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker(pos as [number, number], { icon });

      const popupContent = `
        <div style="text-align:center;min-width:120px">
          <p style="font-weight:700;font-size:14px;margin:0 0 2px">${community.name}</p>
          <p style="font-size:12px;color:#888;margin:0 0 4px">${community.region}</p>
          ${community.instagram ? `<a href="https://instagram.com/${community.instagram}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#2563eb">@${community.instagram}</a>` : ""}
        </div>
      `;
      marker.bindPopup(popupContent);
      layer.addLayer(marker);
    });

    // Fit bounds to actual marker positions
    const positions = communities.map((c) => {
      const pos = communityPositions[c.id] || [c.latitude, c.longitude];
      return pos as [number, number];
    });

    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      mapInstanceRef.current.fitBounds(bounds.pad(0.3), { animate: true });
    }
  }, [L, communities]);

  return (
    <>
      {/* Custom CSS for community markers */}
      <style>{`
        .community-icon {
          background: transparent !important;
          border: none !important;
        }
        .community-marker {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: 2px solid hsl(0 0% 80% / 0.5);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .community-marker:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-content {
          margin: 12px 16px !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl" />
    </>
  );
}

export default function MapCommunityMadura({
  communities = [],
  maxLegend,
}: MapCommunityMaduraProps) {
  const displayCommunities = maxLegend
    ? communities.slice(0, maxLegend)
    : communities;
  const hasMore = maxLegend ? communities.length > maxLegend : false;

  return (
    <section className="w-full py-16 bg-background font-sans relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="mb-10 lg:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
            <span className="font-label text-[10px] font-bold uppercase tracking-widest">
              Our Network
            </span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span className="font-label text-[10px] font-bold uppercase tracking-widest">
              Madura Developer
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground leading-[1] tracking-tighter mb-4 font-display">
            Satu Pulau, <br className="md:hidden" />
            <span className="text-primary italic">Banyak Komunitas.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Penyebaran developer aktif di 4 kabupaten Pulau Madura.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Main Map Area */}
          <div className="flex-1 relative bg-muted/30 border-2 border-border/50 rounded-3xl overflow-hidden editorial-shadow flex flex-col">
            <div className="relative w-full aspect-video min-h-[400px]">
              <LeafletMap communities={communities} />
            </div>
          </div>

          {/* Legend Panel */}
          <motion.div
            className="w-full lg:w-80 bg-muted/20 border-2 border-border/50 rounded-3xl p-6 editorial-shadow flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-border/50">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <Map className="text-primary" size={24} />
              </div>
              <h3 className="text-foreground font-black text-xl font-display leading-tight">
                Area <br />
                <span className="text-muted-foreground text-sm font-bold font-sans">
                  Komunitas
                </span>
              </h3>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {displayCommunities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada komunitas terdaftar.
                </p>
              ) : (
                <>
                  {displayCommunities.map((item, i) => (
                    <motion.a
                      href={
                        item.instagram
                          ? `https://instagram.com/${item.instagram}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      key={item.id}
                      className="flex items-center justify-between group cursor-pointer p-4 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all active:scale-95"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border overflow-hidden p-0.5">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            {item.logo_url ? (
                              <img
                                src={item.logo_url}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-foreground font-black text-sm group-hover:text-primary transition-colors font-display tracking-wide">
                            {item.name}
                          </h4>
                          <p className="text-muted-foreground text-xs mt-0.5 capitalize font-bold">
                            {item.region}
                          </p>
                        </div>
                      </div>
                      {item.instagram && (
                        <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm text-foreground bg-background px-3 py-1.5 rounded-lg border-2 border-border/50 editorial-shadow group-hover:text-primary group-hover:border-primary/50 transition-colors">
                          <InstagramIcon
                            size={14}
                            className="text-muted-foreground group-hover:text-primary transition-colors"
                          />
                        </div>
                      )}
                    </motion.a>
                  ))}
                  {hasMore && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link
                        to="/community"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors group"
                      >
                        Lihat Semua Komunitas
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-2xl border-2 border-border/50 border-dashed text-center">
              <Mail size={18} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Komunitas kalian ingin ditampilkan di peta? Kontak admin via
                email:
                <br />
                <a
                  href="mailto:info.maduradev@gmail.com"
                  className="text-primary font-bold hover:underline mt-1 inline-block"
                >
                  info.maduradev@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
