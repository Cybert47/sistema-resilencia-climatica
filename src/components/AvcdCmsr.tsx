import React from 'react'

export default function AvcdCmsr(){
  return (
    <div id="avcd-summary" className="mt-6 container px-0">
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 rounded-lg shadow-sm bg-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-red-500 to-yellow-400 flex items-center justify-center text-white font-bold">A</div>
            </div>
            <div>
              <div className="font-semibold text-lg">AVCD</div>
              <div className="text-sm text-gray-600 mt-1">(Amenaza, Vulnerabilidad y Capacidad de Daño) — mide la probabilidad y severidad del impacto en una comunidad.</div>
              <ul className="mt-3 text-sm space-y-1">
                <li><strong>Verde (Bajo)</strong>: AVCD &lt; 60 — impacto limitado, medidas normales.</li>
                <li><strong>Amarillo (Medio)</strong>: 60 ≤ AVCD &lt; 75 — mayor vigilancia y preparación.</li>
                <li><strong>Rojo (Alto)</strong>: AVCD ≥ 75 — riesgo alto; activar medidas de respuesta.</li>
              </ul>
              <div className="mt-3 flex gap-2">
                <span className="px-3 py-1 rounded bg-green-600 text-white text-xs">Verde</span>
                <span className="px-3 py-1 rounded bg-yellow-500 text-black text-xs">Amarillo</span>
                <span className="px-3 py-1 rounded bg-red-600 text-white text-xs">Rojo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
