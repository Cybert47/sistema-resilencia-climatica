import React from 'react'

const Card: React.FC<{title:string, children: React.ReactNode}> = ({title, children}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="font-semibold text-lg text-text">{title}</h3>
    <p className="mt-2 text-text">{children}</p>
  </div>
)

export default function Cards(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Transparencia y acceso">Mapa abierto para la comunidad: una sola fuente de verdad.</Card>
      <Card title="Vulnerabilidad y resiliencia">Índices AVCD y CMSR sintetizados por zona para una lectura clara.</Card>
      <Card title="Respuesta coordinada">Datos de campo y evidencia visual para priorizar acciones.</Card>
    </div>
  )
}
