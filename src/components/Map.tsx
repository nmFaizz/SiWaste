"use client"
import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

type Location = {
  id: number;
  lat: number;
  lng: number;
  title: string;
};

const locations: Location[] = [
  { id: 1, lat: -6.2, lng: 106.816666, title: "Jakarta" },
  { id: 2, lat: -7.25, lng: 112.768845, title: "Surabaya" },
  { id: 3, lat: -6.9147, lng: 107.6098, title: "Bandung" }
];

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -6.2,
  lng: 106.816666,
};

const MapComponent: React.FC = () => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: 'YOUR_API_KEY_HERE',
//   });

//   if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          title={loc.title}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
