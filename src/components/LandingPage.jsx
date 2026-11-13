import React from "react";
import {
  Wrench,
  Bike,
  Calendar,
  MessageCircle,
  Smartphone,
  Cloud,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Search,
  ExternalLink,
} from "lucide-react";

export default function LandingPage({ onEnterApp }) {
  const whatsappContactUrl = "https://wa.me/56900000000?text=" + encodeURIComponent("¡Hola TC Digital! Me interesa conocer más sobre el sistema de gestión para talleres de bicicletas.");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-200 shadow-sm bg-sand-100 flex-shrink-0">
              <img src="./logo.jpg" alt="RIDE LAB" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  RideFlow
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                  Taller OS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">
                by <a href="https://tcdigital.cl" target="_blank" rel="noreferrer" className="text-amber-800 hover:underline font-semibold">TC Digital</a>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#caracteristicas"
              className="hidden md:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Características
            </a>
            <a
              href="#planes"
              className="hidden md:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Planes
            </a>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Entrar al Taller Demo</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-gradient-to-b from-white via-sand-50/40 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Desarrollado para la comunidad Biker & MTB en Chile</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            El Software que los Mecánicos de Bicicletas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">
              Realmente Disfrutan Usar
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Deja atrás las notas desordenadas en tu iPhone y los cuadernos manchados de grasa. Organiza tus mantenciones, controla tu agenda de entregas y consulta el historial de cada bicicleta en segundos.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              Explorar Taller Activo (RIDE LAB)
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#planes"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
            >
              Quiero este sistema para mi Taller
            </a>
          </div>

          {/* Highlights tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Optimizado para iPhone
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Comprobantes por WhatsApp
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Nube Supabase & Offline
            </span>
          </div>

          {/* Visual Showcase Card */}
          <div className="mt-12 relative max-w-3xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-100 shadow-xl border border-slate-200">
            <div className="bg-white rounded-xl p-4 sm:p-6 text-left border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img src="./logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">RIDE LAB | Taller de MTB</h3>
                    <p className="text-[11px] text-slate-500">Caso de Estudio Real • @ridelab.taller</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ● Sistema en Producción
                </span>
              </div>

              {/* Sample card simulation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">Cristian Pinto</span>
                    <span className="bg-blue-100 text-blue-900 px-2 py-0.2 rounded font-semibold text-[10px]">En Taller</span>
                  </div>
                  <p className="text-slate-600 mt-1">Commencal Clash (Talla L)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Tubeless x2, Válvulas color x2, Líquido sellante</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between font-mono font-bold text-slate-900">
                    <span>Total: $45.000</span>
                    <span className="text-emerald-700 flex items-center gap-1 font-sans text-[11px]">
                      <MessageCircle className="w-3 h-3" /> WhatsApp Listo
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">Patricio</span>
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded font-semibold text-[10px]">Listo para Retiro</span>
                  </div>
                  <p className="text-slate-600 mt-1">Polygon Collosus N7 (Talla M)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Mantención completa $55.000, Rodamientos maza $24.000</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between font-mono font-bold text-slate-900">
                    <span>Total: $79.000</span>
                    <span className="text-emerald-700 flex items-center gap-1 font-sans text-[11px]">
                      <MessageCircle className="w-3 h-3" /> Notificado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ¿Por qué los talleres pierden tiempo y clientes?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              La mayoría de los mecánicos independientes y talleres de barrio usan las Notas del teléfono o WhatsApp. El problema empieza cuando el taller crece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200/80">
              <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                ❌ La forma tradicional
              </div>
              <h3 className="text-lg font-bold text-rose-950 mb-3">
                Notas de iPhone, hojas de papel y WhatsApp
              </h3>
              <ul className="space-y-2.5 text-xs text-rose-900">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>El cliente pregunta a los 2 meses:</strong> "¿Te acuerdas qué le hicimos a mi bici o qué talla de neumático le pusimos?" y no tienes idea.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Colapso de fin de semana:</strong> No sabes cuántas bicicletas prometiste entregar el viernes y terminas trabajando hasta la madrugada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Cobros poco profesionales:</strong> Mensajes de texto desordenados donde el cliente duda de los repuestos cobrados.</span>
                </li>
              </ul>
            </div>

            {/* The RideFlow Way */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                ✅ Con RideFlow Taller OS
              </div>
              <h3 className="text-lg font-bold text-emerald-950 mb-3">
                Orden quirúrgico con 2 toques en tu celular
              </h3>
              <ul className="space-y-2.5 text-xs text-emerald-900">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Ficha técnica de por vida:</strong> Escribes el nombre del rider y ves todo lo que se le ha hecho, valores, fechas y notas de presiones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Agenda inteligente con alertas:</strong> Alerta visual cuando agendas más de 3 bicicletas por día para no sobrecargarte.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Comprobante oficial por WhatsApp:</strong> Envía un detalle impecable con logo de tu taller y valores desglosados en 1 clic.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="caracteristicas" className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            Diseñado para la mecánica real
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Todo lo que tu taller necesita en una sola pantalla
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
            <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl w-fit mb-3">
              <Smartphone className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">App Nativa para iPhone & Android</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Instálala directamente con "Agregar a pantalla de inicio". Abre en pantalla completa sin barras de navegador, rápida y ligera.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
            <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl w-fit mb-3">
              <Search className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Búsqueda Instantánea de Fichas</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Encuentra a cualquier cliente por nombre, marca de bicicleta o repuesto. Historial de todas las visitas anteriores acumuladas.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
            <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl w-fit mb-3">
              <Calendar className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Agenda Anti-Colapso</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Organiza los compromisos por Hoy, Mañana y Esta Semana con medidor de capacidad de trabajo para no estresarte.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
            <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl w-fit mb-3">
              <MessageCircle className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Avisos Directos a WhatsApp</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Genera automáticamente el mensaje con el desglose de ítems, precio final en pesos chilenos y firma cordial del taller.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
            <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl w-fit mb-3">
              <Cloud className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Nube Supabase & Tiempo Real</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Registra una bici en el computador del mesón y mírala aparecer de inmediato en el teléfono del mecánico en el banco de trabajo.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
            <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl w-fit mb-3">
              <Zap className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Catálogo de 1 Toque</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Botones directos para agregar servicios comunes (Mantención full, tubeless, purgado, enrayado) sin tipear todo cada vez.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="planes" className="py-16 bg-sand-50/50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              Planes Flexibles
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Diseñado para mecánicos individuales y talleres en crecimiento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Plan Starter / Amigo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Plan Taller Amigo
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Versión Local & PWA</h3>
                <div className="mt-3 font-extrabold text-3xl text-slate-900">
                  Gratis <span className="text-xs text-slate-500 font-normal">/ para siempre</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Ideal para mecánicos que trabajan solos y quieren ordenar sus notas de iPhone.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mantenciones y clientes ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PWA instalable en iPhone / Android
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp directo con desglose
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Respaldo en archivo JSON con 1 clic
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Probar en el Demo
              </button>
            </div>

            {/* Plan Pro Cloud */}
            <div className="bg-white p-6 rounded-2xl border-2 border-amber-600 shadow-lg relative flex flex-col justify-between">
              <span className="absolute -top-3 right-6 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                Recomendado Talleres
              </span>

              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Plan Cloud & Subdominio
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">RideFlow Pro</h3>
                <div className="mt-3 font-extrabold text-3xl text-slate-900">
                  A consultar <span className="text-xs text-slate-500 font-normal">/ con TC Digital</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Sincronización multi-dispositivo en tiempo real con Supabase y tu propio enlace.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Base de datos PostgreSQL en Supabase
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sincronización PC + Celular al segundo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Subdominio exclusivo (ej: <code>taller.tcdigital.cl</code>)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Próximamente: Portal de reserva online
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Soporte e implementación por TC Digital
                  </li>
                </ul>
              </div>

              <a
                href={whatsappContactUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition text-center block shadow"
              >
                Solicitar para mi Taller
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA TC Digital Footer */}
      <footer className="bg-stone-900 text-white py-12 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-lg text-white">RideFlow OS</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">v1.2</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-md">
              Desarrollado y mantenido por{" "}
              <a href="https://tcdigital.cl" target="_blank" rel="noreferrer" className="text-amber-400 font-bold hover:underline">
                TC Digital
              </a>
              . Soluciones digitales a medida para emprendimientos, talleres y empresas en Chile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-bold transition"
            >
              Abrir App del Taller
            </button>
            <a
              href="https://tcdigital.cl"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-stone-400 hover:text-white transition flex items-center gap-1"
            >
              tcdigital.cl <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
