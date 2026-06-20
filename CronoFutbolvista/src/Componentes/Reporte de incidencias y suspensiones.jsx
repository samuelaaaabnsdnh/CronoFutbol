import React, { useState, useMemo } from 'react';

/**
 * RF15 — Reporte de incidencias y suspensiones
 * ------------------------------------------------------------------
 * Mismo sistema de diseño que RF13/RF14/RF16 (ver comentario en ConsultaResultados.jsx).
 * Acento principal aquí: rose-600 para alertas/sanciones, amber para revisión pendiente.
 * No requiere dependencias externas, solo React + Tailwind CSS.
 * ------------------------------------------------------------------
 */

const PARTIDOS_DISPONIBLES = [
  'Halcones FC vs Águilas Doradas — 14 jun',
  'Real Sabana vs CD Andino — 14 jun',
  'Tigres Jr vs Leones B — 20 jun',
  'CD Andino vs Halcones FC — 07 jun',
];

const TIPOS_INCIDENCIA = [
  'Tarjeta amarilla',
  'Tarjeta roja',
  'Conducta antideportiva',
  'Agresión a jugador',
  'Agresión a árbitro',
  'Otro',
];

const ESTADO_ESTILOS = {
  en_revision: { etiqueta: 'En revisión', clases: 'bg-amber-50 text-amber-800 border-amber-300' },
  activa: { etiqueta: 'Sanción activa', clases: 'bg-rose-50 text-rose-700 border-rose-300' },
  cumplida: { etiqueta: 'Cumplida', clases: 'bg-stone-100 text-stone-600 border-stone-300' },
};

const INCIDENCIAS_INICIALES = [
  { id: 1, fecha: '2026-06-14', partido: 'Halcones FC vs Águilas Doradas — 14 jun', jugadorEquipo: 'R. Salazar (Águilas Doradas)', tipo: 'Tarjeta roja', sancion: 'Suspensión 2 partidos', descripcion: 'Doble amonestación en el segundo tiempo.', estado: 'activa' },
  { id: 2, fecha: '2026-06-13', partido: 'Halcones Jr vs Tigres Jr — 13 jun', jugadorEquipo: 'Halcones Jr (equipo)', tipo: 'Conducta antideportiva', sancion: 'Amonestación al cuerpo técnico', descripcion: 'Reclamos reiterados al árbitro desde el banco.', estado: 'cumplida' },
  { id: 3, fecha: '2026-06-07', partido: 'CD Andino vs Halcones FC — 07 jun', jugadorEquipo: 'P. Niño (CD Andino)', tipo: 'Agresión a jugador', sancion: 'Por definir', descripcion: 'Reportado por el árbitro central, en estudio del comité.', estado: 'en_revision' },
];

const FILTROS = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'en_revision', etiqueta: 'En revisión' },
  { id: 'activa', etiqueta: 'Activas' },
  { id: 'cumplida', etiqueta: 'Cumplidas' },
];

// ---------- Iconos en línea ----------
const IconAlert = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
);
const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="m20 6-11 11-5-5" /></svg>
);
const IconShield = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 3 4.5 6v6c0 4.5 3.2 7.4 7.5 9 4.3-1.6 7.5-4.5 7.5-9V6L12 3Z" /></svg>
);

function Etiqueta({ children }) {
  return <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{children}</label>;
}

const inputClases =
  'w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100';

export default function ReporteIncidencias() {
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_INICIALES);
  const [filtro, setFiltro] = useState('todas');
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);

  const [form, setForm] = useState({
    partido: PARTIDOS_DISPONIBLES[0],
    jugadorEquipo: '',
    tipo: TIPOS_INCIDENCIA[0],
    fecha: new Date().toISOString().slice(0, 10),
    descripcion: '',
  });
  const [errores, setErrores] = useState({});

  const incidenciasFiltradas = useMemo(() => {
    if (filtro === 'todas') return incidencias;
    return incidencias.filter((i) => i.estado === filtro);
  }, [incidencias, filtro]);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.jugadorEquipo.trim()) nuevosErrores.jugadorEquipo = 'Indica el jugador o equipo implicado.';
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'Describe brevemente lo ocurrido.';
    if (!form.fecha) nuevosErrores.fecha = 'Selecciona una fecha.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function enviarReporte(e) {
    e.preventDefault();
    if (!validar()) return;

    const nuevaIncidencia = {
      id: Date.now(),
      fecha: form.fecha,
      partido: form.partido,
      jugadorEquipo: form.jugadorEquipo.trim(),
      tipo: form.tipo,
      sancion: 'Por definir',
      descripcion: form.descripcion.trim(),
      estado: 'en_revision',
    };

    setIncidencias((lista) => [nuevaIncidencia, ...lista]);
    setForm({ partido: PARTIDOS_DISPONIBLES[0], jugadorEquipo: '', tipo: TIPOS_INCIDENCIA[0], fecha: new Date().toISOString().slice(0, 10), descripcion: '' });
    setConfirmacionVisible(true);
    setTimeout(() => setConfirmacionVisible(false), 4000);
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-1">RF15</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-900">Incidencias y suspensiones</h1>
          <p className="mt-1 text-sm text-stone-500">Reporta incidentes ocurridos en los partidos y consulta el historial de sanciones.</p>
        </header>

        {/* Formulario de reporte */}
        <form onSubmit={enviarReporte} className="mb-8 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <IconAlert className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-800">Reportar nueva incidencia</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Etiqueta>Partido</Etiqueta>
              <select value={form.partido} onChange={(e) => actualizarCampo('partido', e.target.value)} className={inputClases}>
                {PARTIDOS_DISPONIBLES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Etiqueta>Tipo de incidencia</Etiqueta>
              <select value={form.tipo} onChange={(e) => actualizarCampo('tipo', e.target.value)} className={inputClases}>
                {TIPOS_INCIDENCIA.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Etiqueta>Jugador o equipo implicado</Etiqueta>
              <input
                type="text"
                value={form.jugadorEquipo}
                onChange={(e) => actualizarCampo('jugadorEquipo', e.target.value)}
                placeholder="Ej: J. Restrepo (Halcones FC)"
                className={inputClases}
              />
              {errores.jugadorEquipo && <p className="mt-1 text-xs text-rose-600">{errores.jugadorEquipo}</p>}
            </div>
            <div>
              <Etiqueta>Fecha del incidente</Etiqueta>
              <input type="date" value={form.fecha} onChange={(e) => actualizarCampo('fecha', e.target.value)} className={inputClases} />
              {errores.fecha && <p className="mt-1 text-xs text-rose-600">{errores.fecha}</p>}
            </div>
            <div className="sm:col-span-2">
              <Etiqueta>Descripción</Etiqueta>
              <textarea
                value={form.descripcion}
                onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                rows={3}
                placeholder="Describe lo sucedido con el mayor detalle posible…"
                className={inputClases}
              />
              {errores.descripcion && <p className="mt-1 text-xs text-rose-600">{errores.descripcion}</p>}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="submit" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-700 transition-colors">
              Enviar reporte
            </button>
            {confirmacionVisible && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                <IconCheck className="h-4 w-4" /> Reporte enviado, quedó en revisión.
              </span>
            )}
          </div>
        </form>

        {/* Historial */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-800">
            <IconShield className="h-4 w-4 text-stone-500" /> Historial de sanciones
          </h2>
        </div>

        <div className="mb-4 inline-flex flex-wrap gap-1 rounded-lg border border-stone-200 bg-white p-1 shadow-sm">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                filtro === f.id ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {incidenciasFiltradas.map((inc) => {
            const estado = ESTADO_ESTILOS[inc.estado];
            return (
              <article key={inc.id} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{inc.jugadorEquipo}</p>
                    <p className="text-xs text-stone-400">{inc.partido}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${estado.clases}`}>
                    {estado.etiqueta}
                  </span>
                </div>
                <p className="mb-2 text-sm text-stone-600">{inc.descripcion}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="font-semibold text-stone-500">{inc.tipo}</span>
                  <span className="text-stone-400">Sanción: <span className="font-semibold text-stone-600">{inc.sancion}</span></span>
                  <span className="text-stone-400">{new Date(inc.fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </article>
            );
          })}

          {incidenciasFiltradas.length === 0 && (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white py-12 text-center">
              <p className="text-sm font-semibold text-stone-700">No hay incidencias en esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}