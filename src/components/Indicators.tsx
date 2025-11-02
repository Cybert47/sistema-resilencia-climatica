import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [
  { zone: 'La María', AVCD: 78, CMSR: 45 },
  { zone: 'El Danubio', AVCD: 55, CMSR: 65 },
  { zone: 'San José', AVCD: 33, CMSR: 72 },
  { zone: 'La Esperanza', AVCD: 60, CMSR: 40 }
]

export default function Indicators(){
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-2xl font-semibold">Indicadores por zona</h3>
      <p className="text-text mt-2">Consulta el nivel de vulnerabilidad (AVCD) y resiliencia (CMSR) por sector.</p>

      <div style={{ width: '100%', height: 300 }} className="mt-6">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="zone" />
            <YAxis domain={[0,100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="AVCD" fill="#FF0000" />
            <Bar dataKey="CMSR" fill="#FFFFFF" stroke="#FF0000" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
