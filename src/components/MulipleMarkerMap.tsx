"use client";
import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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

  if (!isLoaded) return <p>Memuat peta...</p>;

  const center = laporanList.length
    ? { lat: laporanList[0].lokasi?.lat || 0, lng: laporanList[0].lokasi?.long || 0 }
    : { lat: -6.2, lng: 106.8 }; 

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
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
