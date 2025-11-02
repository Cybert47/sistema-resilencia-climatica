import React, { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

type ChartType = 'pie' | 'bar'

const data = [
  { name: '18-29', value: 28 },
  { name: '30-49', value: 42 },
  { name: '50+', value: 30 },
]

const COLORS = ['#60A5FA', '#F59E0B', '#EF4444']

export default function DemographyCard(){
  const [chartType, setChartType] = useState<ChartType>('pie')

  return (
    <div className="kpi-card bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Población Encuestada</h2>
        <div className="ml-4 flex items-center gap-2">
          <label className="sr-only" htmlFor="chart-select">Seleccionar gráfico</label>
          <button
            aria-pressed={chartType === 'pie'}
            onClick={() => setChartType('pie')}
            className={`px-2 py-1 text-sm rounded ${chartType === 'pie' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            title="Gráfico circular"
          >
            Circular
          </button>
          <button
            aria-pressed={chartType === 'bar'}
            onClick={() => setChartType('bar')}
            className={`px-2 py-1 text-sm rounded ${chartType === 'bar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            title="Gráfico de barras"
          >
            Barras
          </button>
        </div>
      </div>

      <div className="w-full h-56 md:h-48">
        <ResponsiveContainer>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={38} outerRadius={64} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={24} />
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const p = payload[0]
                  const name = p.name as string
                  const val = p.value as number
                  const contextMap: Record<string,string> = {
                    '18-29': 'Porcentaje de la población 18-29 que reporta saber mitigar riesgos (medidas básicas).',
                    '30-49': 'Porcentaje de la población 30-49 con conocimiento de preparación ante inundaciones.',
                    '50+': 'Porcentaje de la población 50+ que indica prácticas de mitigación comunitaria.'
                  }
                  return (
                    <div className="bg-white p-2 rounded shadow text-sm">
                      <div className="font-medium">{name}: {val}%</div>
                      <div className="text-gray-600 mt-1">{contextMap[name] ?? 'Información simulada sobre preparación.'}</div>
                    </div>
                  )
                }}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Categoría', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Porcentaje', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null
                  const p = payload[0].payload as any
                  const name = p.name as string
                  const val = p.value as number
                  const contextMap: Record<string,string> = {
                    '18-29': 'Jóvenes (18-29): reportan mayor familiaridad con medidas de mitigación.',
                    '30-49': 'Adultos (30-49): alta participación en actividades comunitarias de preparación.',
                    '50+': 'Mayores (50+): experiencia local, menor acceso a formación formal.'
                  }
                  return (
                    <div className="bg-white p-2 rounded shadow text-sm">
                      <div className="font-medium">{name}: {val}%</div>
                      <div className="text-gray-600 mt-1">{contextMap[name] ?? 'Información simulada sobre preparación.'}</div>
                    </div>
                  )
                }}
              />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
