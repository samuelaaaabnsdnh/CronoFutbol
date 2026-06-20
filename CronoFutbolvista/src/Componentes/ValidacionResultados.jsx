import { useState } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, ChevronRight, X, Flag } from "lucide-react";

/**
 * RF10 — Validación y control de resultados
 * Misma identidad "marcador de estadio": el panel lateral funciona como
 * el tablero donde el árbitro de mesa confirma o rechaza el marcador.
 */

const ESTADOS = {
  pendiente: { label: "Pendiente", chip: "bg-[#3A4A40] text-[#C9D6CC]", icon: Clock },
  validado: { label: "Validado", chip: "bg-[#143D2C] text-[#3FA34D] ring-1 ring-[#3FA34D]/40", icon: CheckCircle2 },
  rechazado: { label: "Rechazado", chip: "bg-[#3D1C1C] text-[#E08585] ring-1 ring-[#D6483F]/40", icon: XCircle },
};

const SEED = [
  {
    id: "m1",
    local: "Halcones FC",
    visitante: "Real Centro",
    golesLocal: 2,
    golesVisitante: 1,
    fecha: "2026-06-18",
    cancha: "Cancha 3",
    estado: "pendiente",
    motivo: "",
  },
  {
    id: "m2",
    local: "Atlético Norte",
    visitante: "Unión Sur",
    golesLocal: 0,
    golesVisitante: 0,
    fecha: "2026-06-18",
    cancha: "Cancha 1",
    estado: "validado",
    motivo: "",
  },
  {
    id: "m3",
    local: "Deportivo Aurora",
    visitante: "Los Tigres",
    golesLocal: 3,
    golesVisitante: 3,
    fecha: "2026-06-17",
    cancha: "Cancha 2",
    estado: "rechazado",
    motivo: "Acta sin firma del árbitro principal.",
  },
];

export default function ValidacionResultados() {
  const [partidos, setPartidos] = useState(SEED);
  const [seleccionado, setSeleccionado] = useState(null);
  const [edicion, setEdicion] = useState({ golesLocal: 0, golesVisitante: 0, motivo: "" });

  const pendientes = partidos.filter((p) => p.estado === "pendiente").length;

  function abrir(partido) {
    setSeleccionado(partido.id);
    setEdicion({ golesLocal: partido.golesLocal, golesVisitante: partido.golesVisitante, motivo: partido.motivo });
  }

  function cerrar() {
    setSeleccionado(null);
  }

  function aplicar(estado) {
    setPartidos((prev) =>
      prev.map((p) =>
        p.id === seleccionado
          ? {
              ...p,
              golesLocal: Number(edicion.golesLocal),
              golesVisitante: Number(edicion.golesVisitante),
              estado,
              motivo: estado === "rechazado" ? edicion.motivo : "",
            }
          : p
      )
    );
    cerrar();
  }

  const activo = partidos.find((p) => p.id === seleccionado);

  return (
    <div className="min-h-full w-full bg-[#0B2E22] text-[#F4F7F2] p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#143D2C] ring-1 ring-[#3FA34D]/40 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-[#F2A93B]" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide leading-none">Resultados</h1>
              <p className="text-xs text-[#9FB8AC] mt-1 tracking-wide">RF10 · Validación y control</p>
            </div>
          </div>
          {pendientes > 0 && (
            <span className="font-mono text-xs font-bold uppercase tracking-wide bg-[#F2A93B]/15 text-[#F2A93B] px-3 py-1.5 rounded-full">
              {pendientes} por revisar
            </span>
          )}
        </div>

        {/* Lista de partidos */}
        <div className="space-y-2.5">
          {partidos.map((p) => {
            const Icono = ESTADOS[p.estado].icon;
            return (
              <button
                key={p.id}
                onClick={() => abrir(p)}
                className="w-full text-left bg-[#143D2C] border border-[#1B4A36] rounded-lg p-4 flex items-center gap-4 hover:border-[#3FA34D]/40 transition-colors"
              >
                <Icono className="w-4 h-4 text-[#9FB8AC] shrink-0" />

                <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <span className="truncate text-sm font-semibold text-right">{p.local}</span>
                  <span className="font-mono tabular-nums font-black text-base bg-[#0B2E22] rounded px-2.5 py-1 text-[#F2A93B] whitespace-nowrap">
                    {p.golesLocal} – {p.golesVisitante}
                  </span>
                  <span className="truncate text-sm font-semibold">{p.visitante}</span>
                </div>

                <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${ESTADOS[p.estado].chip}`}>
                    {ESTADOS[p.estado].label}
                  </span>
                  <span className="text-[10px] text-[#9FB8AC] mt-1 font-mono">{p.cancha}</span>
                </div>

                <ChevronRight className="w-4 h-4 text-[#5A7568] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de validación */}
      {activo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B2E22] border border-[#1B4A36] rounded-lg w-full max-w-md p-6 relative">
            <button onClick={cerrar} className="absolute top-4 right-4 text-[#9FB8AC] hover:text-[#F4F7F2]" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Flag className="w-4 h-4 text-[#F2A93B]" />
              <span className="text-xs font-mono text-[#9FB8AC]">{activo.cancha} · {activo.fecha}</span>
            </div>
            <h2 className="font-black uppercase tracking-wide text-lg mb-5">
              {activo.local} vs {activo.visitante}
            </h2>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5 truncate max-w-[7rem]">
                  {activo.local}
                </span>
                <input
                  type="number"
                  min={0}
                  value={edicion.golesLocal}
                  onChange={(e) => setEdicion({ ...edicion, golesLocal: e.target.value })}
                  className="w-16 text-center bg-[#143D2C] border border-[#1B4A36] rounded-md py-2 font-mono text-xl font-black focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                />
              </div>
              <span className="font-black text-2xl text-[#5A7568] mt-5">–</span>
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5 truncate max-w-[7rem]">
                  {activo.visitante}
                </span>
                <input
                  type="number"
                  min={0}
                  value={edicion.golesVisitante}
                  onChange={(e) => setEdicion({ ...edicion, golesVisitante: e.target.value })}
                  className="w-16 text-center bg-[#143D2C] border border-[#1B4A36] rounded-md py-2 font-mono text-xl font-black focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">
                Motivo de rechazo (si aplica)
              </label>
              <textarea
                value={edicion.motivo}
                onChange={(e) => setEdicion({ ...edicion, motivo: e.target.value })}
                placeholder="Ej. Inconsistencia entre el acta física y el reporte digital"
                rows={2}
                className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm placeholder:text-[#5A7568] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => aplicar("rechazado")}
                className="flex items-center justify-center gap-1.5 bg-[#D6483F]/15 text-[#E08585] font-bold uppercase tracking-wide text-sm py-3 rounded-md hover:bg-[#D6483F]/25 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Rechazar
              </button>
              <button
                onClick={() => aplicar("validado")}
                className="flex items-center justify-center gap-1.5 bg-[#3FA34D] text-[#0B2E22] font-bold uppercase tracking-wide text-sm py-3 rounded-md hover:bg-[#56c062] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Validar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
