"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience, ActivityPackage, CartItem } from "@/lib/types"; 
import { T } from "@/components/T";
import { useT } from "@/hooks/useT"; 
import {
  Minus, Plus, Loader2, MapPin, Fingerprint, ArrowRight, Calendar, Users, Map
} from "lucide-react";
import Link from "next/link";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const phDestino = useT("Ej. Centro Histórico, Hotel X...");

  const [experience, setExperience] = useState<Experience | null>(null);
  const [packages, setPackages] = useState<ActivityPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [people, setPeople] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [isAdding, setIsAdding] = useState(false);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    async function loadFullDetail() {
      if (!params.id) return;
      setLoading(true);
      try {
        const { data: activity } = await supabase
          .from('activities_rovia')
          .select('*, categories:categories_rovia(name, slug)')
          .eq('id', params.id)
          .single();

        const { data: paks } = await supabase
          .from('activity_packages_rovia')
          .select('*')
          .eq('activity_id', params.id)
          .order('id', { ascending: true });

        if (activity) setExperience(activity);
        
        if (paks && paks.length > 0) {
          setPackages(paks);
          setSelectedPackageId(paks[0].id);
        }
      } catch (error) {
        console.error("Error loadFullDetail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFullDetail();
  }, [params.id]);

  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const info = experience?.important_info;
  const requiereDestino = info?.requiere_destino === true;
  const isFormValid = selectedDate && selectedPackage && (!requiereDestino || (requiereDestino && destination.trim() !== ""));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);
  };

  const handleAddToCart = () => {
    if (!experience || !isFormValid) return;
    setIsAdding(true);
  
    addToCart({
      packageId: selectedPackage!.id,
      experience: experience,
      date: selectedDate,
      people: people,
      levelName: selectedPackage!.package_name,
      pricePerPerson: Number(selectedPackage!.price),
      destino_elegido: requiereDestino ? destination : undefined,
    } as Omit<CartItem, "totalPrice">); 
    
    setTimeout(() => { setIsAdding(false); router.push("/carrito"); }, 500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-14 h-14 animate-spin text-primary" />
    </div>
  );
  if (!experience) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-white">
      <Header />
      
      <main className="flex-1 flex flex-col w-full relative">
        
        <div className="flex flex-col lg:flex-row w-full">
          
          {/* LADO IZQUIERDO: Wrapper relativo para que el sticky termine donde debe */}
          <div className="w-full lg:w-1/2 relative z-0">
            {/* El contenido fotográfico es sticky dentro de esta columna */}
            <div className="lg:sticky lg:top-0 h-[50vh] lg:h-screen w-full overflow-hidden group">
              <img 
                src={experience.images?.[0] || '/placeholder.jpg'} 
                alt={experience.title} 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
              
              {/* Botón flotante para regresar al catálogo */}
              <div className="absolute top-32 left-8 hidden lg:block">
                <Button asChild variant="outline" className="rounded-full bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white hover:text-black transition-all">
                  <Link href="/experiencias">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> <T>Volver al catálogo</T>
                  </Link>
                </Button>
              </div>

              <div className="absolute bottom-12 left-8 right-8 text-white">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg mb-6">
                   <T>{experience.categories?.name || "Experiencia Rovia"}</T>
                 </div>
                 {/* Título en la imagen para móvil, oculto en desktop donde se lee a la derecha */}
                 <h1 className="text-4xl font-black tracking-tighter lg:hidden drop-shadow-md">
                   <T>{experience.title}</T>
                 </h1>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: Canvas Editorial (Scrollable) */}
          <div className="w-full lg:w-1/2 bg-background relative z-10">
            
            {/* Contenedor Interior con Padding Amplio */}
            <div className="px-8 md:px-16 lg:px-20 pt-16 lg:pt-40 pb-20 max-w-3xl mx-auto w-full">
              
              {/* 1. Encabezado de la Experiencia */}
              <div className="space-y-8 mb-16">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                    <MapPin className="w-5 h-5" /> <T>{experience.location}</T>
                  </div>
                  {info?.codigo && (
                    <div className="flex items-center gap-2 px-4 py-1.5 border border-border text-muted-foreground rounded-full text-[10px] font-bold uppercase tracking-widest">
                      <Fingerprint className="w-3 h-3"/> {info.codigo}
                    </div>
                  )}
                </div>

                {/* Título Masivo en Desktop */}
                <h1 className="hidden lg:block text-5xl xl:text-[4.5rem] font-black text-foreground tracking-tighter leading-[0.9]">
                  <T>{experience.title}</T>
                </h1>

                <p className="text-xl leading-relaxed font-medium text-muted-foreground pt-6 border-t border-border/50">
                  <T>{experience.description}</T>
                </p>
              </div>

              {/* 2. Área de Configuración y Reserva (Integrada, sin cajas) */}
              <div className="mt-20">
                <h3 className="text-3xl font-black text-foreground mb-10 tracking-tight"><T>Diseña esta travesía</T></h3>
                
                <div className="space-y-12">
                  
                  {/* Selector de Modalidad */}
                  {packages.length > 1 && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"><T>Modalidad de la experiencia</T></label>
                      <div className="relative">
                        <select 
                          className="w-full h-16 bg-transparent border-0 border-b-2 border-border text-2xl font-black focus:border-primary outline-none transition-colors appearance-none cursor-pointer text-foreground"
                          value={selectedPackageId}
                          onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                        >
                          {packages.map(pkg => <option key={pkg.id} value={pkg.id} className="text-base">{pkg.package_name}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Selector de Fecha */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/> <T>Día de inicio</T></label>
                      <Input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} 
                        className="h-16 bg-transparent border-0 border-b-2 border-border text-xl font-bold focus-visible:border-primary focus-visible:ring-0 rounded-none px-0 shadow-none cursor-pointer" 
                      />
                    </div>
                    
                    {/* Selector de Acompañantes */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4 text-primary"/> <T>Acompañantes</T></label>
                      <div className="flex items-center justify-between border-b-2 border-border h-16 px-2">
                        <span className="font-bold text-lg"><T>Viajeros</T></span>
                        <div className="flex items-center gap-6">
                          <button onClick={() => setPeople(Math.max(1, people - 1))} className="text-muted-foreground hover:text-primary transition-colors"><Minus className="w-6 h-6"/></button>
                          <span className="font-black text-3xl w-8 text-center">{people}</span>
                          <button onClick={() => setPeople(people + 1)} className="text-muted-foreground hover:text-primary transition-colors"><Plus className="w-6 h-6"/></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destino Especial */}
                  {requiereDestino && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Map className="w-4 h-4 text-primary"/> <T>Punto de Destino / Recogida</T></label>
                      <Input 
                        placeholder={phDestino} 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                        className="h-16 bg-transparent border-0 border-b-2 border-border text-xl font-medium focus-visible:border-primary focus-visible:ring-0 rounded-none px-0 shadow-none" 
                      />
                    </div>
                  )}
                  
                </div>
              </div>
              
              {/* 3. Área de Cierre y Pago (Anclada al final del contenido) */}
              <div className="mt-20 pt-12 border-t-4 border-foreground">
                {selectedPackage && (
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-10">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest"><T>Inversión por viajero</T></p>
                      <p className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-none">{formatPrice(selectedPackage.price)}</p>
                    </div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full w-fit"><T>Impuestos incluidos</T></p>
                  </div>
                )}

                <Button 
                  className="w-full h-20 rounded-full font-black text-xl bg-primary text-white hover:bg-foreground hover:text-background transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(228,0,124,0.3)] hover:-translate-y-1 group disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                  onClick={handleAddToCart}
                  disabled={!isFormValid || isAdding}
                >
                  {isAdding ? <Loader2 className="animate-spin w-6 h-6 mr-3" /> : null}
                  <span>{isAdding ? <T>Añadiendo a bolsa...</T> : <T>Reservar Experiencia</T>}</span>
                  {!isAdding && <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-3 transition-transform" />}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer renderizado a todo lo ancho al final de ambas columnas */}
      <Footer />
    </div>
  );
}