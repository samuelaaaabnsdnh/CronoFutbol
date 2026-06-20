import React, { useState, useMemo } from 'react';

/**
 * RF14 — Visualización de estadísticas
 * ------------------------------------------------------------------
 * Mismo sistema de diseño que RF13/RF15/RF16 (ver comentario en ConsultaResultados.jsx).
 * Elemento de firma de este componente: tarjetas "marcador" oscuras (emerald-900)
 * con cifras grandes en amber/mono, como un tablero de estadio.
 * No requiere librerías de gráficos externas: las barras se construyen con
 * <div> de ancho proporcional, así el archivo es autónomo (solo React + Tailwind).
 * ------------------------------------------------------------------
 */

// ---------- Datos de ejemplo por torneo (reemplazar por datos reales de la API) ----------
const DATOS_TORNEOS = {
  'Liga Apertura 2026': {
    resumen: { partidosJugados: 18, golesTotales: 47, promedioGoles: '2.6', tarjetasRojas: 3 },
    posiciones: [
      { equipo: 'Halcones FC', pj: 6, g: 5, e: 0, p: 1, gf: 14, gc: 6, pts: 15 },
      { equipo: 'Águilas Doradas', pj: 6, g: 4, e: 1, p: 1, gf: 11, gc: 7, pts: 13 },
      { equipo: 'CD Andino', pj: 6, g: 3, e: 2, p: 1, gf: 10, gc: 8, pts: 11 },
      { equipo: 'Real Sabana', pj: 6, g: 1, e: 2, p: 3, gf: 6, gc: 9, pts: 5 },
      { equipo: 'Tigres Jr', pj: 6, g: 1, e: 1, p: 4, gf: 5, gc: 11, pts: 4 },
      { equipo: 'Leones B', pj: 6, g: 0, e: 2, p: 4, gf: 4, gc: 12, pts: 2 },
    ],
    goleadores: [
      { jugador: 'J. Restrepo', equipo: 'Halcones FC', goles: 9 },
      { jugador: 'M. Cárdenas', equipo: 'Águilas Doradas', goles: 7 },
      { jugador: 'D. Ortiz', equipo: 'CD Andino', goles: 6 },
      { jugador: 'S. Pinzón', equipo: 'Halcones FC', goles: 4 },
      { jugador: 'A. Vargas', equipo: 'Real Sabana', goles: 3 },
    ],
  },
  'Copa Juvenil': {
    resumen: { partidosJugados: 8, golesTotales: 19, promedioGoles: '2.4', tarjetasRojas: 1 },
    posiciones: [
      { equipo: 'Halcones Jr', pj: 3, g: 2, e: 1, p: 0, gf: 6, gc: 2, pts: 7 },
      { equipo: 'Tigres Jr', pj: 3, g: 2, e: 0, p: 1, gf: 5, gc: 3, pts: 6 },
      { equipo: 'Leones B', pj: 3, g: 1, e: 1, p: 1, gf: 4, gc: 4, pts: 4 },
    ],
    goleadores: [
      { jugador: 'N. Ríos', equipo: 'Halcones Jr', goles: 4 },
      { jugador: 'F. Gómez', equipo: 'Tigres Jr', goles: 3 },
      { jugador: 'C. Mejía', equipo: 'Leones B', goles: 2 },
    ],
  },
};

const TORNEOS = Object.keys(DATOS_TORNEOS);

// ---------- Iconos en línea ----------
const IconTrophy = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5" /></svg>
);
const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 8.5a3 3 0 1 1 3.2 5.4M21.5 20a5.5 5.5 0 0 0-4.7-5.4" /></svg>
);
const IconGoal = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="9" /><path d="m12 3 0 9 7.8-4.5M12 12l-6.4 5.5M12 12l6.4 5.5" /></svg>
);
const IconCard = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect x="5" y="3" width="11" height="16" rx="1.5" transform="rotate(8 5 3)" /></svg>
);

function TarjetaResumen({ icono: Icono, etiqueta, valor }) {
  return (
    <div className="rounded-xl bg-emerald-900 px-4 py-3 text-emerald-50 shadow-sm">
      <div className="flex items-center gap-1.5 text-emerald-300">
        <Icono className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{etiqueta}</span>
      </div>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-amber-400">{valor}</p>
    </div>
  );
}

function TablaPosiciones({ posiciones }) {
  const maxPts = Math.max(...posiciones.map((e) => e.pts));
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-[11px] font-bold uppercase tracking-wide text-stone-400">
            <th className="py-2.5 pl-4 pr-2">#</th>
            <th className="px-2 py-2.5">Equipo</th>
            <th className="px-2 py-2.5 text-center">PJ</th>
            <th className="px-2 py-2.5 text-center">G</th>
            <th className="px-2 py-2.5 text-center">E</th>
            <th className="px-2 py-2.5 text-center">P</th>
            <th className="px-2 py-2.5 text-center">GF</th>
            <th className="px-2 py-2.5 text-center">GC</th>
            <th className="px-2 py-2.5 text-center">DG</th>
            <th className="py-2.5 pl-2 pr-4 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {posiciones.map((e, i) => (
            <tr key={e.equipo} className={`border-b border-stone-100 last:border-0 ${i < 3 ? 'bg-amber-50/40' : ''}`}>
              <td className={`py-2.5 pl-4 pr-2 font-mono font-bold ${i < 3 ? 'text-amber-600' : 'text-stone-400'}`}>{i + 1}</td>
              <td className="px-2 py-2.5 font-semibold text-stone-900">{e.equipo}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.pj}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.g}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.e}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.p}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.gf}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.gc}</td>
              <td className="px-2 py-2.5 text-center font-mono tabular-nums text-stone-600">{e.gf - e.gc > 0 ? `+${e.gf - e.gc}` : e.gf - e.gc}</td>
              <td className="py-2.5 pl-2 pr-4">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-stone-100 overflow-hidden hidden sm:block">
                    <div className="h-full rounded-full bg-emerald-700" style={{ width: `${(e.pts / maxPts) * 100}%` }} />
                  </div>
                  <span className="font-mono font-bold tabular-nums text-stone-900 w-6 text-right">{e.pts}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListaGoleadores({ goleadores }) {
  const maxGoles = Math.max(...goleadores.map((j) => j.goles));
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <ul className="space-y-3">
        {goleadores.map((j, i) => (
          <li key={j.jugador} className="flex items-center gap-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold font-mono ${i === 0 ? 'bg-amber-400 text-amber-950' : 'bg-stone-100 text-stone-500'}`}>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold text-stone-900">{j.jugador}</p>
                <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-emerald-700">{j.goles}</span>
              </div>
              <p className="mb-1 text-xs text-stone-400">{j.equipo}</p>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-700" style={{ width: `${(j.goles / maxGoles) * 100}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function VisualizacionEstadisticas() {
  const [torneo, setTorneo] = useState(TORNEOS[0]);
  const [vista, setVista] = useState('equipos'); // 'equipos' | 'goleadores'

  const datos = useMemo(() => DATOS_TORNEOS[torneo], [torneo]);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">RF14</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-900">Estadísticas</h1>
            <p className="mt-1 text-sm text-stone-500">Tabla de posiciones, goleadores y resumen del torneo.</p>
          </div>
          <select
            value={torneo}
            onChange={(e) => setTorneo(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            {TORNEOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </header>

        {/* Resumen tipo marcador */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <TarjetaResumen icono={IconUsers} etiqueta="Partidos" valor={datos.resumen.partidosJugados} />
          <TarjetaResumen icono={IconGoal} etiqueta="Goles" valor={datos.resumen.golesTotales} />
          <TarjetaResumen icono={IconTrophy} etiqueta="Prom. goles" valor={datos.resumen.promedioGoles} />
          <TarjetaResumen icono={IconCard} etiqueta="T. rojas" valor={datos.resumen.tarjetasRojas} />
        </div>

        {/* Selector de vista */}
        <div className="mb-4 inline-flex rounded-lg border border-stone-200 bg-white p-1 shadow-sm">
          {[
            { id: 'equipos', etiqueta: 'Tabla de posiciones' },
            { id: 'goleadores', etiqueta: 'Goleadores' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setVista(v.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                vista === v.id ? 'bg-emerald-800 text-white' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {v.etiqueta}
            </button>
          ))}
        </div>

        {vista === 'equipos' ? <TablaPosiciones posiciones={datos.posiciones} /> : <ListaGoleadores goleadores={datos.goleadores} />}
      </div>
    </div>
  );
}