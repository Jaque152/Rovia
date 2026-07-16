"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Map, Wallet, UserCircle, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();

  const features = [
    {
      icon: Map,
      title: "Rutas de Autor",
      desc: "Trazamos trayectos exclusivos desde cero, a tu ritmo y estilo personal."
    },
    {
      icon: Wallet,
      title: "Inversión Inteligente",
      desc: "Maximizamos el valor de tu presupuesto sin sacrificar confort ni calidad."
    },
    {
      icon: UserCircle,
      title: "Concierge 24/7",
      desc: "Respaldo humano experto en todo momento, antes y durante tu travesía."
    },
    {
      icon: ShieldCheck,
      title: "Cero Sorpresas",
      desc: "Tarifas netas con impuestos incluidos. Transparencia total garantizada."
    },
  ];

  return (
    <section id="precios" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      
      {/* Contenedor tipo "Isla Flotante Oscura" */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-foreground relative rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-2xl px-6 py-20 md:py-32 border border-border/50">

          {/* Aura brillante Rosa Mexicano en el fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />

          <div className="relative z-10">
            
            {/* Cabecera Centrada */}
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 animate-fade-up">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 shadow-sm mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  <T>Un Modelo Diferente</T>
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] text-white mb-8">
                <T>Tu viaje, sin</T> <span className="text-primary"><T>letras chiquitas.</T></span>
              </h2>

              <p className="text-xl text-white/60 font-medium leading-relaxed max-w-2xl">
                <T>Destruimos los paquetes prefabricados. Diseñamos cada instante basándonos en tus pasiones, con un modelo financiero 100% claro y honesto.</T>
              </p>
            </div>

            {/* Cuadrícula Horizontal de 4 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 animate-fade-up max-w-7xl mx-auto" style={{ animationDelay: '0.2s' }}>
              {features.map((feat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/10 hover:border-primary/50 transition-all duration-500 group backdrop-blur-xl">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-sm">
                    <feat.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight"><T>{feat.title}</T></h3>
                  <p className="text-white/60 font-medium leading-relaxed"><T>{feat.desc}</T></p>
                </div>
              ))}
            </div>

            {/* Llamada a la acción (Botón Resaltado) */}
            <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <Button asChild className="rounded-full h-20 px-14 text-xl font-black bg-primary text-white hover:bg-white hover:text-foreground transition-all shadow-[0_0_50px_rgba(228,0,124,0.4)] hover:shadow-[0_0_70px_rgba(228,0,124,0.6)] hover:-translate-y-1 group">
                <Link href={`/${locale}/cotizar`}>
                  <T>Comenzar a diseñar</T>
                  <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}