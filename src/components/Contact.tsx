'use client';
import { T } from "@/components/T";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, ArrowRight, CheckCircle, AlertCircle, Sparkles, Plus, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const faqs = [
  { 
    q: "¿Cómo funciona el esquema de pago?", 
    a: "Procesamos tus pagos a través de pasarelas digitales cifradas. Todas las tarifas mostradas son netas (incluyen IVA) y se liquidan en una sola exhibición sin sorpresas." 
  },
  { 
    q: "¿Diseñan rutas 100% personalizadas?", 
    a: "Absolutamente. Moldeamos cada aspecto del itinerario basándonos en tus pasiones, las fechas disponibles y el ritmo al que deseas viajar." 
  },
  { 
    q: "¿Coordinan viajes para familias o grupos?", 
    a: "Por supuesto. Adaptamos nuestra logística integral sin importar si viajas en pareja, con tu familia entera o en grupos numerosos." 
  },
  { 
    q: "¿Qué sucede si decido cambiar de destino?", 
    a: "Solo infórmanos antes de confirmar tu ruta final. Contamos con alcance y alianzas operativas en los rincones más fascinantes de México." 
  },
  { 
    q: "¿Tienen planes para viajeros solitarios?", 
    a: "Totalmente. Diseñamos aventuras para quienes viajan solos, desde escapadas de introspección y bienestar, hasta inmersiones locales comunitarias." 
  }
];

export function Contact() {
  const locale = useLocale(); 
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (window.location.hash === '#contacto') {
      const element = document.getElementById('contacto');
      if (element) setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); 
    
    try {
      const { error: dbError } = await supabase.from("contact_messages_tripnova").insert([{ 
        full_name: formData.name, email: formData.email, phone: formData.phone, message: formData.message 
      }]);
      if (dbError) throw new Error(`Error BD: ${dbError.message}`);
      
      const response = await fetch("/api/send", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ type: "CONTACT", locale: locale, ...formData, customerName: formData.name }) 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.error || "Fallo al enviar correo");
      }
      
      setShowSuccess(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Ocurrió un fallo en el envío.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 lg:py-40 bg-background relative overflow-hidden border-t border-border/40">
      
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Lado Izquierdo: FAQ Editorial (Span 5) */}
          <div className="lg:col-span-5 animate-fade-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 tracking-tighter leading-[0.95]">
              <T>Sin zonas</T><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                <T>grises.</T>
              </span>
            </h2>
            <p className="text-muted-foreground font-medium mb-12 text-lg md:text-xl leading-relaxed">
              <T>Transparencia total desde el primer contacto. Resolvemos tus inquietudes para que tu única preocupación sea disfrutar.</T>
            </p>
            
            <div className="flex flex-col border-t border-border/60">
              {faqs.map((faq, index) => {
                const isActive = openFaq === index;
                return (
                  <div key={index} className="border-b border-border/60 group">
                    <button 
                      onClick={() => setOpenFaq(isActive ? null : index)} 
                      className="w-full flex items-center justify-between py-6 text-left outline-none"
                    >
                      <span className={`font-black text-lg md:text-xl tracking-tight transition-colors duration-300 pr-6 ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                        <T>{faq.q}</T>
                      </span>
                      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 border ${isActive ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 rotate-180' : 'bg-background border-border text-foreground/40 group-hover:border-primary/50'}`}>
                        {isActive ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-64 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed pr-8">
                        <T>{faq.a}</T>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado Derecho: Formulario Glassmorphism (Span 7) */}
          <div className="lg:col-span-7 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {showSuccess ? (
              <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-border/50 p-12 md:p-20 text-center flex flex-col items-center justify-center min-h-[600px]">
                <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mb-10 shadow-inner">
                  <CheckCircle className="w-14 h-14 text-primary" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight"><T>¡Mensaje en camino!</T></h3>
                <p className="text-muted-foreground font-medium mb-12 text-lg md:text-xl leading-relaxed max-w-md">
                  <T>Agradecemos tu interés. Nuestro equipo de asesores revisará tu solicitud y te contactará a la brevedad posible.</T>
                </p>
                <Button onClick={() => setShowSuccess(false)} variant="outline" className="h-16 px-10 rounded-full font-black text-lg border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <T>Escribir un nuevo mensaje</T>
                </Button>
              </div>
            ) : (
              <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-border/60 p-8 md:p-14 relative">
                
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 shadow-sm mb-6">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      <T>Atención Personalizada</T>
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter"><T>Inicia tu Travesía</T></h3>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg"><T>Cuéntanos qué tienes en mente y nuestro equipo de expertos trazará el mapa ideal para ti.</T></p>
                </div>

                {errorMessage && (
                  <div className="mb-8 p-5 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive font-bold text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-3"><T>Nombre completo</T></label>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        required 
                        className="h-16 bg-background/50 border-border/80 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-full px-6 font-medium text-base md:text-lg shadow-sm transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-3"><T>Teléfono</T></label>
                      <Input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        required 
                        className="h-16 bg-background/50 border-border/80 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-full px-6 font-medium text-base md:text-lg shadow-sm transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-3"><T>Correo Electrónico</T></label>
                    <Input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      required 
                      className="h-16 bg-background/50 border-border/80 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-full px-6 font-medium text-base md:text-lg shadow-sm transition-all" 
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end ml-3 mr-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground"><T>Detalles de tu viaje</T></label>
                      <span className="text-xs font-bold text-muted-foreground/50">{formData.message.length}/180</span>
                    </div>
                    <Textarea 
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                      rows={4} 
                      maxLength={180} 
                      className="bg-background/50 border-border/80 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-[2rem] px-6 py-5 font-medium text-base md:text-lg resize-none shadow-sm transition-all" 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={!formData.name || isSubmitting} 
                    className="w-full h-20 mt-6 rounded-full bg-foreground text-background hover:bg-primary hover:text-white font-black text-xl transition-all shadow-xl hover:shadow-[0_0_40px_rgba(228,0,124,0.3)] hover:-translate-y-1 group"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin w-6 h-6 mr-3" /> : null}
                    <span>{isSubmitting ? <T>Enviando...</T> : <T>Enviar propuesta</T>}</span>
                    {!isSubmitting && <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-3 transition-transform" />}
                  </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-center gap-3 text-sm md:text-base font-bold text-foreground/80">
                   <Mail className="w-5 h-5 text-primary" /> info@rovia.com.mx
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}