import React, { useState, useMemo } from 'react';

/**
 * RF13 — Consulta pública de resultados
 * ------------------------------------------------------------------
 * Sistema de diseño compartido entre los 4 componentes (RF13–RF16):
 *   Fondo:      stone-50 / white     Texto:    stone-900
 *   Primario:   emerald-800/900      Acento:   amber-500
 *   Alerta:     rose-600             Líneas:   stone-200/300
 *   Tipografía: uppercase + tracking-tight en títulos (look de marcador),
 *               font-mono en marcadores, fechas y datos numéricos.
 * Elemento de firma: tarjetas tipo "boleto de partido" con línea perforada.
 * Tipografía sugerida (opcional, agregar en tu index.html):
 *   <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&display=swap" rel="stylesheet">
 * ------------------------------------------------------------------
 * No requiere dependencias externas, solo React + Tailwind CSS.
 */

// ---------- Datos de ejemplo (reemplazar por datos reales de la API) ----------
const PARTIDOS = [
  { id: 1, torneo: 'Liga Apertura 2026', fecha: '2026-06-14', hora: '15:00', sede: 'Estadio El Campín', local: 'Halcones FC', visitante: 'Águilas Doradas', golesLocal: 2, golesVisitante: 1, estado: 'finalizado' },
  { id: 2, torneo: 'Liga Apertura 2026', fecha: '2026-06-14', hora: '17:30', sede: 'Cancha Norte', local: 'Real Sabana', visitante: 'CD Andino', golesLocal: 0, golesVisitante: 0, estado: 'finalizado' },
  { id: 3, torneo: 'Copa Juvenil', fecha: '2026-06-20', hora: '10:00', sede: 'Polideportivo Sur', local: 'Tigres Jr', visitante: 'Leones B', golesLocal: 1, golesVisitante: 1, estado: 'en_curso' },
  { id: 4, torneo: 'Liga Apertura 2026', fecha: '2026-06-21', hora: '16:00', sede: 'Estadio El Campín', local: 'Águilas Doradas', visitante: 'Real Sabana', golesLocal: null, golesVisitante: null, estado: 'programado' },
  { id: 5, torneo: 'Copa Juvenil', fecha: '2026-06-21', hora: '11:00', sede: 'Polideportivo Sur', local: 'Leones B', visitante: 'Halcones Jr', golesLocal: null, golesVisitante: null, estado: 'suspendido' },
  { id: 6, torneo: 'Liga Apertura 2026', fecha: '2026-06-07', hora: '15:00', sede: 'Cancha Norte', local: 'CD Andino', visitante: 'Halcones FC', golesLocal: 3, golesVisitante: 2, estado: 'finalizado' },
  { id: 7, torneo: 'Copa Juvenil', fecha: '2026-06-13', hora: '10:00', sede: 'Polideportivo Sur', local: 'Halcones Jr', visitante: 'Tigres Jr', golesLocal: 0, golesVisitante: 2, estado: 'finalizado' },
];

const TORNEOS = ['Todos', ...new Set(PARTIDOS.map((p) => p.torneo))];
const EQUIPOS = ['Todos', ...new Set(PARTIDOS.flatMap((p) => [p.local, p.visitante]))].sort();

const ESTADO_ESTILOS = {
  finalizado: { etiqueta: 'Finalizado', clases: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  en_curso: { etiqueta: 'En curso', clases: 'bg-amber-50 text-amber-800 border-amber-300' },
  programado: { etiqueta: 'Programado', clases: 'bg-stone-100 text-stone-600 border-stone-300' },
  suspendido: { etiqueta: 'Suspendido', clases: 'bg-rose-50 text-rose-700 border-rose-300' },
};

// ---------- Iconos en línea (sin dependencias externas) ----------
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
const IconMapPin = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
const IconX = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

function formatearFecha(fechaISO) {
  const d = new Date(fechaISO + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }).replace('.', '');
}

function TarjetaPartido({ p }) {
  const estado = ESTADO_ESTILOS[p.estado];
  const tieneMarcador = p.estado === 'finalizado' || p.estado === 'en_curso';
  return (
    <article className="relative flex rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Lado informativo */}
      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{p.torneo}</span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${estado.clases}`}>
            {p.estado === 'en_curso' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
            {estado.etiqueta}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-stone-900 truncate">{p.local}</span>
            <span className="font-mono font-bold text-lg text-stone-900 tabular-nums w-6 text-right">{tieneMarcador ? p.golesLocal : '–'}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-stone-900 truncate">{p.visitante}</span>
            <span className="font-mono font-bold text-lg text-stone-900 tabular-nums w-6 text-right">{tieneMarcador ? p.golesVisitante : '–'}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1"><IconCalendar className="h-3.5 w-3.5" />{formatearFecha(p.fecha)} · {p.hora}</span>
          <span className="inline-flex items-center gap-1"><IconMapPin className="h-3.5 w-3.5" />{p.sede}</span>
        </div>
      </div>

      {/* Línea perforada — elemento de firma tipo "boleto" */}
      <div className="relative w-0 border-l-2 border-dashed border-stone-300 my-3 hidden sm:block">
        <span className="absolute -top-3 -left-[7px] h-3 w-3 rounded-full bg-stone-50 border border-stone-200" />
        <span className="absolute -bottom-3 -left-[7px] h-3 w-3 rounded-full bg-stone-50 border border-stone-200" />
      </div>

      {/* Talón lateral */}
      <div className="w-12 sm:w-16 shrink-0 hidden sm:flex flex-col items-center justify-center bg-emerald-900 text-emerald-50 py-2">
        <span className="text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">{p.torneo.split(' ')[0]}</span>
      </div>
    </article>
  );
}

export default function ConsultaResultados() {
  const [torneo, setTorneo] = useState('Todos');
  const [equipo, setEquipo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const resultados = useMemo(() => {
    return PARTIDOS
      .filter((p) => torneo === 'Todos' || p.torneo === torneo)
      .filter((p) => equipo === 'Todos' || p.local === equipo || p.visitante === equipo)
      .filter((p) => {
        if (!busqueda.trim()) return true;
        const q = busqueda.toLowerCase();
        return p.local.toLowerCase().includes(q) || p.visitante.toLowerCase().includes(q) || p.sede.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [torneo, equipo, busqueda]);

  const hayFiltrosActivos = torneo !== 'Todos' || equipo !== 'Todos' || busqueda.trim() !== '';

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">RF13</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-900">Consulta de resultados</h1>
          <p className="mt-1 text-sm text-stone-500">Busca partidos por torneo, equipo o sede. Disponible para cualquier visitante.</p>
        </header>

        {/* Controles de filtro */}
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar equipo o sede…"
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <select
              value={torneo}
              onChange={(e) => setTorneo(e.target.value)}
              className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {TORNEOS.map((t) => <option key={t} value={t}>{t === 'Todos' ? 'Todos los torneos' : t}</option>)}
            </select>
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {EQUIPOS.map((eq) => <option key={eq} value={eq}>{eq === 'Todos' ? 'Todos los equipos' : eq}</option>)}
            </select>
          </div>
          {hayFiltrosActivos && (
            <button
              onClick={() => { setTorneo('Todos'); setEquipo('Todos'); setBusqueda(''); }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-rose-600"
            >
              <IconX className="h-3.5 w-3.5" /> Limpiar filtros
            </button>
          )}
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
          {resultados.length} {resultados.length === 1 ? 'partido encontrado' : 'partidos encontrados'}
        </p>

        {/* Lista de resultados */}
        <div className="space-y-3">
          {resultados.map((p) => <TarjetaPartido key={p.id} p={p} />)}

          {resultados.length === 0 && (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white py-14 text-center">
              <p className="text-sm font-semibold text-stone-700">No se encontraron partidos</p>
              <p className="mt-1 text-xs text-stone-400">Prueba ajustando los filtros de búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}