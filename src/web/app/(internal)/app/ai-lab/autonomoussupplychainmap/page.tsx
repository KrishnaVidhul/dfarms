// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiMapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const AutonomousSupplyChainMap = () => {
  const [center, setCenter] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    // Example data: Replace with actual data fetching logic
    fetch('/api/supply-chain-data')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Update center and zoom based on data
      });
  }, []);

  return (
    <MapContainer style={{ height: '100vh', width: '100vw' }} center={center} zoom={zoom}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[51.5, -0.09]}>
        <Popup>
          A pretty CSS3 popup. Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default AutonomousSupplyChainMap;