import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon issue for many bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/src/assets/marker-icon-2x.png',
  iconUrl: '/src/assets/marker-icon.png',
  shadowUrl: '/src/assets/marker-shadow.png'
})

export default function MapSection(){
  const soacha = { lat: 4.5833, lng: -74.2167 }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-2xl font-semibold">Mapa comunitario</h3>
        <p className="text-text mt-2">Visualiza zonas en riesgo, puntos de encuentro, rutas seguras y reportes.</p>

        <div className="mt-4">
          <p className="text-text">Haz clic en un punto para ver detalles de AVCD / CMSR y estado.</p>
        </div>
      </div>

      <div style={{ minHeight: 300 }}>
        <MapContainer center={[soacha.lat, soacha.lng]} zoom={13} style={{ height: '100%', minHeight: 300, width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[soacha.lat, soacha.lng]}>
            <Popup>
              <div>
                <strong>Zona: Soacha</strong>
                <div>AVCD: 60 — CMSR: 45</div>
                <div>Estado: Normal</div>
                <button className="mt-2 px-3 py-1 border rounded text-sm text-text">Ver rutas seguras</button>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}
