import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

type EDANPoint = { id: string, lat: number, lng: number, tragedy: string, volunteerCode: string, responseTime: string }

const SAMPLE: EDANPoint[] = [
  { id: 'e1', lat: 4.589, lng: -74.205, tragedy: 'Inundación local', volunteerCode: 'CRC-1234', responseTime: '00:12' },
  { id: 'e2', lat: 4.583, lng: -74.215, tragedy: 'Deslizamiento', volunteerCode: 'CRC-5678', responseTime: '00:25' },
  { id: 'e3', lat: 4.580, lng: -74.208, tragedy: 'Corte eléctrico', volunteerCode: 'VOL-0001', responseTime: '00:08' }
]

export default function CandidateSection(){
  return (
    <section id="candidato" className="my-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Candidato — Puntos EDAN (simulado)</h2>
        <div className="text-sm text-gray-600">Mostrando solo lo esencial: tragedia, código voluntario y tiempo de respuesta</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div style={{ height: 300 }} className="rounded overflow-hidden">
          <MapContainer center={[4.587, -74.210]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            {SAMPLE.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng] as any}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{p.tragedy}</div>
                    <div className="text-xs text-gray-600">Código: {p.volunteerCode}</div>
                    <div className="text-xs text-gray-600">Tiempo de respuesta: {p.responseTime}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  )
}
