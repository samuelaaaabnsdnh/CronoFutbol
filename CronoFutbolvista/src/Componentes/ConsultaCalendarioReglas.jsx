import { useState } from "react";
import { CalendarDays, BookText, MapPin, Clock3, ChevronDown } from "lucide-react";

/**
 * RF11 — Consulta de calendarios y reglas
 * Continúa la identidad "marcador de estadio": el calendario se lee como
 * la cartelera de partidos del día, el reglamento como el acta del torneo.
 */

const PARTIDOS = [
  { id: "p1", fecha: "2026-06-21", hora: "15:00", local: "Halcones FC", visitante: "Real Centro", cancha: "Cancha 3" },
  { id: "p2", fecha: "2026-06-21", hora: "17:30", local: "Atlético Norte", visitante: "Unión Sur", cancha: "Cancha 1" },
  { id: "p3", fecha: "2026-06-22", hora: "09:00", local: "Deportivo Aurora", visitante: "Los Tigres", cancha: "Cancha 2" },
  { id: "p4", fecha: "2026-06-28", hora: "16:00", local: "Real Centro", visitante: "Los Tigres", cancha: "Cancha 1" },
];

const REGLAS = [
  {
    titulo: "Formato del torneo",
    contenido:
      "Fase de grupos de todos contra todos a una vuelta, seguida de cuartos de final, semifinal y final a partido único. Los dos primeros de cada grupo avanzan.",
  },
  {
    titulo: "Sistema de puntos",
    contenido:
      "Victoria: 3 puntos. Empate: 1 punto. Derrota: 0 puntos. En caso de igualdad se define por diferencia de gol, goles a favor y enfrentamiento directo, en ese orden.",
  },
  {
    titulo: "Elegibilidad de jugadores",
    contenido:
      "Cada equipo puede inscribir hasta 20 jugadores. Un jugador solo puede representar a un equipo por edición del torneo y debe estar inscrito antes del cierre de la convocatoria.",
  },
  {
    titulo: "Sanciones disciplinarias",
    contenido:
      "Tarjeta amarilla: acumulación de 3 implica suspensión de 1 fecha. Tarjeta roja directa: suspensión mínima de 2 fechas, sujeta a revisión del comité disciplinario.",
  },
];

function agruparPorFecha(partidos) {
  const grupos = {};
  partidos.forEach((p) => {
    grupos[p.fecha] = grupos[p.fecha] || [];
    grupos[p.fecha].push(p);
  });
  return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b));
}

function formatFechaLarga(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CO", { weekday: "long", day: "2-digit", month: "long" });
}

export default function ConsultaCalendarioReglas() {
  const [tab, setTab] = useState("calendario");
  const [abierta, setAbierta] = useState(0);
  const grupos = agruparPorFecha(PARTIDOS);

  return (
    <div className="min-h-full w-full bg-[#0B2E22] text-[#F4F7F2] p-6 sm:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-lg bg-[#143D2C] ring-1 ring-[#3FA34D]/40 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-[#F2A93B]" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide leading-none">Calendario y reglas</h1>
            <p className="text-xs text-[#9FB8AC] mt-1 tracking-wide">RF11 · Consulta general</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#143D2C] rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("calendario")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
              tab === "calendario" ? "bg-[#F4F7F2] text-[#0B2E22]" : "text-[#9FB8AC] hover:text-[#F4F7F2]"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" /> Calendario
          </button>
          <button
            onClick={() => setTab("reglamento")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
              tab === "reglamento" ? "bg-[#F4F7F2] text-[#0B2E22]" : "text-[#9FB8AC] hover:text-[#F4F7F2]"
            }`}
          >
            <BookText className="w-3.5 h-3.5" /> Reglamento
          </button>
        </div>

        {/* Calendario */}
        {tab === "calendario" && (
          <div className="space-y-6">
            {grupos.map(([fecha, partidos]) => (
              <div key={fecha}>
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-2.5">
                  {formatFechaLarga(fecha)}
                </h3>
                <div className="space-y-2">
                  {partidos.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#143D2C] border border-[#1B4A36] rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="font-mono tabular-nums text-sm font-bold bg-[#0B2E22] text-[#F2A93B] rounded px-2.5 py-1.5 flex items-center gap-1.5 shrink-0">
                        <Clock3 className="w-3.5 h-3.5" /> {p.hora}
                      </div>
                      <div className="flex-1 min-w-0 text-sm font-semibold truncate">
                        {p.local} <span className="text-[#9FB8AC] font-normal">vs</span> {p.visitante}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#9FB8AC] font-mono shrink-0">
                        <MapPin className="w-3.5 h-3.5" /> {p.cancha}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reglamento */}
        {tab === "reglamento" && (
          <div className="space-y-2.5">
            {REGLAS.map((r, i) => {
              const abiertaAhora = abierta === i;
              return (
                <div key={r.titulo} className="bg-[#143D2C] border border-[#1B4A36] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAbierta(abiertaAhora ? -1 : i)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="font-bold text-sm">{r.titulo}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9FB8AC] shrink-0 transition-transform ${abiertaAhora ? "rotate-180" : ""}`}
                    />
                  </button>
                  {abiertaAhora && (
                    <p className="px-4 pb-4 text-sm text-[#C9D6CC] leading-relaxed">{r.contenido}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
