import React, { useState, useRef, useEffect } from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import clsx from 'clsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [showForms, setShowForms] = useState(false)
  const formsRef = useRef<HTMLDivElement | null>(null)
  const hideTimer = useRef<number | null>(null)

  useEffect(()=>{
    function onDoc(e: MouseEvent){
      if(!formsRef.current) return
      if(e.target instanceof Node && !formsRef.current.contains(e.target)){
        setShowForms(false)
      }
    }
    document.addEventListener('click', onDoc)
    return ()=> document.removeEventListener('click', onDoc)
  },[])

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-6 md:py-8 flex items-center justify-between">
        <a href="#" className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
          <img src="/logo.png" alt="Cruz Roja — RCU Soacha" className="h-12 md:h-20 w-auto" />
          <div className="text-center md:text-left">
            <div className="font-bold text-lg sm:text-xl md:text-2xl leading-tight">SIRC - Sistema de Información</div>
            <div className="text-sm text-gray-600 hidden md:block">de Riesgo comunitario</div>
            {/* On small screens show subtitle on next line if needed */}
            <div className="text-sm text-gray-600 md:hidden">de Riesgo comunitario</div>
          </div>
        </a>

        <nav className="hidden md:block">
          <NavigationMenu.Root className="relative">
            <NavigationMenu.List className="flex items-center gap-8">
              <NavigationMenu.Item>
                <NavigationMenu.Link className="text-text text-lg font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="#advc">
                  AVCD
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              {/* CMSR removed per request */}
              <NavigationMenu.Item>
                <div
                  ref={formsRef}
                  className="relative"
                  onMouseEnter={()=>{ if(hideTimer.current){ window.clearTimeout(hideTimer.current); hideTimer.current = null } ; setShowForms(true)}}
                  onMouseLeave={()=>{ hideTimer.current = window.setTimeout(()=> setShowForms(false), 150) }}
                >
                  <NavigationMenu.Link
                    onClick={(e)=>{ e.preventDefault(); setShowForms(s=>!s) }}
                    onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowForms(s=>!s) } if(e.key === 'Escape'){ setShowForms(false) } }}
                    role="button"
                    tabIndex={0}
                    className="text-text text-lg font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    href="#"
                  >
                    Formularios
                  </NavigationMenu.Link>

                  <div className={`absolute left-0 top-full mt-2 w-48 bg-white rounded shadow-md ring-1 ring-black ring-opacity-5 transition-all transform z-50 ${showForms ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-1 pointer-events-none'}`}>
                    <a href="/Formularios/EDAM.html" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">EDAM</a>
                    <a href="/Formularios/Human.html" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">HUMAN</a>
                  </div>
                </div>
              </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link className="text-text text-lg font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="#cmrc">
                    CMRC
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link className="text-text text-lg font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="#">
                  Candidato
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </nav>

        <div className="md:hidden">
          <button
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={clsx('p-3 rounded-md focus-visible:ring-2 focus-visible:ring-primary')}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            <a href="#advc" className="py-2">AVCD (Vulnerabilidad)</a>
            <div className="py-2">
              <div className="text-sm font-medium">Formularios</div>
              <div className="mt-2 pl-2">
                <a href="/src/Formularios/EDAM.html" target="_blank" rel="noopener noreferrer" className="block py-1">EDAM</a>
                <a href="/src/Formularios/Human.html" target="_blank" rel="noopener noreferrer" className="block py-1">HUMAN</a>
              </div>
            </div>
            <a href="#cmrc" className="py-2">CMRC</a>
            <a href="#" className="py-2">Candidato</a>
          </div>
        </div>
      )}
    </header>
  )
}
