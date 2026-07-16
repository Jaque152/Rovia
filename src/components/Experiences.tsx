"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Compass, MapPin } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Experiences() {
  const locale = useLocale();
  
  return (
    <section id="experiencias" className="py-24 lg:py-32 relative bg-background overflow-hidden border-y border-border/40">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Cabecera Editorial Asimétrica */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 lg:mb-24 animate-fade-up">
           <div className="max-w-4xl">
             <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-primary/20 text-primary font-black tracking-widest uppercase text-xs bg-primary/5 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <T>Curaduría de Destinos</T>
             </div>
             <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.9] text-foreground">
               <T>Conecta con la</T> <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                 <T>esencia de México.</T>
               </span>
             </h2>
           </div>
           
           <Button asChild variant="outline" className="shrink-0 rounded-full h-16 px-10 font-black text-base border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm hover:shadow-primary/30 group">
             <Link href={`/${locale}/experiencias`}>
               <T>Ver catálogo completo</T>
               <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
             </Link>
           </Button>
        </div>

        {/* Layout Asimétrico (Bento Z-Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Columna Izquierda: Tarjeta Vertical Alta (Dark Theme) */}
          <Link 
            href={`/${locale}/experiencias?categoria=tours-locales`} 
            className="lg:col-span-5 relative flex flex-col justify-between p-10 md:p-14 rounded-[3rem] bg-foreground text-background overflow-hidden group shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 min-h-[450px] lg:min-h-[600px] outline-none animate-fade-up" 
            style={{ animationDelay: '0.1s' }}
          >
            <Compass className="absolute -bottom-16 -right-16 w-96 h-96 opacity-[0.04] text-background group-hover:-rotate-12 transition-transform duration-[2s] ease-out" />
            
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="w-16 h-16 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                <MapPin className="w-7 h-7 text-background" />
              </div>
              <div className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                <ArrowRight className="w-5 h-5 text-background -rotate-45 group-hover:rotate-0 transition-all duration-500" />
              </div>
            </div>

            <div className="relative z-10 mt-20">
              <p className="text-primary font-black uppercase tracking-widest text-xs mb-4"><T>Inmersión Local</T></p>
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-background tracking-tighter leading-none"><T>Raíces y Leyendas</T></h3>
              <p className="text-background/70 font-medium leading-relaxed text-lg max-w-sm"><T>Adéntrate en los secretos de cada región, guiado por expertos que conocen la verdadera magia oculta de nuestro país.</T></p>
            </div>
          </Link>

          {/* Columna Derecha: Tarjetas Apiladas */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            
            {/* Tarjeta Superior: Panorámica con Imagen (Rutas) */}
            <Link 
              href={`/${locale}/experiencias?categoria=itinerarios-viaje`} 
              className="flex-1 relative overflow-hidden rounded-[3rem] group min-h-[350px] lg:min-h-[auto] shadow-xl outline-none animate-fade-up" 
              style={{ animationDelay: '0.2s' }}
            >
               <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg')] bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

               <div className="absolute inset-0 p-10 md:p-12 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="bg-primary/90 backdrop-blur-md text-white font-black uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-full shadow-lg">
                      <T>Top Selección</T>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white leading-none">
                      <T>Tu Viaje, Tu Lienzo</T>
                    </h3>
                    <p className="text-base md:text-lg text-white/80 max-w-md mb-8 font-medium leading-relaxed">
                      <T>Rutas exclusivas construidas a tu ritmo. Sin prisas, sin itinerarios genéricos, pura libertad de explorar.</T>
                    </p>
                    <div className="flex items-center text-sm font-black text-primary uppercase tracking-widest">
                      <T>Armar itinerario</T> <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-3 transition-transform" />
                    </div>
                  </div>
               </div>
            </Link>

            {/* Tarjeta Inferior: Horizontal Clara (Bienestar) */}
            <Link 
              href={`/${locale}/experiencias?categoria=experiencias-bienestar`} 
              className="h-auto lg:h-[220px] p-8 md:p-10 rounded-[3rem] bg-card border border-border/80 flex flex-col sm:flex-row items-start sm:items-center gap-8 group hover:shadow-xl hover:border-primary/40 transition-all duration-500 outline-none hover:-translate-y-1 animate-fade-up" 
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex shrink-0 items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <Leaf className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-3 text-foreground tracking-tighter"><T>Pausa Consciente</T></h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-base"><T>Retiros holísticos, meditación y ceremonias ancestrales diseñadas para equilibrar tu energía en entornos de paz.</T></p>
              </div>
              
              <div className="hidden sm:flex w-14 h-14 shrink-0 rounded-full border-2 border-border items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500">
                <ArrowRight className="w-6 h-6 text-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}