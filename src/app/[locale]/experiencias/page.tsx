"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, Loader2, Compass, ArrowUpRight, Sparkles } from "lucide-react";
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
        const { data: catData } = await supabase.from('categories_rovia').select('*');
        if (catData) setCategories(catData);

        const { data: actData, error } = await supabase
          .from('activities_rovia')
          .select(`
            id, title, slug, description, location, images, category_id, important_info,
            categories:categories_rovia (id, name, slug),
            activity_packages:activity_packages_rovia (price)
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
      <Loader2 className="w-14 h-14 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-white">
      <Header />
      
      {/* Resplandor superior para ambientar la cabecera */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* CABECERA INMERSIVA (Buscador Central) */}
      <div className="pt-40 pb-16 container mx-auto px-6 relative z-10 text-center animate-fade-up">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 shadow-sm mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            <T>Colección Premium</T>
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
          <T>Catálogo de</T><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            <T>Travesías.</T>
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12">
          <T>Explora nuestra selección élite de destinos. Busca por región, ambiente o nombre y encuentra el escape perfecto.</T>
        </p>

        {/* Buscador Masivo Centrado */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-8 w-6 h-6 text-primary" />
            <Input
              placeholder="Ej. Cenotes, Oaxaca, Temazcal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-20 w-full pl-20 pr-8 rounded-full bg-card/80 backdrop-blur-xl border-2 border-border/60 focus-visible:border-primary focus-visible:ring-0 text-xl font-bold text-foreground shadow-2xl placeholder:text-muted-foreground/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS HORIZONTAL (Sticky Dynamic Menu) */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-3xl border-b border-border/50 py-4 transition-all">
        <div className="container mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 items-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                !selectedCategory 
                  ? 'bg-foreground text-background shadow-lg scale-105' 
                  : 'bg-card text-muted-foreground border border-border/60 hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <T>Todo el catálogo</T>
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat.slug 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                    : 'bg-card text-muted-foreground border border-border/60 hover:border-primary/50 hover:text-foreground'
                }`}
              >
                <T>{cat.name}</T>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CUADRÍCULA DE EXPERIENCIAS (Grid Editorial) */}
      <main className="flex-1 container mx-auto px-6 pt-12 pb-32 relative z-10">
        
        {/* Contador Limpio */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            {selectedCategory ? <T>Resultados Filtrados</T> : <T>Todas las experiencias</T>}
          </h2>
          <span className="text-xs font-black bg-primary/10 text-primary px-4 py-2 rounded-full uppercase tracking-widest">
            {filteredExperiences.length} <T>Disponibles</T>
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-40 bg-card/50 rounded-[3rem] border border-border/50 flex flex-col items-center animate-fade-in">
            <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
              <Compass className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-3 tracking-tighter"><T>No encontramos esa ruta</T></h3>
            <p className="text-muted-foreground font-medium text-lg mb-8 max-w-md"><T>Prueba ajustando los filtros o utilizando términos diferentes en el buscador.</T></p>
            <button onClick={() => {setSearchTerm(''); setSelectedCategory(null)}} className="h-14 px-8 rounded-full bg-foreground text-background font-black hover:bg-primary transition-all shadow-lg">
              <T>Restablecer búsqueda</T>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredExperiences.map((exp, index) => {
              const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

              return (
                <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block outline-none animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  
                  <div className="bg-transparent flex flex-col h-full relative">
                    
                    {/* Contenedor de Fotografía Masiva (4:5 Aspect Ratio) */}
                    <div className="w-full aspect-[4/5] relative rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border border-border/20 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                      <img src={thumbImage} alt={exp.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Precio flotante y Categoría dentro de la imagen */}
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <span className="bg-background/90 backdrop-blur-md text-foreground font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                          <T>{exp.categories?.name || "Catálogo"}</T>
                        </span>
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                          <ArrowUpRight className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-white/90 mb-2">
                          <MapPin className="w-4 h-4 text-primary" /> <T>{exp.location}</T>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-white leading-[1.1] drop-shadow-md">
                          <T>{exp.title}</T>
                        </h3>
                      </div>
                    </div>
                    
                    {/* Contenido Secundario (Debajo de la foto) */}
                    <div className="px-2 flex items-center justify-between">
                      <p className="text-muted-foreground font-medium text-sm line-clamp-2 max-w-[70%]">
                        <T>{exp.description}</T>
                      </p>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-black text-foreground">{formatPrice(exp.displayPrice)}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><T>MXN / IVA Inc.</T></p>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-14 h-14 animate-spin text-primary" />
      </div>
    }>
      <ExperienciasContent />
    </Suspense>
  );
}