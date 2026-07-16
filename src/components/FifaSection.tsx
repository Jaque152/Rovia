"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { FifaExp } from "@/lib/types";
import { T } from "@/components/T";

export function FifaSection() {
  const [fifaExps, setFifaExps] = useState<FifaExp[]>([]);
  const [activeExpId, setActiveExpId] = useState<number | null>(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadFifaData() {
      const { data } = await supabase.from('fifa_experiences_rovia').select('*').order('order_index', { ascending: true });
      if (data) {
        setFifaExps(data);
        if (data.length > 0) setActiveExpId(data[0].id); 
      }
    }
    loadFifaData();
  }, []);

  const activeExp = fifaExps.find(exp => exp.id === activeExpId);

  if (!fifaExps.length) return null;

  return (
    <section className="relative py-24 lg:py-40 bg-card border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">

        {/* Cabecera Editorial */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-up">
           <div className="max-w-3xl">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20 mb-8 shadow-sm">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-widest"><T>Edición Especial</T></span>
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.95]">
               <T>El evento cumbre,</T><br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                 <T>curado a la perfección.</T>
               </span>
             </h2>
           </div>
           <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
             <T>Hemos seleccionado los accesos más exclusivos para que vivas la pasión del deporte con la logística premium que solo Rovia puede orquestar.</T>
           </p>
        </div>

        {/* Layout Dividido: Acordeón Izquierdo + Galería Derecha */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

           {/* Columna Izquierda: Acordeón Interactivo (Span 5) */}
           <div className="lg:col-span-5 flex flex-col w-full relative z-10">
              {fifaExps.map((exp, index) => {
                 const isActive = activeExpId === exp.id;
                 
                 return (
                    <div
                      key={exp.id}
                      className={`group border-b border-border/60 overflow-hidden transition-all duration-500 ${isActive ? 'pb-10 pt-4' : 'py-8 hover:bg-foreground/5'}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Botón del Acordeón */}
                      <button
                        onClick={() => setActiveExpId(exp.id)}
                        className="w-full text-left flex items-center justify-between outline-none"
                      >
                         <h3 className={`text-3xl md:text-4xl font-black tracking-tighter transition-colors duration-500 ${isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground'}`}>
                           <T>{exp.title}</T>
                         </h3>
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm shrink-0 ml-4 ${isActive ? 'bg-primary text-white rotate-90 shadow-primary/30' : 'bg-background border border-border text-foreground/40 -rotate-45'}`}>
                            <ArrowRight className="w-6 h-6" />
                         </div>
                      </button>

                      {/* Contenido Expandible */}
                      <div className={`transition-all duration-500 ease-in-out origin-top ${isActive ? 'max-h-[800px] opacity-100 mt-8' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                         <p className="text-xs font-black text-foreground uppercase tracking-widest mb-4"><T>{exp.subtitle}</T></p>
                         <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-8">
                           <T>{exp.description}</T>
                         </p>

                         {/* Píldoras de características */}
                         <div className="flex flex-wrap gap-3 mb-10">
                           {exp.items.map((item, i) => (
                             <div key={i} className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border/80 rounded-full shadow-sm">
                               <CheckCircle2 className="w-4 h-4 text-primary" />
                               <span className="text-sm font-bold text-foreground"><T>{item}</T></span>
                             </div>
                           ))}
                         </div>

                         {/* Call to action */}
                         <Button asChild className="w-full rounded-full h-16 text-lg font-black bg-foreground text-background hover:bg-primary transition-all shadow-xl group/btn">
                           <Link href={`/${locale}/cotizar`}>
                             <T>Asegurar mi lugar</T>
                             <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                           </Link>
                         </Button>
                      </div>
                    </div>
                 );
              })}
           </div>

           {/* Columna Derecha: Lienzo Fotográfico Sticky (Span 7) */}
           <div className="lg:col-span-7 lg:sticky top-32 mt-10 lg:mt-0">
              <div className="w-full h-[500px] md:h-[600px] lg:h-[750px] rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-2xl relative border border-border/50 bg-background group">
                 
                 {/* Crossfade de Imágenes */}
                 {fifaExps.map((exp) => (
                    <img
                      key={exp.id}
                      src={exp.image_url}
                      alt={exp.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-in-out ${activeExpId === exp.id ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
                    />
                 ))}
                 
                 {/* Gradiente sutil interior para darle profundidad */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20 pointer-events-none" />

                 {/* Insignia Premium Flotante */}
                 <div className="absolute bottom-8 right-8 z-30 glass-panel px-6 py-3 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs font-black text-white uppercase tracking-widest">
                       <T>Garantía Rovia</T>
                    </p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
}