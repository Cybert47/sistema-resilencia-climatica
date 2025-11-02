import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const demographyData = [
  { name: 'Mujeres', value: 67 },
  { name: 'Hombres', value: 33 },
]

const COLORS = ['#E00000', '#4b5563']

export default function CMRCDetails({ onClose }: { onClose?: () => void }){
  const [activeTab, setActiveTab] = useState<string>('humano')
  const [animatedBars, setAnimatedBars] = useState<Record<string,string>>({})

  useEffect(()=>{
    // animar barras progresivas como en tu HTML original
    const progress = {
      barHumano1: '62%',
      barHumano2: '90%',
      barHumano3: '78%',
      barHumano4: '27%',
      barFinanciero1: '81%',
      barFinanciero2: '50%',
      barFinanciero3: '70%',
      barSocial1: '88%',
      barFisico1: '50%'
    }
    // pequeña espera para permitir la transición CSS
    const t = setTimeout(()=> setAnimatedBars(progress), 120)
    return ()=> clearTimeout(t)
  }, [])

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Análisis de los 5 Capitales</h3>
          <p className="text-gray-600">Resultados clave del diagnóstico (CMRC)</p>
        </div>
        <div className="ml-4">
          <button
            onClick={() => onClose && onClose()}
            className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Ocultar detalles"
          >
            Ocultar detalle
          </button>
        </div>
      </div>

      <div className="mb-4">
        <nav className="flex gap-2 overflow-x-auto pb-1">
          <button className={`tab-button ${activeTab==='humano'?'active':''}`} onClick={()=>setActiveTab('humano')}>Capital Humano</button>
          <button className={`tab-button ${activeTab==='financiero'?'active':''}`} onClick={()=>setActiveTab('financiero')}>Capital Financiero</button>
          <button className={`tab-button ${activeTab==='social'?'active':''}`} onClick={()=>setActiveTab('social')}>Capital Social</button>
          <button className={`tab-button ${activeTab==='fisico'?'active':''}`} onClick={()=>setActiveTab('fisico')}>Capital Físico</button>
          <button className={`tab-button ${activeTab==='natural'?'active':''}`} onClick={()=>setActiveTab('natural')}>Capital Natural</button>
        </nav>
      </div>

      <div>
        {activeTab === 'humano' && (
          <div className="space-y-6">
            <p className="text-gray-700">Alta conciencia del riesgo, pero baja capacidad de respuesta y preparación técnica.</p>
            <div>
              <label className="font-semibold text-gray-700">¿Sabe cómo protegerse ante un evento?</label>
              <div className="progress-bar-container mt-2">
            <div className="progress-bar bg-amber-600" style={{width: animatedBars.barHumano1 || '4%'}} id="barHumano1">{animatedBars.barHumano1 || '...'}</div>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">¿Ha recibido formación en primeros auxilios?</label>
              <div className="progress-bar-container mt-2">
            <div className="progress-bar bg-orange-500" style={{width: animatedBars.barHumano2 || '4%'}} id="barHumano2">{animatedBars.barHumano2 || '...'}</div>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">¿Cree que el cambio climático aumenta las inundaciones?</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-blue-600" style={{width: animatedBars.barHumano3 || '4%'}} id="barHumano3">{animatedBars.barHumano3 || '...'}</div>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">¿Accede a las 3 comidas diarias?</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-red-700" style={{width: animatedBars.barHumano4 || '4%'}} id="barHumano4">{animatedBars.barHumano4 || '...'}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financiero' && (
          <div className="space-y-6">
            <p className="text-red-700 font-medium">Este es uno de los capitales más débiles. La capacidad de recuperación económica es casi inexistente.</p>
            <div>
              <label className="font-semibold text-gray-700">¿Tiene ahorros destinados a una emergencia?</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-cruzroja-red" style={{width: animatedBars.barFinanciero1 || '4%'}} id="barFinanciero1">{animatedBars.barFinanciero1 || '...'}</div>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Familias que viven con un salario mínimo</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-red-600" style={{width: animatedBars.barFinanciero2 || '4%'}} id="barFinanciero2">{animatedBars.barFinanciero2 || '...'}</div>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Comercios con planes financieros ante desastres</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-amber-600" style={{width: animatedBars.barFinanciero3 || '4%'}} id="barFinanciero3">{animatedBars.barFinanciero3 || '...'}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <p className="text-gray-700">Alta percepción de inseguridad y baja confianza en el liderazgo y las instituciones.</p>
            <div>
              <label className="font-semibold text-gray-700">¿Se siente amenazado por factores sociales/ambientales?</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-red-600" style={{width: animatedBars.barSocial1 || '4%'}} id="barSocial1">{animatedBars.barSocial1 || '...'}</div>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">¿Confía en sus líderes comunitarios?</label>
              <p className="text-gray-600">Menos del 50% confía.</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">¿Existen planes comunitarios frente a inundaciones?</label>
              <p className="text-red-700 font-bold">No existen planes comunitarios.</p>
            </div>
          </div>
        )}

        {activeTab === 'fisico' && (
          <div className="space-y-6">
            <p className="text-gray-700">Deficiencias graves en saneamiento y sistemas de alerta.</p>
            <div>
              <label className="font-semibold text-gray-700">¿Recibe alertas de inundación?</label>
              <div className="progress-bar-container mt-2">
                <div className="progress-bar bg-amber-600" style={{width: animatedBars.barFisico1 || '4%'}} id="barFisico1">{animatedBars.barFisico1 || '...'}</div>
              </div>
            </div>
            <ul className="space-y-2 list-disc list-inside">
              <li className="text-gray-700">Problemas críticos de saneamiento y acumulación de residuos.</li>
              <li className="text-gray-700">Retorno de aguas negras en viviendas (El Danubio).</li>
              <li className="text-gray-700">Recursos de infraestructura concentrados en organismos oficiales, limitando la respuesta comunitaria.</li>
            </ul>
          </div>
        )}

        {activeTab === 'natural' && (
          <div className="space-y-4">
            <p className="text-red-700 font-medium">Calificación de 100% 'D' (Crítico). El entorno está severamente degradado, aumentando el riesgo.</p>
            <ul className="space-y-2 list-disc list-inside">
              <li className="text-gray-700">Cobertura vegetal inferior al 15%. El barrio es descrito como <strong>"casi todo cemento"</strong>.</li>
              <li className="text-gray-700">La mayoría de las plantas no son nativas.</li>
              <li className="text-gray-700">Drenajes naturales han sido rellenados y construidos encima.</li>
              <li className="text-gray-700">Quebradas invadidas por escombros, basura y rellenos.</li>
              <li className="text-gray-700">Escasa participación comunitaria en el cuidado ambiental.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Se quitaron los diagramas gráficos en el panel expandido por solicitud del usuario. */}
      <div className="mt-6 bg-gray-50 rounded p-4">
        <h4 className="font-semibold mb-2">Resumen de datos</h4>
        <p className="text-gray-700">Los gráficos detallados se muestran en las tarjetas principales. Aquí se presenta un resumen textual y tablas de apoyo.</p>
        <div className="mt-3">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-gray-700">
                <th className="pb-2">Categoría</th>
                <th className="pb-2">Valor (%)</th>
              </tr>
            </thead>
            <tbody>
              {demographyData.map((d) => (
                <tr key={d.name} className="odd:bg-white even:bg-gray-100">
                  <td className="py-2">{d.name}</td>
                  <td className="py-2">{d.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold">Plan de Acción (Próximos Pasos)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div>
            <h5 className="font-semibold text-cruzroja-red">Pilar 1: Fortalecer Capacidades</h5>
            <ul className="list-disc list-inside text-gray-700">
              <li>Formación en Gestión del Riesgo y Cambio Climático.</li>
              <li>Talleres de Primeros Auxilios.</li>
              <li>Construcción del Plan Comunitario de Gestión del Riesgo.</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-cruzroja-red">Pilar 2: Comunicación del Riesgo</h5>
            <ul className="list-disc list-inside text-gray-700">
              <li>Microproyecto de reducción de impacto.</li>
              <li>Instalación de vallas informativas.</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-cruzroja-red">Pilar 3: Incidencia</h5>
            <ul className="list-disc list-inside text-gray-700">
              <li>Socialización con actores estratégicos.</li>
              <li>Fortalecer comunicación comunitaria-institucional.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
