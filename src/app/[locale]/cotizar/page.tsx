"use client";
import { useLocale } from 'next-intl';
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { Loader2, ArrowRight, MapPin, Calendar, Users, Wallet, MessageSquare, User, Zap } from "lucide-react";
import { supabase } from '@/lib/supabase';

const BUDGET_OPTIONS = [
  "Menos de $10,000 MXN",
  "$10,000 - $25,000 MXN",
  "$25,000 - $50,000 MXN",
  "$50,000 - $100,000 MXN",
  "Más de $100,000 MXN",
];

function TranslatedOption({ value }: { value: string }) {
  const translatedText = useT(value);
  return <option value={value} className="font-bold">{translatedText}</option>;
}

export default function CotizarPage() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    destination: "", startDate: "", travelers: 2, budget: "", requirements: "", firstName: "", lastName: "", email: "", phone: "",
  });

  const phDestination = useT("Ej: Oaxaca, Riviera Maya...");
  const phRequirements = useT("¿Qué experiencias buscas?");
  const phFirstName = useT("Nombre");
  const phLastName = useT("Apellidos");
  const phEmail = useT("Email");
  const phPhone = useT("Teléfono *");
  const phSelectRange = useT("Selecciona un rango");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      // 1. Guardar en Base de Datos
      const customer_name = `${formData.firstName} ${formData.lastName}`.trim();
      const { error: dbError } = await supabase.from('custom_quotes_tripnova').insert([
        {
          customer_name: customer_name, customer_email: formData.email, phone: formData.phone, destination: formData.destination,
          start_date: formData.startDate, pax_qty: formData.travelers, budget: formData.budget,
          special_requests: formData.requirements, status: 'pending'
        }
      ]);
      
      if (dbError) throw new Error(`Error BD: ${dbError.message}`);

      // 2. Enviar Correo
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUOTE', locale: locale, email: formData.email, phone: formData.phone, customerName: formData.firstName, destination: formData.destination,
          budget: formData.budget, startDate: formData.startDate, travelers: formData.travelers, message: formData.requirements || "Solicitud de itinerario personalizado."
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error Email: ${errorData.error?.message || errorData.error || 'Fallo al enviar correo'}`);
      }
      
      setShowSuccess(true);
    } catch (error: unknown) {
      console.error("Error en Cotización:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`No pudimos procesar tu solicitud: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.destination && formData.startDate && formData.email && formData.firstName && formData.phone;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Tripnova Style Inputs
  const inputClass = "h-14 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-5 font-bold text-foreground placeholder:text-muted-foreground placeholder:font-medium";
  const labelClass = "text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2 ml-1";

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-40 pb-24 flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-card rounded-[2.5rem] p-12 text-center shadow-2xl border border-border">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4 text-foreground"><T>¡Solicitud Recibida!</T></h1>
            <p className="text-muted-foreground font-medium mb-10 text-lg leading-relaxed">
              <T>Hola</T> <strong className="text-foreground">{formData.firstName}</strong>, <T>hemos enviado un correo a</T> <strong className="text-foreground">{formData.email}</strong> <T>confirmando tu solicitud. Nuestros expertos ya están diseñando tu ruta.</T>
            </p>
            <Link href={`/${locale}/`} className="inline-flex items-center justify-center w-full h-16 rounded-2xl bg-foreground text-background font-black hover:bg-primary transition-colors text-lg group shadow-lg">
              <T>Volver al Inicio</T>
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        
        {/* Cabecera Tripnova */}
        <div className="container mx-auto px-4 lg:px-8 mt-10 mb-16">
          <div className="bg-foreground rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-secondary/30 bg-secondary/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary"><T>Viaje a Tu Medida</T></span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-background leading-[1] mb-6">
                <T>Diseñamos tu</T> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"><T>ruta ideal</T></span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                <T>Comparte tu visión con nosotros. Nuestros expertos orquestarán un itinerario exclusivo donde cada detalle lleve tu firma.</T>
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Detalles Panel */}
            <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-black text-foreground mb-10 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-lg"><MapPin className="w-5 h-5 text-primary" /></div>
                <T>Detalles del Viaje</T>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                <div className="md:col-span-2">
                  <label className={labelClass}><T>¿A dónde quieres ir? *</T></label>
                  <Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder={phDestination} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Calendar className="w-4 h-4 text-primary" /> <T>Inicio *</T></label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} min={minDateStr} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Users className="w-4 h-4 text-primary" /> <T>Viajeros</T></label>
                  <Input type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })} min={1} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}><Wallet className="w-4 h-4 text-primary" /> <T>Presupuesto</T></label>
                  <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className={`${inputClass} w-full cursor-pointer appearance-none`}>
                    <option value="" disabled className="text-muted-foreground">{phSelectRange}</option>
                    <option value="Menos de $10,000 MXN" className="font-bold">Menos de $10,000 MXN</option>
                    <option value="$10,000 - $25,000 MXN" className="font-bold">$10,000 - $25,000 MXN</option>
                    <option value="$25,000 - $50,000 MXN" className="font-bold">$25,000 - $50,000 MXN</option>
                    <option value="$50,000 - $100,000 MXN" className="font-bold">$50,000 - $100,000 MXN</option>
                    <option value="Más de $100,000 MXN" className="font-bold">Más de $100,000 MXN</option>
                  </select>
                </div>
                <div className="md:col-span-2 mt-2">
                  <label className={labelClass}><MessageSquare className="w-4 h-4 text-primary" /> <T>Requerimientos Especiales</T></label>
                  <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder={phRequirements} rows={4} className="bg-background border border-border min-h-[120px] font-medium text-foreground focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-5 py-4 resize-none" />
                </div>
              </div>
            </div>

            {/* Contacto Panel */}
            <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-black text-foreground mb-10 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-lg"><User className="w-5 h-5 text-primary" /></div>
                <T>Datos de Contacto</T>
              </h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder={phFirstName} required className={inputClass} />
                <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder={phLastName} className={inputClass} />
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={phEmail} required className={inputClass} />
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={phPhone} required className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8">
              <div className="w-full md:w-auto text-center md:text-left order-2 md:order-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                  <T>¿Ya tienes cotización?</T>
                </p>
                <Link href={`/${locale}/pago-folio`} className="inline-flex items-center text-sm font-bold text-foreground hover:text-primary transition-colors">
                  <T>Ir a Pagar Folio</T> <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full md:w-auto px-12 h-16 rounded-full bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/30 order-1 md:order-2 group">
                {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : null}
                <span>{isSubmitting ? <T>Enviando...</T> : <T>Solicitar Cotización</T>}</span>
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}