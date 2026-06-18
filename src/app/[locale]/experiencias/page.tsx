"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, ArrowRight, Loader2, Compass, ArrowUpRight } from "lucide-react";
import { Experience, SupabaseExperienceResponse } from "@/lib/types";
import { T } from "@/components/T";

type ExperienceWithPrice = Experience & { displayPrice: number };

function ExperienciasContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const locale = useLocale();
  
  const [experiences, setExperiences] = useState<ExperienceWithPrice[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('categories_tripnova').select('*');
        if (catData) setCategories(catData);

        const { data: actData, error } = await supabase
          .from('activities_tripnova')
          .select(`
            id, title, slug, description, location, images, category_id, important_info,
            categories:categories_tripnova (id, name, slug),
            activity_packages:activity_packages_tripnova (price)
          `);

        if (error) throw error;

        if (actData) {
          const mappedData: ExperienceWithPrice[] = (actData as unknown as SupabaseExperienceResponse[]).map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description || "",
            location: item.location,
            images: item.images || [], 
            category_id: item.category_id,
            // Reconstruimos el objeto para evitar incompatibilidades estrictas
            categories: item.categories ? { id: item.categories.id, name: item.categories.name, slug: item.categories.slug } : undefined,
            important_info: item.important_info ? item.important_info : undefined,
            displayPrice: item.activity_packages?.[0]?.price || 0
          } as ExperienceWithPrice)); 
          
          setExperiences(mappedData);
        }
      } catch (error) {
        console.error("Error al cargar experiencias:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categories?.slug === selectedCategory;
    const matchesSearch = !searchTerm ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Header Limpio Integrado (Sin cajas oscuras) */}
      <div className="pt-32 pb-12 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-none">
            <T>Directorio de</T><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              <T>Aventuras.</T>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl">
            <T>Curaduría exclusiva de destinos. Filtra por tu estilo de viaje y descubre lugares que desafían lo ordinario.</T>
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 lg:px-8 pb-24">
        {/* Layout de Panel Dividido: Sidebar + Feed */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Sidebar de Filtros (Sticky) */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-28 space-y-8">
            
            {/* Buscador */}
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 block ml-1"><T>Búsqueda</T></label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Ej. Cenotes, Oaxaca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-card border border-border focus-visible:ring-primary font-bold text-foreground shadow-sm w-full"
                />
              </div>
            </div>

            {/* Categorías en formato de lista vertical */}
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 block ml-1"><T>Categorías</T></label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    !selectedCategory 
                      ? 'bg-foreground text-background shadow-md' 
                      : 'bg-transparent text-muted-foreground hover:bg-card border border-transparent hover:border-border'
                  }`}
                >
                  <T>Mostrar Todo</T>
                  {!selectedCategory && <ArrowRight className="w-4 h-4" />}
                </button>
                
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                      selectedCategory === cat.slug 
                        ? 'bg-foreground text-background shadow-md' 
                        : 'bg-transparent text-muted-foreground hover:bg-card border border-transparent hover:border-border'
                    }`}
                  >
                    <T>{cat.name}</T>
                    {selectedCategory === cat.slug && <ArrowRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* COLUMNA DERECHA: Feed de Experiencias (Tarjetas Horizontales) */}
          <div className="w-full lg:w-3/4">
            
            {/* Contador de resultados */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-border"></div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest px-4">
                {filteredExperiences.length} <T>Planes encontrados</T>
              </span>
              <div className="h-[1px] flex-1 bg-border"></div>
            </div>

            {filteredExperiences.length === 0 ? (
              <div className="text-center py-32 bg-card rounded-[3rem] border border-border shadow-sm flex flex-col items-center">
                <Compass className="w-16 h-16 text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight"><T>Búsqueda sin resultados</T></h3>
                <p className="text-muted-foreground font-medium"><T>Intenta cambiar los filtros o elimina tu búsqueda actual.</T></p>
                <button onClick={() => {setSearchTerm(''); setSelectedCategory(null)}} className="mt-8 text-sm font-bold text-primary underline underline-offset-4 hover:text-foreground transition-colors">
                  <T>Limpiar todos los filtros</T>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredExperiences.map((exp) => {
                  const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

                  return (
                    <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block">
                      {/* TARJETA HORIZONTAL (Editorial List View) */}
                      <div className="bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col sm:flex-row p-3 gap-6 items-center">
                        
                        {/* Contenedor de Imagen (1/3 del ancho) */}
                        <div className="w-full sm:w-2/5 md:w-1/3 aspect-[4/3] sm:aspect-square md:aspect-[4/3] relative rounded-[1.5rem] overflow-hidden shrink-0">
                          <img src={thumbImage} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                        
                        {/* Contenido (2/3 del ancho) */}
                        <div className="flex-1 py-2 pr-4 flex flex-col w-full">
                          
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
                              <T>{exp.categories?.name || "Catálogo"}</T>
                            </span>
                            <div className="text-right">
                              <p className="text-lg md:text-2xl font-black text-foreground leading-none">{formatPrice(exp.displayPrice)} MXN</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1"><T>Por Viajero</T></p>
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors leading-none">
                            <T>{exp.title}</T>
                          </h3>
                          
                          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 text-secondary" /> <T>{exp.location}</T>
                          </div>

                          <p className="text-muted-foreground font-medium text-sm line-clamp-2 leading-relaxed mb-6">
                            <T>{exp.description}</T>
                          </p>
                          
                          {/* Footer de Tarjeta */}
                          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors underline underline-offset-4 decoration-border group-hover:decoration-primary">
                              <T>Ver Detalles</T>
                            </span>
                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                            </div>
                          </div>

                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <ExperienciasContent />
    </Suspense>
  );
}