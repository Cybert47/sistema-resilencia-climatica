import React, { useState } from 'react'

// Small component that dispatches an event to MapView to show/hide simulated EDAN points
export default function Candidate(){
  const [show, setShow] = useState(false)

  function toggle(){
    const next = !show
    setShow(next)
    // sample simulated EDAN points (lat, lng, tragedy, volunteerCode, responseTime)
    const points = next ? [
      { id: 'edan-1', coord: [4.588, -74.205], tragedy: 'Inundación moderada', code: 'V-001', response: '12 min' },
      { id: 'edan-2', coord: [4.5895, -74.212], tragedy: 'Deslizamiento leve', code: 'V-017', response: '8 min' },
      { id: 'edan-3', coord: [4.584, -74.218], tragedy: 'Inundación crítica', code: 'V-009', response: '5 min' }
    ] : []

    window.dispatchEvent(new CustomEvent('rcu:showEdanPoints', { detail: { show: next, points } }))
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="font-semibold">Candidato — EDAN (simulado)</h3>
      <p className="text-sm text-gray-600">Muestra en el mapa puntos generados por un EDAN de manera simulada.</p>
      <div className="mt-3">
        <button onClick={toggle} className={`px-4 py-2 rounded ${show ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          {show ? 'Ocultar puntos EDAN' : 'Mostrar puntos EDAN (simulado)'}
        </button>
      </div>
    </div>
  )
}
