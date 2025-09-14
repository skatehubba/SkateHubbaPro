"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPage() {
  return (
    <div className="h-screen w-full">
      <MapContainer center={[34.05, -118.25]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[34.05, -118.25]}>
          <Popup>Legendary spot: Hollywood High</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
