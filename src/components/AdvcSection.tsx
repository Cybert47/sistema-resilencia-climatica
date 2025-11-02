import React, { useState } from 'react'

export default function ADVCSection(){
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="advc" className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AVCD — Guía rápida para uso del emblema en esta plataforma</h2>
        <button
          onClick={()=>setExpanded(e=>!e)}
          className={`px-3 py-2 rounded font-medium ${expanded ? 'bg-cruzroja-red text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {expanded ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-crc">
          <h3 className="text-xl font-bold text-red-crc mb-4">Resumen aplicable al proyecto RCU</h3>
          <p className="text-gray-700">Este resumen adapta el Manual de Uso del Emblema a los escenarios digitales y operativos de la plataforma Cruz_Roja_MVP. Incluye normas prácticas para mostrar el emblema en mapas, alertas, banners y materiales de divulgación, y recomendaciones rápidas para el personal y voluntarios que usen recursos gráficos del proyecto.</p>

          <h4 className="mt-4 font-semibold">Principios clave (versión digital)</h4>
          <ul className="list-inside list-decimal ml-4 space-y-2 mt-2 text-gray-700">
            <li><strong>Integridad:</strong> El emblema debe mostrarse sin distorsiones y con su forma original. No altere proporciones ni añada efectos 3D.</li>
            <li><strong>Contraste y visibilidad:</strong> En mapas y alertas, coloque el emblema sobre fondos claros o dentro de un recuadro blanco para garantizar legibilidad y accesibilidad.</li>
            <li><strong>Tamaño mínimo:</strong> No reduzca el emblema por debajo del tamaño que impida su identificación en pantallas pequeñas.</li>
            <li><strong>Acompañamiento:</strong> Cuando aparezca en materiales operativos, incluya la leyenda aprobada (ej. "Cruz Roja Colombiana — Seccional").</li>
            <li><strong>No decorativo:</strong> Evite usar el emblema como patrón de fondo, marca repetida o iconografía decorativa que diluya su significado.</li>
          </ul>

          <h4 className="mt-4 font-semibold">Uso en alertas y mapas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-gray-700">
            <div>
              <div className="font-semibold">Alertas</div>
              <div className="mt-1">En tarjetas de alerta, coloque el emblema en una esquina o junto al título. No lo superponga sobre información crítica (niveles, porcentajes, mapas interactivos).</div>
            </div>
            <div>
              <div className="font-semibold">Mapas</div>
              <div className="mt-1">Use la versión plana del emblema con un contorno nítido para evitar problemas de escala al hacer zoom. Si el marcador ocupa mucha información, muestre el emblema en el popup o en la leyenda.</div>
            </div>
          </div>

          <h4 className="mt-4 font-semibold">Especificaciones rápidas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-gray-700">
            <div>
              <div className="font-semibold">Color</div>
              <div className="mt-1">Rojo institucional (usar la versión vectorial en RGB/HEX o PANTONE oficial cuando sea posible).</div>
            </div>
            <div>
              <div className="font-semibold">Accesibilidad</div>
              <div className="mt-1">Asegúrese de alternar texto alternativo en imágenes y mantener contraste suficiente en botones y banners.</div>
            </div>
          </div>

          <h4 className="mt-4 font-semibold">Recursos y contacto</h4>
          <p className="text-gray-700 mt-2">Las imágenes de prevención y recursos gráficos usados en esta plataforma están disponibles desde la sección de Prevención (modal). Para solicitudes de logo, materiales impresos o autorizaciones, contacte al equipo de comunicaciones o use la sección de Voluntariado dentro de la aplicación.</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Notas de adaptación</h4>
          <p className="text-gray-700">Esta versión sintetizada prioriza la aplicación práctica en interfaces digitales: legibilidad en móviles, coherencia en alertas y facilidad de uso para equipos operativos. Para usos comerciales o publicitarios, consulte el manual completo de la seccional.</p>
        </div>
      )}
    </section>
  )
}
