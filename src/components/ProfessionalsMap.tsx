"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Hardcoded city coordinates for demo (should use geocoding in production)
const cityCoords: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  Ahmedabad: [23.0225, 72.5714],
  Kolkata: [22.5726, 88.3639],
  Hyderabad: [17.385, 78.4867],
};

export default function ProfessionalsMap({ locations }: { locations: string[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uniqueLocations = useMemo(() => Array.from(new Set(locations)), [locations]);

  if (!isMounted) {
    return <div style={{ width: "100%", height: 400, marginTop: 32 }} />;
  }

  return (
    <div style={{ width: "100%", height: 400, marginTop: 32 }}>
      <MapContainer
        center={[21.1466, 79.0888]} // Center of India
        zoom={4.5}
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
        scrollWheelZoom={false}
        whenReady={() => setIsMapReady(true)}
      >
        {isMapReady ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : null}
        {uniqueLocations.map((city) =>
          cityCoords[city] ? (
            <CircleMarker
              key={city}
              center={cityCoords[city]}
              radius={8}
              pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 1, weight: 2 }}
            >
              <Popup>{city}</Popup>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
