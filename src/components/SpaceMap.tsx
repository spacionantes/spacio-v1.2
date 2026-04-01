import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Space } from "@/data/mockData";

// Fix default marker icons for Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface SpaceMapProps {
  spaces: Space[];
  onSpaceClick?: (space: Space) => void;
  selectedSpaceId?: string | null;
}

const SpaceMap = ({ spaces, onSpaceClick, selectedSpaceId }: SpaceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [48.8566, 2.3522],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous cluster group
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          className: "",
          html: `<div style="
            background: #2563eb;
            color: #ffffff;
            border: 2px solid #1d4ed8;
            border-radius: 9999px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${count}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
      },
    });

    const spacesWithCoords = spaces.filter((s) => s.lat != null && s.lng != null);

    spacesWithCoords.forEach((space) => {
      const isSelected = space.id === selectedSpaceId;

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background: ${isSelected ? "#2563eb" : "#ffffff"};
          color: ${isSelected ? "#ffffff" : "#1a1a1a"};
          border: 2px solid ${isSelected ? "#2563eb" : "#e5e7eb"};
          border-radius: 9999px;
          padding: 4px 10px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        ">${space.price_per_hour}€</div>`,
        iconSize: [60, 28],
        iconAnchor: [30, 14],
      });

      const marker = L.marker([space.lat!, space.lng!], { icon });

      const ratingDisplay = space.rating ? `<span style="margin-left:8px;font-size:12px">⭐ ${space.rating}</span>` : "";

      marker.bindPopup(
        `<div style="min-width:180px">
          <strong style="font-size:14px">${space.title}</strong><br/>
          <span style="color:#666;font-size:12px">${space.address}, ${space.city}</span><br/>
          <span style="font-weight:600;font-size:13px;color:#2563eb">${space.price_per_hour}€/h</span>
          ${ratingDisplay}
        </div>`,
        { closeButton: false, offset: [0, -5] }
      );

      marker.on("click", () => onSpaceClick?.(space));

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Fit bounds if we have markers
    if (spacesWithCoords.length > 0) {
      const bounds = L.latLngBounds(spacesWithCoords.map((s) => [s.lat!, s.lng!]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [spaces, selectedSpaceId, onSpaceClick]);

  return <div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }} />;
};

export default SpaceMap;
