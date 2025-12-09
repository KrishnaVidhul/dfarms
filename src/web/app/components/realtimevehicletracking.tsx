// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card } from '@components/ui/card';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LucideIcon from 'lucide-react';

const RealTimeVehicleTracking = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Simulate fetching real-time vehicle data
    const fetchVehicles = async () => {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data);
    };

    fetchVehicles();
    setInterval(fetchVehicles, 5000); // Update every 5 seconds
  }, []);

  return (
    <Card className="bg-zinc-900 shadow-lg rounded-md border border-zinc-800">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold text-white">Real-Time Vehicle Tracking</h2>
        <LucideIcon name="refresh-cw" size={16} className="text-white cursor-pointer" />
      </div>
      <LeafletMap
        center={[51.505, -0.09]} // Default to London coordinates
        zoom={13}
        style={{ height: '400px' }}
        className="bg-zinc-800"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map((vehicle) => (
          <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
            <Popup>
              <div className="bg-zinc-900 shadow-lg rounded-md p-2">
                <h3 className="text-white font-semibold">{vehicle.name}</h3>
                <p className="text-white">Speed: {vehicle.speed} km/h</p>
                <p className="text-white">Direction: {vehicle.direction}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>
    </Card>
  );
};

export default RealTimeVehicleTracking;