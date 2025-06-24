"use client";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Laporan } from "@/types/laporan";

type MultipleMarkerMapProps = {
  laporanList: Laporan[];
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MultipleMarkerMap({ laporanList }: MultipleMarkerMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedLaporan, setSelectedLaporan] = useState<Laporan | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi pengguna:", error);
          setUserLocation({ lat: -6.2, lng: 106.8 }); // fallback ke Jakarta
        }
      );
    } else {
      console.warn("Geolocation tidak didukung browser ini.");
      setUserLocation({ lat: -6.2, lng: 106.8 }); // fallback
    }
  }, []);

  if (!isLoaded || !userLocation) return <p>Memuat peta...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={13}>
      {/* Marker lokasi pengguna */}
      <Marker
        position={userLocation}
        label={{
          text: "Lokasi Anda",
          fontSize: "12px",
          fontWeight: "bold",
          color: "blue",
        }}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        }}
      />

      {/* Marker laporan */}
      {laporanList?.map((laporan) => (
        <Marker
          key={laporan.laporan_id}
          position={{ lat: laporan.lokasi?.lat || 0, lng: laporan.lokasi?.long || 0 }}
          label={{
            text: "Sampah Terdeteksi",
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
            className: "bg-red-500 px-1 py-0.5 rounded mb-12",
          }}
          onClick={() => setSelectedLaporan(laporan)}
        />
      ))}

      {/* InfoWindow jika marker dipilih */}
      {selectedLaporan && (
        <InfoWindow
          position={{
            lat: selectedLaporan.lokasi?.lat || 0,
            lng: selectedLaporan.lokasi?.long || 0,
          }}
          onCloseClick={() => setSelectedLaporan(null)}
        >
          <div>
            <p className="font-semibold text-sm">{selectedLaporan.judul}</p>
            <p className="text-xs text-gray-500">Sampah terdeteksi</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
