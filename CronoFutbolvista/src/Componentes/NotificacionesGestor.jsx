import { useState } from "react";
import { BellRing, Inbox, Send, X, CircleDot, Trophy, AlertTriangle, CalendarClock } from "lucide-react";

/**
 * RF12 — Envío y recepción de notificaciones
 * Cierra la identidad "marcador de estadio": las notificaciones se leen
 * como anuncios de altavoz del estadio, con tipo marcado por icono/color.
 */

const TIPOS = {
  resultado: { label: "Resultado", icon: Trophy, color: "text-[#3FA34D]" },
  calendario: { label: "Calendario", icon: CalendarClock, color: "text-[#F2A93B]" },
  alerta: { label: "Alerta", icon: AlertTriangle, color: "text-[#E08585]" },
};

const SEED_RECIBIDAS = [
  {
    id: "n1",
    titulo: "Resultado validado: Atlético Norte 0–0 Unión Sur",
    mensaje: "El resultado del partido fue confirmado por el comité organizador.",
    tipo: "resultado",
    fecha: "Hace 2 h",
    leido: false,
  },
  {
    id: "n2",
    titulo: "Cambio de horario — Cancha 2",
    mensaje: "El partido Deportivo Aurora vs Los Tigres se adelantó a las 09:00.",
    tipo: "calendario",
    fecha: "Hace 5 h",
    leido: false,
  },
  {
    id: "n3",
    titulo: "Acta rechazada",
    mensaje: "El acta de Deportivo Aurora vs Los Tigres requiere firma del árbitro principal.",
    tipo: "alerta",
    fecha: "Ayer",
    leido: true,
  },
];

const SEED_ENVIADAS = [
  {
    id: "e1",
    titulo: "Convocatoria abierta: Copa Apertura Sub-17",
    mensaje: "Ya pueden inscribirse hasta el 18 de julio.",
    tipo: "calendario",
    fecha: "Hace 1 día",
    destinatario: "Todos los equipos",
  },
];

export default function NotificacionesGestor() {
  const [tab, setTab] = useState("recibidas");
  const [recibidas, setRecibidas] = useState(SEED_RECIBIDAS);
  const [enviadas, setEnviadas] = useState(SEED_ENVIADAS);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ destinatario: "Todos los equipos", titulo: "", mensaje: "", tipo: "calendario" });

  const noLeidas = recibidas.filter((n) => !n.leido).length;

  function marcarLeida(id) {
    setRecibidas((prev) => prev.map((n) => (n.id === id ? { ...n, leido: true } : n)));
  }

  function enviar(e) {
    e.preventDefault();
    if (!form.titulo || !form.mensaje) return;
    const nueva = {
      id: `e${Date.now()}`,
      titulo: form.titulo,
      mensaje: form.mensaje,
      tipo: form.tipo,
      destinatario: form.destinatario,
      fecha: "Ahora",
    };
    setEnviadas((prev) => [nueva, ...prev]);
    setForm({ destinatario: "Todos los equipos", titulo: "", mensaje: "", tipo: "calendario" });
    setModalAbierto(false);
    setTab("enviadas");
  }

  return (
    <div className="min-h-full w-full bg-[#0B2E22] text-[#F4F7F2] p-6 sm:p-10 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#143D2C] ring-1 ring-[#3FA34D]/40 flex items-center justify-center relative">
              <BellRing className="w-5 h-5 text-[#F2A93B]" />
              {noLeidas > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D6483F] text-[9px] font-mono font-bold flex items-center justify-center">
                  {noLeidas}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide leading-none">Notificaciones</h1>
              <p className="text-xs text-[#9FB8AC] mt-1 tracking-wide">RF12 · Envío y recepción</p>
            </div>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 bg-[#F2A93B] text-[#0B2E22] font-bold text-sm uppercase tracking-wide px-4 py-2.5 rounded-md hover:bg-[#ffc266] transition-colors"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#143D2C] rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("recibidas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
              tab === "recibidas" ? "bg-[#F4F7F2] text-[#0B2E22]" : "text-[#9FB8AC] hover:text-[#F4F7F2]"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" /> Recibidas
          </button>
          <button
            onClick={() => setTab("enviadas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
              tab === "enviadas" ? "bg-[#F4F7F2] text-[#0B2E22]" : "text-[#9FB8AC] hover:text-[#F4F7F2]"
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Enviadas
          </button>
        </div>

        {/* Recibidas */}
        {tab === "recibidas" && (
          <div className="space-y-2.5">
            {recibidas.map((n) => {
              const Icono = TIPOS[n.tipo].icon;
              return (
                <button
                  key={n.id}
                  onClick={() => marcarLeida(n.id)}
                  className={`w-full text-left bg-[#143D2C] border rounded-lg p-4 flex gap-3 transition-colors ${
                    n.leido ? "border-[#1B4A36]" : "border-[#3FA34D]/40"
                  }`}
                >
                  <Icono className={`w-4 h-4 mt-0.5 shrink-0 ${TIPOS[n.tipo].color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm leading-snug">{n.titulo}</h3>
                      {!n.leido && <CircleDot className="w-2.5 h-2.5 text-[#F2A93B] shrink-0" fill="currentColor" />}
                    </div>
                    <p className="text-sm text-[#9FB8AC] mt-1 leading-snug">{n.mensaje}</p>
                    <span className="text-[10px] font-mono text-[#5A7568] mt-2 block uppercase tracking-wide">
                      {n.fecha}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Enviadas */}
        {tab === "enviadas" && (
          <div className="space-y-2.5">
            {enviadas.map((n) => {
              const Icono = TIPOS[n.tipo].icon;
              return (
                <div key={n.id} className="bg-[#143D2C] border border-[#1B4A36] rounded-lg p-4 flex gap-3">
                  <Icono className={`w-4 h-4 mt-0.5 shrink-0 ${TIPOS[n.tipo].color}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm leading-snug">{n.titulo}</h3>
                    <p className="text-sm text-[#9FB8AC] mt-1 leading-snug">{n.mensaje}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#5A7568] uppercase tracking-wide">
                      <span>Para: {n.destinatario}</span>
                      <span>{n.fecha}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal enviar */}
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
              <Send className="w-5 h-5 text-[#F2A93B]" />
              <h2 className="font-black uppercase tracking-wide text-lg">Nueva notificación</h2>
            </div>
            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Destinatario</label>
                <input
                  value={form.destinatario}
                  onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
                  placeholder="Ej. Todos los equipos, Halcones FC..."
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm placeholder:text-[#5A7568] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                >
                  {Object.entries(TIPOS).map(([key, t]) => (
                    <option key={key} value={key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Título</label>
                <input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej. Suspensión de fecha por lluvia"
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm placeholder:text-[#5A7568] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#9FB8AC] mb-1.5">Mensaje</label>
                <textarea
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  rows={3}
                  placeholder="Escribe el contenido de la notificación..."
                  className="w-full bg-[#143D2C] border border-[#1B4A36] rounded-md px-3 py-2.5 text-sm placeholder:text-[#5A7568] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#F2A93B] text-[#0B2E22] font-bold uppercase tracking-wide text-sm py-3 rounded-md hover:bg-[#ffc266] transition-colors"
              >
                Enviar notificación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
