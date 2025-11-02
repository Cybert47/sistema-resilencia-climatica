import React, { useEffect, useState } from "react";
import zonesData from "../data/zones";
import { pointInPolygon, centroid, dangerFromAvcd } from "../utils/geo";
import PreventionModal from "./PreventionModal";

type Props = {
  onLocation?: (coords: [number, number]) => void;
};

// dangerFromAvcd moved to utils/geo

export default function LocationAlert({ onLocation }: Props) {
  const [status, setStatus] = useState<"idle" | "locating" | "ready" | "error">(
    "idle"
  );
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [zoneName, setZoneName] = useState<string | null>(null);
  const [danger, setDanger] = useState<{
    level: string;
    color: string;
    text: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulatedZone, setSimulatedZone] = useState<string | null>(null);
  const [showPrevention, setShowPrevention] = useState(false);

  const [zoneId, setZoneId] = useState<string | null>(null);
  const [aiPrediction, setAiPrediction] = useState<{
    probability: number;
    explanation?: string;
  } | null>(null);
  useEffect(() => {
    if (!coords) return;
    // find zone
    const found = zonesData.find((z) => pointInPolygon(coords, z.coords));
    if (found) {
      setZoneName(found.name);
      setZoneId(found.id);
      const d = dangerFromAvcd(found.avcd);
      setDanger({ level: d.level, color: d.colorClass, text: d.text });
    } else {
      setZoneName(null);
      setDanger(null);
      setZoneId(null);
    }
    if (onLocation) onLocation(coords);
    setStatus("ready");
  }, [coords, onLocation]);

  // open prevention modal automatically when danger becomes Alto
  // listen for AI predictions dispatched by other components (ClimateAiCard / Map)
  useEffect(() => {
    function handler(e: any) {
      const d = e?.detail;
      if (!d || !d.zoneId) return;
      if (d.zoneId === zoneId) {
        setAiPrediction({
          probability: Number(d.probability),
          explanation: d.explanation,
        });
      }
    }
    window.addEventListener("rcu:aiPrediction", handler);
    return () => window.removeEventListener("rcu:aiPrediction", handler);
  }, [zoneId]);
  useEffect(() => {
    // Only auto-open prevention modal for real detections, not when user uses the simulation buttons
    if (
      status === "ready" &&
      danger &&
      danger.level === "Alto" &&
      !simulatedZone
    ) {
      setShowPrevention(true);
    }
  }, [status, danger, simulatedZone]);

  function centroid(coords: [number, number][]): [number, number] {
    const sum = coords.reduce(
      (acc, c) => [acc[0] + c[0], acc[1] + c[1]],
      [0, 0]
    );
    return [sum[0] / coords.length, sum[1] / coords.length];
  }

  function simulateZone(zoneId: string) {
    const z = zonesData.find((z) => z.id === zoneId);
    if (!z) return;
    const c = centroid(z.coords);
    setSimulatedZone(zoneId);
    setCoords([c[0], c[1]]);
  }

  function clearSimulation() {
    setSimulatedZone(null);
    setCoords(null);
    setZoneName(null);
    setDanger(null);
    setStatus("idle");
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setErrorMsg("Geolocalización no disponible en este navegador");
      setStatus("error");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lat, lng]);
      },
      (err) => {
        setErrorMsg(err.message || "Error obteniendo ubicación");
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const dangerClass = danger ? danger.color : "bg-gray-500";
  const dangerLevel = danger ? danger.level : "N/A";
  const dangerText = danger ? danger.text : "";

  return (
    <>
      <div className="my-6">
        <div className="rounded-lg p-4 bg-white shadow-sm">
          {/* Status display (changes depending on state) */}
          {status === "idle" && (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  Detecta tu ubicación para evaluar el nivel de riesgo de la
                  zona
                </div>
                <div className="text-sm text-gray-600">
                  Pulsa el botón para permitir el acceso a tu ubicación y
                  recibir una alerta rápida.
                </div>
              </div>
              <div>
                <button className="btn-primary" onClick={requestLocation}>
                  Usar mi ubicación
                </button>
              </div>
            </div>
          )}

          {status === "locating" && (
            <div className="rounded p-3 bg-blue-50 text-blue-800">
              Localizando... espera y acepta la petición del navegador si
              aparece.
            </div>
          )}

          {status === "ready" && coords && (
            <div
              className={`rounded p-3 text-white ${
                danger ? danger.color : "bg-gray-500"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      Alerta rápida{" "}
                      {simulatedZone && (
                        <span className="ml-2 inline-block text-xs bg-white text-black px-2 py-0.5 rounded">
                          Simulado
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      {zoneName
                        ? `Zona: ${zoneName}`
                        : "Ubicación fuera de zonas conocidas"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {danger ? danger.level : "N/A"}
                    </div>
                    <div className="text-sm">{danger ? danger.text : ""}</div>
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div className="bg-white/20 rounded p-2 text-white">
                      <div className="text-xs">Población</div>
                      <div className="font-semibold">
                        {(() => {
                          const cz = zoneId
                            ? zonesData.find((z) => z.id === zoneId)
                            : null;
                          return cz ? cz.population.toLocaleString() : "—";
                        })()}
                      </div>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-white">
                      <div className="text-xs">Alerta</div>
                      <div className="font-semibold">
                        {danger ? danger.level : "N/A"}{" "}
                        <span className="text-xs font-normal">
                          {aiPrediction ? "(IA)" : "(AVCD)"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-white">
                      <div className="text-xs">IA</div>
                      <div className="font-semibold">
                        {aiPrediction ? `${aiPrediction.probability}%` : "N/A"}
                      </div>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-white">
                      <div className="text-xs">AVCD / CMSR</div>
                      <div className="font-semibold">
                        {zoneId
                          ? zonesData.find((z) => z.id === zoneId)?.avcd ?? "—"
                          : "—"}{" "}
                        /{" "}
                        {zoneId
                          ? zonesData.find((z) => z.id === zoneId)?.cmsr ?? "—"
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {danger && danger.level === "Alto" && (
                    <div className="mt-3 flex flex-col md:flex-row gap-2">
                      <button
                        onClick={() => setShowPrevention(true)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#E00000] to-[#B91C1C] text-white font-semibold shadow-lg hover:opacity-95 transition"
                        aria-haspopup="dialog"
                        aria-expanded={showPrevention}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                          className="-ml-1"
                        >
                          <path
                            d="M12 2v11"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 17h.01"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Ver pasos de prevención
                      </button>

                      {/* Nuevo botón adicional "Prevención" que también abre la modal sin borrar nada */}
                      <button
                        onClick={() => setShowPrevention(true)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 transition"
                      >
                        Prevención
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="rounded p-3 bg-red-50 text-red-800">
              <div className="font-medium">No se pudo obtener la ubicación</div>
              <div className="text-sm">{errorMsg}</div>
              <div className="mt-2">
                <button className="btn-primary" onClick={requestLocation}>
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Controles de simulación siempre visibles dentro de la misma sección de ubicación */}
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">
              Simular ubicación (demo)
            </div>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded border ${
                  simulatedZone === "la-maria"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => simulateZone("la-maria")}
              >
                Simular La María
              </button>
              <button
                className={`px-3 py-1 rounded border ${
                  simulatedZone === "el-danubio"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => simulateZone("el-danubio")}
              >
                Simular El Danubio
              </button>
              <button
                className="px-3 py-1 rounded bg-white border text-sm"
                onClick={clearSimulation}
              >
                Quitar simulación
              </button>
            </div>
          </div>
        </div>
      </div>
      <PreventionModal
        open={showPrevention}
        onClose={() => setShowPrevention(false)}
        steps={[
          {
            id: 1,
            title: "Prepárate",
            text: "Ten un kit de emergencia listo con agua, alimentos no perecederos, una radio a pilas, linterna, botiquín de primeros auxilios y documentos importantes.",
            img: "/Prevencion/1.jpeg",
          },
          {
            id: 2,
            title: "Infórmate",
            text: "Mantente atento a las alertas meteorológicas y las instrucciones de las autoridades locales.",
            img: "/Prevencion/2.jpeg",
          },
          {
            id: 3,
            title: "Asegura tu hogar",
            text: "Si es posible, coloca sacos de arena y eleva los objetos de valor.",
            img: "Prevencion/3.jpeg",
          },
          {
            id: 4,
            title: "Durante la inundación",
            text: "Desconecta la electricidad y cierra el gas: Hazlo solo si es seguro.",
            img: "/Prevencion/4.jpeg",
          },
          {
            id: 5,
            title: "Evacúa si te lo indican",
            text: "Sigue las rutas de evacuación designadas y nunca intentes cruzar aguas en movimiento.",
            img: "/Prevencion/5.jpeg",
          },
          {
            id: 6,
            title: "Busca refugio seguro",
            text: "Si no puedes evacuar, sube a los pisos superiores de tu casa o a un lugar elevado.",
            img: "/Prevencion/6.jpeg",
          },
        ]}
      />
    </>
  );
}
