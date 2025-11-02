import React from 'react'

export default function ConclusionsCard(){
  return (
    <div className="kpi-card bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Conclusiones Clave</h2>
      <ul className="space-y-3">
        <li className="flex items-start">
          <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span className="text-gray-700">La comunidad enfrenta una <strong>alta vulnerabilidad</strong> general frente a inundaciones.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-cruzroja-red mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.982A10.02 10.02 0 0012 2C6.477 2 2 6.477 2 12s4.477 10 10 10c2.485 0 4.796-.898 6.618-2.42m2.364-13.56A10.02 10.02 0 0122 12c0 1.643-.398 3.188-1.13 4.58M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="text-gray-700"><strong>Capital Natural y Financiero</strong> son los puntos más débiles y críticos.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z"/></svg>
          <span className="text-gray-700">Alta <strong>conciencia del riesgo</strong> (78%), pero muy <strong>baja capacidad de respuesta</strong> (62%).</span>
        </li>
      </ul>
    </div>
  )
}
