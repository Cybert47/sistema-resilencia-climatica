
import React, { useState } from 'react'

const AUTH_CODES = ['CRC-1234', 'CRC-5678', 'VOL-0001'] // códigos simulados autorizados

// HTML estático del formulario — renderizamos tal cual (solo HTML)
const FORM_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario Voluntario - Cruz Roja</title>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body{ font-family: 'Lato', sans-serif; margin:16px; color:#111 }
      .font-bebas{ font-family: 'Bebas Neue', cursive }
      .red{ color:#D8292F }
      .card{ border:1px solid #eee; padding:18px; border-radius:10px }
    </style>
</head>
<body>
  <div class="card">
    <h1 class="font-bebas red">Formulario Voluntario — Cruz Roja</h1>
    <p>Complete el formulario y entréguelo en la seccional. (Documento simulado para la demo)</p>
    <hr />
    <h3>Datos personales</h3>
    <p><strong>Nombre:</strong> ____________________________</p>
    <p><strong>Documento:</strong> ____________________________</p>
    <p><strong>Correo:</strong> ____________________________</p>
    <p><strong>Teléfono:</strong> ____________________________</p>
    <h3 class="mt-4">Intereses</h3>
    <p>Observaciones y disponibilidad: __________________________________________</p>
    <div style="margin-top:20px;font-size:12px;color:#666">Documento generado desde SIRC — Demo.</div>
  </div>
</body>
</html>
`

export default function Volunteers(){
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [code, setCode] = useState('')
  const [bannerError, setBannerError] = useState<string | null>(null)
  const [delivered, setDelivered] = useState(false)

  function handlePrint(){
    const w = window.open('', '_blank')
    if(!w) return alert('Permite popups para descargar el PDF')
    w.document.write(FORM_HTML)
    w.document.close()
    setTimeout(()=>{ w.print() }, 300)
  }

  function simulateDelivery(){
    setBannerError(null)
    setShowCodeModal(true)
  }

  function verifyCode(){
    if(AUTH_CODES.includes(code.trim())){
      setShowCodeModal(false)
      setDelivered(true)
      setBannerError(null)
    } else {
      setBannerError('Código único incorrecto: no es un voluntario autorizado')
    }
  }

  return (
    <div id="voluntarios" className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold">Voluntarios — Entrega de Formulario (Demo)</h2>
      <p className="text-sm text-gray-600 mt-1">Formulario mostrado como HTML estático. Puedes descargarlo como PDF o simular su entrega.</p>

      {bannerError && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">{bannerError}</div>
      )}

      {delivered && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">Formulario entregado correctamente. (Simulado)</div>
      )}

      <div className="mt-6">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: FORM_HTML }} />
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={simulateDelivery} className="px-4 py-2 bg-red-600 text-white rounded">Simular entrega (pedirá código)</button>
        <button onClick={handlePrint} className="px-4 py-2 border rounded">Descargar PDF</button>
      </div>

      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-semibold text-lg">Ingresar código único de voluntario</h3>
            <p className="text-sm text-gray-600 mt-1">Ingresa el código proporcionado por la Seccional.</p>
            <input value={code} onChange={e=>setCode(e.target.value)} className="mt-4 block w-full border rounded px-3 py-2" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShowCodeModal(false)} className="px-3 py-2 border rounded">Cancelar</button>
              <button onClick={verifyCode} className="px-3 py-2 bg-red-600 text-white rounded">Verificar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
