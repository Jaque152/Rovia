"use client";
import { T } from "@/components/T";
import { Button } from "@/components/ui/button";
import { Globe2, Compass, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useLocale } from 'next-intl';

export function Hero() {
  const locale = useLocale();
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Fondo texturizado cálido */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fca31110_1px,transparent_1px),linear-gradient(to_bottom,#fca31110_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Orbes de luz animados en el fondo */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-secondary/20 rounded-full blur-[80px] animate-pulse delay-1000 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Lado Izquierdo: Tipografía y Acción */}
          <div className="flex flex-col items-start text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm">
              <Compass className="w-4 h-4 text-secondary animate-spin-slow" />
              <span className="text-xs font-bold text-foreground tracking-widest uppercase">
                <T>Redefiniendo el viaje</T>
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[6rem] font-black leading-[0.95] tracking-tighter text-foreground">
              <T>Despierta tu</T>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                <T>Aventura</T>
              </span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-lg leading-relaxed">
              <T>Rutas vibrantes y logística impecable para sumergirte en los lugares más asombrosos de México. Tú eliges el destino, nosotros trazamos el mapa.</T>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-border bg-card/50 backdrop-blur-md font-bold text-lg hover:bg-foreground hover:text-background transition-all">
                <Link href={`/${locale}/#contacto`}>
                  <Globe2 className="w-5 h-5 mr-2" />
                  <T>Hablar con un experto</T>
                </Link>
              </Button>
            </div>
          </div>

          {/* Lado Derecho: Collage Dinámico Interactivo */}
          <div className="relative h-[500px] md:h-[600px] w-full hidden md:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Imagen Principal Central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-3/4 rounded-[2.5rem] overflow-hidden shadow-2xl z-10 group transition-transform duration-700 hover:scale-105">
              <img src="https://images.pexels.com/photos/12665188/pexels-photo-12665188.jpeg" alt="Destino principal" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
            </div>

            {/* Imagen Flotante Superior Izquierda */}
            <div className="absolute top-0 left-0 w-2/5 h-2/5 rounded-[2rem] overflow-hidden shadow-xl z-20 -rotate-6 animate-[bounce_4s_infinite_alternate] group">
              <img src="https://images.pexels.com/photos/30746580/pexels-photo-30746580.jpeg" alt="Aventura" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Imagen Flotante Inferior Derecha */}
            <div className="absolute bottom-0 right-0 w-2/5 h-2/5 rounded-[2rem] overflow-hidden shadow-xl z-20 rotate-6 animate-[bounce_5s_infinite_alternate-reverse] group">
              <img src="https://images.pexels.com/photos/22912077/pexels-photo-22912077.jpeg" alt="Relax" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Tarjeta Glassmorphism de Destino */}
            <div className="absolute bottom-1/4 -left-8 z-30 glass-panel px-5 py-4 rounded-2xl flex items-center gap-4 animate-[bounce_6s_infinite_alternate]">
              <div className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/60 uppercase"><T>Siguiente Parada</T></p>
                <p className="text-lg font-black text-foreground"><T>Oaxaca, MX</T></p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}