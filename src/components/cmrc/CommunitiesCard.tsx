import React from 'react'

export default function CommunitiesCard(){
  return (
    <div className="kpi-card bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Comunidades (DANE 2018)</h2>
      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <h3 className="font-semibold text-gray-700">Barrio El Danubio</h3>
          <p className="text-sm text-gray-600">Población: ~3,460 | <span className="text-red-600 font-medium">1,384 en Riesgo Alto</span></p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Barrio La María</h3>
          <p className="text-sm text-gray-600">Población: ~2,540 | <span className="text-amber-600 font-medium">1,016 en Riesgo Medio</span></p>
        </div>
      </div>
    </div>
  )
}
