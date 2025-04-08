import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon} from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importe os ícones do marcador
// URL absoluto para evitar problemas de importação
const markerIcon = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

interface MapComponentProps {
  coordinates: [number, number];
  companyName: string;
  address: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ coordinates, companyName, address }) => {
  // Configuração do ícone do mapa
  const customIcon = new Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  // Convertendo as coordenadas para o tipo LatLngExpression
  const position: LatLngExpression = coordinates;

  return (
    <MapContainer 
      center={position}
      zoom={15} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <div>
            <strong>{companyName}</strong><br />
            {address}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;