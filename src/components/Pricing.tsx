"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Map, Wallet, UserCircle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();

  const features = [
    { icon: Map, title: "Ruta Inteligente", desc: "Itinerarios creados desde cero.", colSpan: "col-span-2 sm:col-span-1" },
    { icon: Wallet, title: "Ajuste de Presupuesto", desc: "Optimizamos cada centavo invertido.", colSpan: "col-span-2 sm:col-span-1" },
    { icon: UserCircle, title: "Asesor Asignado", desc: "Soporte 24/7 en tu viaje.", colSpan: "col-span-2" },
    { icon: ShieldCheck, title: "Transparencia Total", desc: "Sin cuotas ocultas (IVA inc.)", colSpan: "col-span-2" },
  ];

  return (
    <section id="precios" className="py-24 lg:py-32 bg-card relative overflow-hidden border-y border-border">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          
          {/* Lado Izquierdo: Textos Parafraseados */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                <T>Modelo Dinámico</T>
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
              <T>Tu viaje.</T><br/>
              <T>Tu ritmo.</T><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                <T>Cero plantillas.</T>
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
              <T>Sabemos que ningún viajero es igual. Por eso destruimos los paquetes prefabricados y construimos rutas basándonos puramente en lo que te inspira.</T>
            </p>
          </div>

          {/* Lado Derecho: Bento Grid Interactiva (Reemplazo del Ticket) */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <div key={i} className={`bg-background rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group ${feat.colSpan}`}>
                  <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-1"><T>{feat.title}</T></h3>
                  <p className="text-sm font-medium text-muted-foreground"><T>{feat.desc}</T></p>
                </div>
              ))}
              
              {/* Call To Action dentro del Grid */}
              <div className="col-span-2 mt-2">
                <Button asChild className="w-full rounded-2xl h-16 text-lg font-black bg-foreground text-background hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 group">
                  <Link href={`/${locale}/cotizar`}>
                    <T>Diseñar mi ruta</T>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}