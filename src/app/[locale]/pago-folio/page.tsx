"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";
import { ArrowRight, FileText, User, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function PagoFolioPage() {
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  
  // Estados
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");

  const btnConfirmar = useT("Añadir al carrito");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ''); 
    setMonto(val);
  };

  const isFormValid = 
    parseFloat(monto) > 0 && 
    nombre.trim().length > 0 && 
    email.includes("@") && 
    folio.trim().length > 0 && 
    fecha !== "";

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const montoNumerico = parseFloat(monto);

    const customExperienceItem = {
      packageId: 0,
      experience: {
        id: 0,
        title: "Aventura Personalizada",
        slug: "aventura-personalizada",
        description: `Pago de folio: ${folio}`,
        location: "Múltiples Destinos",
        images: ["https://images.pexels.com/photos/7709272/pexels-photo-7709272.jpeg"],
        category_id: 0,
        important_info: { codigo: folio, requiere_destino: false },
        created_at: new Date().toISOString(),
      },
      levelName: "Personalizado",
      date: fecha,
      people: 1, 
      pricePerPerson: montoNumerico,
      totalPrice: montoNumerico
    };

    addToCart(customExperienceItem);
    sessionStorage.setItem("tripnova_temp_contact", JSON.stringify({ nombre, email, folio })); 
    router.push(`/${locale}/checkout`);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Tripnova Style Inputs
  const inputClass = "h-14 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-5 font-bold text-foreground placeholder:text-muted-foreground placeholder:font-medium w-full";
  const labelClass = "text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2 ml-1";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        
        {/* Hero Section  */}
        <section className="bg-foreground pt-24 pb-40 relative overflow-hidden rounded-b-[3rem] mx-2 lg:mx-4 mt-4 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <img 
              src="https://images.pexels.com/photos/7709272/pexels-photo-7709272.jpeg" 
              className="w-full h-full object-cover" 
              alt="Tripnova Experiencia" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-transparent"></div>
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-background/10 border border-background/20 rounded-full mb-6 backdrop-blur-sm">
              <FileText className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-background"><T>Servicios Privados</T></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-background mb-6">
              <T>Pago de</T> <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary"><T>Folio</T></span>
            </h1>
            <p className="text-lg text-background/60 font-medium max-w-2xl mx-auto">
              <T>Procesamiento seguro para itinerarios a la medida y servicios exclusivos de Tripnova. Ingresa los detalles de tu folio para proceder al checkout.</T>
            </p>
          </div>
        </section>

        {/* Tarjeta de Formulario Flotante */}
        <section className="container mx-auto px-4 max-w-3xl relative z-20 pb-24 -mt-24">
          <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl p-8 md:p-12">
            
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground"><T>Detalles de la Reserva</T></h2>
                <p className="text-muted-foreground font-medium text-sm"><T>Tus datos están protegidos y encriptados.</T></p>
              </div>
            </div>

            <form onSubmit={handleConfirmarReserva} className="space-y-8">
              
              {/* Bloque Destacado: Monto */}
              <div className="bg-background rounded-[1.5rem] p-6 md:p-8 border border-border focus-within:ring-2 focus-within:ring-primary transition-all">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block"><T>Monto Acordado (MXN + IVA)</T></label>
                <div className="flex items-center mt-2">
                  <span className="text-4xl md:text-5xl font-black text-muted-foreground mr-3">$</span>
                  <Input 
                    type="text" 
                    value={monto}
                    onChange={handleMontoChange}
                    placeholder="0.00"
                    required
                    className="border-none bg-transparent p-0 text-4xl md:text-5xl font-black text-foreground focus-visible:ring-0 shadow-none h-auto placeholder:text-muted-foreground/50 tracking-tighter"
                  />
                </div>
              </div>

              {/* Grid de Datos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <label className={labelClass}><User className="w-4 h-4 text-primary" /> <T>Nombre</T></label>
                  <Input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Nombre completo"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}><Mail className="w-4 h-4 text-primary" /> <T>Correo</T></label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}><FileText className="w-4 h-4 text-primary" /> <T>Folio</T></label>
                  <Input 
                    type="text" 
                    value={folio}
                    onChange={(e) => setFolio(e.target.value.toUpperCase())}
                    required
                    placeholder="Ej: EXP-001"
                    className={`${inputClass} uppercase tracking-wider`}
                  />
                </div>

                <div>
                  <label className={labelClass}><Calendar className="w-4 h-4 text-primary" /> <T>Fecha de Inicio</T></label>
                  <Input 
                    type="date" 
                    value={fecha}
                    min={minDateStr}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="pt-8 mt-8 border-t border-border">
                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  <span className="text-sm uppercase tracking-widest">
                    {btnConfirmar}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}