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
  Check, Minus, Plus, Loader2, MapPin, Compass, Sparkles, Fingerprint
} from "lucide-react";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Hooks de traducción
  const phDestino = useT("Escribe tu destino...");

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
          .from('activities_tripnova')
          .select('*, categories:categories_tripnova(name, slug)')
          .eq('id', params.id)
          .single();

        const { data: paks } = await supabase
          .from('activity_packages_tripnova')
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!experience) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Visual Monumental */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={experience.images?.[0] || '/placeholder.jpg'} 
          alt={experience.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <main className="container mx-auto px-6 md:px-12 pb-24 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Contenido Editorial */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Cabecera de la Experiencia */}
            <div className="space-y-6">
              {/* Badges de Localización y SKU */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <MapPin className="w-4 h-4 text-secondary" /> <T>{experience.location}</T>
                </div>
                {info?.codigo && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                    <Fingerprint className="w-4 h-4"/> {info.codigo}
                  </div>
                )}
              </div>

              {/* Título de la experiencia */}
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                <T>{experience.title}</T>
              </h1>
            </div>

            {/* Descripción (Traducida y con espaciado) */}
            <article className="pt-6 border-t border-border">
              <p className="text-xl md:text-2xl leading-relaxed font-medium text-muted-foreground">
                <T>{experience.description}</T>
              </p>
            </article>
          </div>

          {/* Sidebar: Tripnova Concierge Widget */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-[2rem] p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-black text-lg uppercase tracking-widest"><T>Reservar</T></h3>
              </div>

              {/* Selector de Paquete */}
              {packages.length > 1 && (
                <div className="mb-6">
                   <select 
                    className="w-full h-14 px-4 bg-background border border-border rounded-xl font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                  >
                    {packages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.package_name}</option>)}
                  </select>
                </div>
              )}

              {/* Precio */}
              {selectedPackage && (
                <div className="mb-8 p-6 bg-background rounded-2xl border border-border">
                  <p className="text-xs font-black uppercase text-muted-foreground mb-2"><T>Total por viajero</T></p>
                  <p className="text-4xl font-black text-primary tracking-tight">{formatPrice(selectedPackage.price)}</p>
                  <p className="text-xs font-black uppercase "><T>IVA incluido</T></p>
                </div>
              )}

              {/* Inputs de Reserva */}
              <div className="space-y-4">
                {requiereDestino && (
                  <Input placeholder={phDestino} value={destination} onChange={(e) => setDestination(e.target.value)} className="h-14 rounded-xl border-border" />
                )}
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} className="h-14 rounded-xl border-border" />
                
                <div className="flex items-center justify-between bg-background border border-border rounded-xl h-14 px-4">
                  <span className="font-bold text-sm"><T>Viajeros</T></span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4"/></button>
                    <span className="font-black text-lg w-8 text-center">{people}</span>
                    <button onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4"/></button>
                  </div>
                </div>

                <Button 
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-foreground hover:bg-primary transition-all mt-4 text-white"
                  onClick={handleAddToCart}
                  disabled={!isFormValid || isAdding}
                >
                  {isAdding ? <Loader2 className="animate-spin" /> : <T>Confirmar Reserva</T>}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}