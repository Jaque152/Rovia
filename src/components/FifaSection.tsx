"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
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
      const { data } = await supabase.from('fifa_experiences_tripnova').select('*').order('order_index', { ascending: true });
      if (data) {
        setFifaExps(data);
        if (data.length > 0) setActiveExpId(data[0].id); 
      }
    }
    loadFifaData();
  }, []);

  const activeExp = fifaExps.find(exp => exp.id === activeExpId);

  if (!activeExp) return null;

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-end py-12 lg:py-24 overflow-hidden group">
      
      {/* Fondo Inmersivo Dinámico */}
      <div key={activeExp.image_url} className="absolute inset-0 z-0 animate-fade-in">
        <img src={activeExp.image_url} alt={activeExp.title} className="w-full h-full object-cover transform scale-105 transition-transform duration-[20s] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10 flex flex-col justify-end h-full">
        
        {/* Cabecera Principal Flotante */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-widest"><T>Edición Especial</T></span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
            <T>El evento global,</T><br/>
            <span className="text-primary"><T>a tu manera.</T></span>
          </h2>
        </div>

        {/* Panel de Contenido Glassmorphism */}
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl animate-fade-up">
            <h3 className="text-3xl font-black text-white mb-2"><T>{activeExp.title}</T></h3>
            <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-6"><T>{activeExp.subtitle}</T></p>
            <p className="text-white/80 text-lg leading-relaxed font-medium mb-8">
              <T>{activeExp.description}</T>
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {activeExp.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-white/90 font-medium"><T>{item}</T></span>
                </div>
              ))}
            </div>

            <Button asChild className="w-full rounded-xl h-14 bg-white text-zinc-950 hover:bg-primary hover:text-white font-bold transition-all">
              <Link href={`/${locale}/cotizar`}>
                <T>Reservar Experiencia</T> <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Selector de Pestañas Inferior */}
          <div className="flex flex-col gap-3">
            {fifaExps.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setActiveExpId(exp.id)}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border backdrop-blur-md ${
                  activeExpId === exp.id 
                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(255,107,107,0.3)]' 
                    : 'bg-black/40 border-white/10 hover:bg-black/60 text-white/60'
                }`}
              >
                <div className="text-left">
                  <span className={`block text-xs font-bold uppercase tracking-widest mb-1 ${activeExpId === exp.id ? 'text-primary' : 'text-white/40'}`}>
                    <T>{exp.subtitle}</T>
                  </span>
                  <span className={`block text-xl font-black tracking-tight ${activeExpId === exp.id ? 'text-white' : 'text-white/70'}`}>
                    <T>{exp.title}</T>
                  </span>
                </div>
                {activeExpId === exp.id && <ArrowRight className="w-6 h-6 text-primary animate-pulse" />}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}