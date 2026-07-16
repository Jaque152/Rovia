"use client";
import { T } from "@/components/T";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLocale } from 'next-intl';

export function Hero() {
  const locale = useLocale();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-48 pb-24 overflow-hidden bg-background">
      {/* Brillo Rosa ambiental */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center animate-fade-up">
        
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-sm mb-10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-black text-foreground tracking-widest uppercase">
            <T>Evolucionando la forma de viajar</T>
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-black leading-[0.9] text-foreground max-w-5xl mb-8 tracking-tighter">
          <T>Desata tu</T>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            <T>Instinto</T>
          </span>
        </h1>

        <p className="text-lg md:text-2xl font-medium text-muted-foreground max-w-3xl leading-relaxed mb-12">
          <T>Creamos experiencias inmersivas con una planificación detallada. Tú decides a dónde ir, nosotros nos encargamos de que sea inolvidable.</T>
        </p>

        <Button asChild size="lg" className="h-16 px-12 rounded-full bg-foreground text-background font-black text-lg hover:bg-primary transition-all shadow-2xl hover:shadow-primary/30 hover:-translate-y-1">
          <Link href={`/${locale}/#contacto`}>
            <Compass className="w-6 h-6 mr-3 animate-pulse" />
            <T>Diseñar mi viaje</T>
          </Link>
        </Button>

        {/* Mosaico Cinemático Rediseñado */}
        <div className="w-full max-w-6xl mt-24 h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden relative shadow-2xl group border-4 border-background">
          <img 
            src="https://images.pexels.com/photos/12665188/pexels-photo-12665188.jpeg" 
            alt="Hero Visual" 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          <div className="absolute bottom-10 left-10 glass-panel px-8 py-5 rounded-[2rem] flex items-center gap-5 backdrop-blur-3xl">
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="text-left text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1"><T>Próximo Destino</T></p>
              <p className="text-xl font-black"><T>Descubre la magia</T></p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}