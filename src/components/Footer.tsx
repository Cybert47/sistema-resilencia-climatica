import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-primary text-white py-6 mt-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div> Cruz Roja Colombiana — Resiliencia Climática Urbana (RCU) Soacha</div>
        <div className="mt-3 md:mt-0">
          <a href="#" className="underline mr-4">Aviso de privacidad</a>
          <a href="#" className="underline">Términos</a>
        </div>
        <div className="mt-3 md:mt-0">{new Date().getFullYear()}</div>
      </div>
    </footer>
  )
}
