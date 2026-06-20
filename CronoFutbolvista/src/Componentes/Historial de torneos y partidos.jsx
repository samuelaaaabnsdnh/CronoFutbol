import React, { useState, useMemo } from 'react';

/**
 * RF16 — Historial de torneos y partidos
 * ------------------------------------------------------------------
 * Mismo sistema de diseño que RF13/RF14/RF15 (ver comentario en ConsultaResultados.jsx).
 * Layout: lista de torneos a la izquierda + panel de detalle a la derecha
 * (posiciones finales y partidos disputados), como un archivo de temporadas pasadas.
 * No requiere dependencias externas, solo React + Tailwind CSS.
 * ------------------------------------------------------------------
 */

const TORNEOS_HISTORIAL = [
  {
    id: 't1',
    nombre: 'Liga Apertura 2025',
    temporada: '2025',
    campeon: 'CD Andino',
    equipos: 6,
    fechaInicio: '2025-02-03',
    fechaFin: '2025-05-18',
    posicionesFinal: [
      { equipo: 'CD Andino', pts: 32 },
      { equipo: 'Halcones FC', pts: 29 },
      { equipo: 'Águilas Doradas', pts: 25 },
    ],
    partidos: [
      { fecha: '2025-05-18', local: 'CD Andino', visitante: 'Halcones FC', golesLocal: 2, golesVisitante: 1 },
      { fecha: '2025-05-11', local: 'Águilas Doradas', visitante: 'CD Andino', golesLocal: 0, golesVisitante: 1 },
      { fecha: '2025-05-04', local: 'Halcones FC', visitante: 'Real Sabana', golesLocal: 3, golesVisitante: 0 },
    ],
  },
  {
    id: 't2',
    nombre: 'Copa Juvenil 2025',
    temporada: '2025',
    campeon: 'Tigres Jr',
    equipos: 4,
    fechaInicio: '2025-08-09',
    fechaFin: '2025-09-20',
    posicionesFinal: [
      { equipo: 'Tigres Jr', pts: 18 },
      { equipo: 'Halcones Jr', pts: 15 },
      { equipo: 'Leones B', pts: 10 },
    ],
    partidos: [
      { fecha: '2025-09-20', local: 'Tigres Jr', visitante: 'Halcones Jr', golesLocal: 2, golesVisitante: 2 },
      { fecha: '2025-09-13', local: 'Leones B', visitante: 'Tigres Jr', golesLocal: 1, golesVisitante: 3 },
    ],
  },
  {
    id: 't3',
    nombre: 'Liga Apertura 2026',
    temporada: '2026',
    campeon: 'En disputa',
    equipos: 6,
    fechaInicio: '2026-05-03',
    fechaFin: null,
    posicionesFinal: [
      { equipo: 'Halcones FC', pts: 15 },
      { equipo: 'Águilas Doradas', pts: 13 },
      { equipo: 'CD Andino', pts: 11 },
    ],
    partidos: [
      { fecha: '2026-06-14', local: 'Halcones FC', visitante: 'Águilas Doradas', golesLocal: 2, golesVisitante: 1 },
      { fecha: '2026-06-14', local: 'Real Sabana', visitante: 'CD Andino', golesLocal: 0, golesVisitante: 0 },
      { fecha: '2026-06-07', local: 'CD Andino', visitante: 'Halcones FC', golesLocal: 3, golesVisitante: 2 },
    ],
  },
];

// ---------- Iconos en línea ----------
const IconTrophy = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5" /></svg>
);
const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 8.5a3 3 0 1 1 3.2 5.4M21.5 20a5.5 5.5 0 0 0-4.7-5.4" /></svg>
);
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

function formatearFecha(fechaISO) {
  if (!fechaISO) return 'En curso';
  return new Date(fechaISO + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
}

export default function HistorialTorneos() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadoId, setSeleccionadoId] = useState(TORNEOS_HISTORIAL[TORNEOS_HISTORIAL.length - 1].id);

  const torneosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return TORNEOS_HISTORIAL;
    const q = busqueda.toLowerCase();
    return TORNEOS_HISTORIAL.filter((t) => t.nombre.toLowerCase().includes(q) || t.temporada.includes(q));
  }, [busqueda]);

  const torneoSeleccionado = TORNEOS_HISTORIAL.find((t) => t.id === seleccionadoId) ?? torneosFiltrados[0];

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">RF16</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-900">Historial de torneos</h1>
          <p className="mt-1 text-sm text-stone-500">Consulta temporadas pasadas, sus campeones y los partidos disputados.</p>
        </header>

        <div className="grid gap-5 md:grid-cols-[280px_1fr]">
          {/* Lista de torneos */}
          <div>
            <div className="relative mb-3">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar torneo o año…"
                className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="space-y-2">
              {torneosFiltrados.map((t) => {
                const activo = t.id === torneoSeleccionado?.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSeleccionadoId(t.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      activo ? 'border-emerald-700 bg-emerald-900 text-emerald-50' : 'border-stone-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wide ${activo ? 'text-emerald-300' : 'text-emerald-700'}`}>{t.temporada}</p>
                    <p className={`text-sm font-semibold ${activo ? 'text-white' : 'text-stone-900'}`}>{t.nombre}</p>
                    <p className={`mt-1 flex items-center gap-1 text-xs ${activo ? 'text-emerald-200' : 'text-stone-400'}`}>
                      <IconTrophy className="h-3.5 w-3.5" /> {t.campeon}
                    </p>
                  </button>
                );
              })}

              {torneosFiltrados.length === 0 && (
                <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-center text-xs text-stone-400">Sin coincidencias.</p>
              )}
            </div>
          </div>

          {/* Detalle del torneo seleccionado */}
          {torneoSeleccionado && (
            <div className="space-y-5">
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">{torneoSeleccionado.nombre}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1"><IconCalendar className="h-3.5 w-3.5" />{formatearFecha(torneoSeleccionado.fechaInicio)} – {formatearFecha(torneoSeleccionado.fechaFin)}</span>
                      <span className="inline-flex items-center gap-1"><IconUsers className="h-3.5 w-3.5" />{torneoSeleccionado.equipos} equipos</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 border border-amber-200">
                    <IconTrophy className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-800">{torneoSeleccionado.campeon}</span>
                  </div>
                </div>

                <h3 className="mt-5 mb-2 text-xs font-bold uppercase tracking-wide text-stone-400">Tabla final (top 3)</h3>
                <div className="space-y-1.5">
                  {torneoSeleccionado.posicionesFinal.map((e, i) => (
                    <div key={e.equipo} className="flex items-center gap-3 rounded-lg bg-stone-50 px-3 py-2">
                      <span className={`font-mono text-sm font-bold w-4 ${i === 0 ? 'text-amber-600' : 'text-stone-400'}`}>{i + 1}</span>
                      <span className="flex-1 text-sm font-semibold text-stone-800">{e.equipo}</span>
                      <span className="font-mono text-sm font-bold text-emerald-700">{e.pts} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-stone-400">Partidos disputados</h3>
                <ul className="divide-y divide-stone-100">
                  {torneoSeleccionado.partidos.map((p, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="w-20 shrink-0 font-mono text-xs text-stone-400">{formatearFecha(p.fecha)}</span>
                      <span className="flex-1 truncate text-right text-sm font-medium text-stone-800">{p.local}</span>
                      <span className="shrink-0 rounded-md bg-stone-100 px-2 py-0.5 font-mono text-sm font-bold tabular-nums text-stone-900">
                        {p.golesLocal} – {p.golesVisitante}
                      </span>
                      <span className="flex-1 truncate text-sm font-medium text-stone-800">{p.visitante}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}