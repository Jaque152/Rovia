"use client";
import { useLocale } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Experiences() {
  const locale = useLocale();
  return (
    <section id="experiencias" className="py-24 lg:py-32 relative bg-background border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-6 rounded-full px-5 py-2 border-primary/30 text-primary font-bold tracking-widest uppercase text-xs bg-primary/5">
              <T>Gestión de Viajes</T>
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1] text-foreground">
              <T>Recorre México con rutas</T> <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                <T>exclusivas e imborrables.</T>
              </span>
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-full h-12 px-6 font-bold border-2 border-border hover:bg-foreground hover:text-background transition-colors text-foreground">
            <Link href={`/${locale}/experiencias`}><T>Ver todos los planes</T></Link>
          </Button>
        </div>

        {/* Layout de Categorías Nuevas */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Tarjeta Destacada: Itinerarios de Viaje */}
          <Card className="lg:col-span-2 relative overflow-hidden bg-foreground text-background border-none rounded-[2rem] shadow-xl group">
             {/* Imagen épica de carretera o mapa */}
             <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500 mix-blend-overlay" />
             
             <CardContent className="p-10 md:p-14 h-full flex flex-col justify-end relative z-10 min-h-[400px]">
                <Badge className="w-fit mb-6 bg-primary text-white hover:bg-primary border-none font-bold uppercase tracking-widest text-[10px]">
                  <T>Destacado</T>
                </Badge>
                <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
                  <T>Itinerarios a la medida</T>
                </h3>
                <p className="text-lg text-white/80 max-w-lg mb-8 font-medium leading-relaxed">
                  <T>Escapadas exprés, rutas para mochileros y road trips familiares diseñados paso a paso para que tú solo disfrutes el camino.</T>
                </p>
                <Button asChild className="w-fit rounded-full bg-secondary text-foreground hover:bg-white font-bold h-14 px-8 shadow-lg shadow-secondary/20">
                  <Link href={`/${locale}/experiencias?categoria=itinerarios-viaje`}>
                    <T>Explorar itinerarios</T> <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
             </CardContent>
          </Card>

          {/* Tarjetas Secundarias */}
          <div className="flex flex-col gap-6 lg:gap-8">
            
            {/* Experiencias de Bienestar */}
            <Link href={`/${locale}/experiencias?categoria=experiencias-bienestar`} className="flex-1 group">
              <Card className="h-full border border-border bg-card rounded-[2rem] hover:shadow-xl hover:border-secondary/40 transition-all duration-300 relative overflow-hidden">
                <Sparkles className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-secondary group-hover:scale-110 transition-transform" />
                <CardContent className="p-8 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-3 text-foreground tracking-tight"><T>Bienestar & Spa</T></h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed"><T>Retiros de yoga, meditación sonora y temazcales tradicionales para reconectar cuerpo y mente.</T></p>
                  </div>
                  <div className="mt-8 flex items-center text-sm font-bold text-secondary">
                    <T>Descubrir</T> <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Tours Locales */}
            <Link href={`/${locale}/experiencias?categoria=tours-locales`} className="flex-1 group">
              <Card className="h-full border border-border bg-card rounded-[2rem] hover:shadow-xl hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
                <Compass className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-primary group-hover:scale-110 transition-transform" />
                <CardContent className="p-8 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-3 text-foreground tracking-tight"><T>Tours Locales</T></h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed"><T>Recorridos guiados por expertos en pueblos mágicos, zonas arqueológicas y circuitos gastronómicos.</T></p>
                  </div>
                  <div className="mt-8 flex items-center text-sm font-bold text-primary">
                    <T>Descubrir</T> <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
          </div>

        </div>
      </div>
    </section>
  );
}