import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

type MapViewProps = {
  latitude: number;
  longitude: number;
};

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function MapView({ latitude, longitude }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <p>Memuat peta...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: latitude, lng: longitude }}
      zoom={16}
    >
      <Marker position={{ lat: latitude, lng: longitude }}>
        <InfoWindow position={{ lat: latitude, lng: longitude }}>
          <div className="text-sm font-semibold text-error-main">
            Sampah Terdeteksi
          </div>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  );
}
