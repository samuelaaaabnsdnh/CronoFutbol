import { useState } from "react";
import { Trophy, Plus, X, Users, CalendarRange, Megaphone, Trash2, Send, Lock } from "lucide-react";

/**
 * RF09 — Gestión de convocatorias
 * Identidad visual: "marcador de estadio" — fondo cancha nocturna, acentos
 * ámbar (acción) y verde turf (estado activo), cifras clave en mono tabular.
 */

const ESTADOS = {
  borrador: { label: "Borrador", chip: "bg-[#3A4A40] text-[#C9D6CC]" },
  abierta: { label: "Abierta", chip: "bg-[#143D2C] text-[#3FA34D] ring-1 ring-[#3FA34D]/40" },
  cerrada: { label: "Cerrada", chip: "bg-[#3D1C1C] text-[#E08585] ring-1 ring-[#D6483F]/40" },
};

const SEED = [
  {
    id: "c1",
    nombre: "Copa Apertura Sub-17",
    categoria: "Sub-17",
    fechaInicio: "2026-07-04",
    fechaCierre: "2026-07-18",
    cupos: 16,
    inscritos: 11,
    estado: "abierta",
  },
  {
    id: "c2",
    nombre: "Liga Libre Aficionados",
    categoria: "Libre",
    fechaInicio: "2026-06-15",
    fechaCierre: "2026-06-30",
    cupos: 12,
    inscritos: 12,
    estado: "cerrada",
  },
  {
    id: "c3",
    nombre: "Torneo Femenino Apertura",
    categoria: "Femenino",
    fechaInicio: "2026-08-01",
    fechaCierre: "2026-08-20",
    cupos: 10,
    inscritos: 0,
    estado: "borrador",
  },
];

const FILTROS = ["todas", "abierta", "borrador", "cerrada"];

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }).toUpperCase();
}

export default function GestionConvocatorias() {
  const [convocatorias, setConvocatorias] = useState(SEED);
  const [filtro, setFiltro] = useState("todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ nombre: "", categoria: "", fechaInicio: "", fechaCierre: "", cupos: 8 });

  const visibles = convocatorias.filter((c) => filtro === "todas" || c.estado === filtro);

  function cambiarEstado(id, estado) {
    setConvocatorias((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
  }

  function eliminar(id) {
    setConvocatorias((prev) => prev.filter((c) => c.id !== id));
  }

  function crearConvocatoria(e) {
    e.preventDefault();
    if (!form.nombre || !form.fechaInicio || !form.fechaCierre) return;
    const nueva = {
      id: `c${Date.now()}`,
      nombre: form.nombre,
      categoria: form.categoria || "General",
      fechaInicio: form.fechaInicio,
      fechaCierre: form.fechaCierre,
      cupos: Number(form.cupos) || 8,
      inscritos: 0,
      estado: "borrador",
    };
    setConvocatorias((prev) => [nueva, ...prev]);
    setForm({ nombre: "", categoria: "", fechaInicio: "", fechaCierre: "", cupos: 8 });
    setModalAbierto(false);
  }

  return (
    <div className="min-h-full w-full bg-[#0B2E22] text-[#F4F7F2] p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#143D2C] ring-1 ring-[#3FA34D]/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#F2A93B]" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide leading-none">Convocatorias</h1>
              <p className="text-xs text-[#9FB8AC] mt-1 tracking-wide">RF09 · Gestor de torneos</p>
            </div>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 bg-[#F2A93B] text-[#0B2E22] font-bold text-sm uppercase tracking-wide px-4 py-2.5 rounded-md hover:bg-[#ffc266] transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Nueva
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                filtro === f
                  ? "bg-[#F4F7F2] text-[#0B2E22]"
                  : "bg-[#143D2C] text-[#9FB8AC] hover:bg-[#1B4A36]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {visibles.length === 0 && (
            <div className="text-center py-16 text-[#9FB8AC] text-sm border border-dashed border-[#1B4A36] rounded-lg">
              No hay convocatorias en este filtro todavía.
            </div>
          )}

          {visibles.map((c) => {
            const cupoLleno = c.inscritos >= c.cupos;
            return (
              <div
                key={c.id}
                className="bg-[#143D2C] border border-[#1B4A36] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${ESTADOS[c.estado].chip}`}>
                      {ESTADOS[c.estado].label}
                    </span>
                    <span className="text-[10px] text-[#9FB8AC] uppercase tracking-wide font-mono">{c.categoria}</span>
                  </div>
                  <h3 className="font-bold text-base leading-tight truncate">{c.nombre}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#9FB8AC]">
                    <span className="flex items-center gap-1.5 font-mono tabular-nums">
                      <CalendarRange className="w-3.5 h-3.5" />
                      {formatFecha(c.fechaInicio)} → {formatFecha(c.fechaCierre)}
                    </span>
                    <span className={`flex items-center gap-1.5 font-mono tabular-nums ${cupoLleno ? "text-[#F2A93B]" : ""}`}>
                      <Users className="w-3.5 h-3.5" />
                      {c.inscritos}/{c.cupos}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {c.estado === "borrador" && (
                    <button
                      onClick={() => cambiarEstado(c.id, "abierta")}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-md bg-[#3FA34D]/15 text-[#3FA34D] hover:bg-[#3FA34D]/25 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Publicar
                    </button>
                  )}
                  {c.estado === "abierta" && (
                    <button
                      onClick={() => cambiarEstado(c.id, "cerrada")}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-md bg-[#D6483F]/15 text-[#E08585] hover:bg-[#D6483F]/25 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" /> Cerrar
                    </button>
                  )}
                  <button
                    onClick={() => eliminar(c.id)}
                    aria-label="Eliminar convocatoria"
                    className="p-2 rounded-md text-[#9FB8AC] hover:text-[#E08585] hover:bg-[#D6483F]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal nueva convocatoria */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B2E22] border border-[#1B4A36] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-[#9FB8AC] hover:text-[#F4F7F2]"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <Megaphone className="w-5 h-5 text-[#F2A93B]" />
              <h2 className="font-black uppercase tracking-wide text-lg">Nueva convocatoria</h2>
            </div>
            <form onSubmit={crearConvocatoria} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Nombre del torneo</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Copa Clausura Juvenil"
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm placeholder:text-[#5A7568] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Categoría</label>
                <input
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  placeholder="Ej. Sub-15, Libre, Femenino"
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm placeholder:text-[#5A7568] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Apertura</label>
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                    className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Cierre</label>
                  <input
                    type="date"
                    value={form.fechaCierre}
                    onChange={(e) => setForm({ ...form, fechaCierre: e.target.value })}
                    className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Cupos de equipos</label>
                <input
                  type="number"
                  min={2}
                  value={form.cupos}
                  onChange={(e) => setForm({ ...form, cupos: e.target.value })}
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#F2A93B] text-[#0B2E22] font-bold uppercase tracking-wide text-sm py-3 rounded-md hover:bg-[#ffc266] transition-colors"
              >
                Guardar como borrador
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
