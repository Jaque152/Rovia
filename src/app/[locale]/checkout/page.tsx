"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2, User, FileText, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const finalTotal = cart.total;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  
  const [billingInfo, setBillingInfo] = useState({ 
    pais: "", direccion: "", localidad: "", estado: "", codigo_postal: ""
  });

  const [addNotes, setAddNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const locale = useLocale();

  useEffect(() => {
    const savedData = sessionStorage.getItem("rovia_temp_contact");
    if (savedData) {
      const { nombre, email, folio } = JSON.parse(savedData);
      setContactInfo(prev => ({ ...prev, firstName: nombre, email: email }));
      setOrderNotes(`Pago referente al Folio: ${folio}`);
      setAddNotes(true);
      sessionStorage.removeItem("rovia_temp_contact"); 
    }
  }, []);

  // TRADUCCIONES INTACTAS
  const phNombre = useT("Nombre ");
  const phApellidos = useT("Apellidos");
  const phEmail = useT("Email ");
  const phTelefono = useT("Teléfono ");
  const phPais = useT("País / Región ");
  const phDireccion = useT("Dirección completa (Calle y número) ");
  const phLocalidad = useT("Localidad / Ciudad ");
  const phEstado = useT("Región / Estado ");
  const phCP = useT("Código Postal ");
  const phTarjeta = useT("Número de tarjeta ");
  const phNombreTarjeta = useT("Nombre en la tarjeta ");
  const phFecha = useT("MM/AA ");
  const phCvv = useT("CVV ");
  const textProcesando = useT("Procesando pago...");
  const textPagar = useT("Pagar");
  const phNotas = useT("Ej: Alergias alimentarias, etc.");

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Limpiamos los espacios del número de tarjeta antes de enviar a la API
      const cleanCardInfo = { ...cardInfo, number: cardInfo.number.replace(/\s/g, '') };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, contactInfo, billingInfo, orderNotes: addNotes ? orderNotes : null, cart, cardInfo: cleanCardInfo, formattedTotal: formatPrice(finalTotal), manualFolioData:null })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Error procesando el pago");
      setShowSuccess(true);
      clearCart();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al procesar el pago: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = 
    contactInfo.firstName && contactInfo.email && contactInfo.phone &&
    billingInfo.pais && billingInfo.direccion && billingInfo.localidad && billingInfo.estado && billingInfo.codigo_postal &&
    cardInfo.number.replace(/\s/g, '').length >= 15 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3 &&
    cart.items.length > 0;

  // FORMATEO: Agregar espacio cada 4 dígitos
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Solo números
    const formattedVal = val.match(/.{1,4}/g)?.join(' ') || val; // Agrupar en bloques de 4
    setCardInfo({ ...cardInfo, number: formattedVal });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  // Clases compactas y elegantes
  const inputClass = "h-12 bg-card border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-xl px-4 font-medium text-foreground placeholder:text-muted-foreground/60 shadow-sm transition-all";

  if (showSuccess) {
    return (
      <main className="flex-1 pt-32 pb-24 flex items-center justify-center px-4 bg-background">
        <div className="max-w-md w-full text-center bg-card rounded-2xl p-10 shadow-xl border border-border">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4 text-foreground"><T>¡Pago Exitoso!</T></h1>
          <p className="text-muted-foreground font-medium mb-8"><T>Tu transacción ha sido confirmada. Los detalles se han enviado a tu correo.</T></p>
          <Button asChild className="w-full bg-primary hover:bg-foreground text-white font-bold rounded-xl h-12 transition-all shadow-md">
            <Link href={`/${locale}/`}><T>Volver al Inicio</T></Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground"><T>Finalizar Compra</T></h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Formularios */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Panel Contacto */}
            <div className="bg-card p-6 md:p-8 border border-border shadow-sm rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground border-b border-border/50 pb-4">
                <User className="text-primary w-5 h-5"/>
                <T>Datos de Contacto</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Nombre</T></label>
                  <Input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder={phNombre} required className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Apellidos</T></label>
                  <Input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder={phApellidos} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Correo Electrónico</T></label>
                  <Input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder={phEmail} required className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Teléfono</T></label>
                  <Input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder={phTelefono} required className={inputClass} />
                </div>
              </div>
            </div>
              
            {/* Panel Facturación */}
            <div className="bg-card p-6 md:p-8 border border-border shadow-sm rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground border-b border-border/50 pb-4">
                <FileText className="text-primary w-5 h-5"/>
                <T>Dirección de Facturación</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>País / Región</T></label>
                  <Input placeholder={phPais} required value={billingInfo.pais} onChange={(e)=>setBillingInfo({...billingInfo, pais:e.target.value})} className={inputClass} />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Dirección Completa</T></label>
                  <Input placeholder={phDireccion} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Ciudad / Localidad</T></label>
                  <Input placeholder={phLocalidad} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Estado / Región</T></label>
                  <Input placeholder={phEstado} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1"><T>Código Postal</T></label>
                  <Input placeholder={phCP} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <label className="flex items-center gap-3 cursor-pointer text-foreground font-semibold text-sm select-none">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={addNotes} onChange={(e)=>setAddNotes(e.target.checked)} className="peer w-5 h-5 cursor-pointer appearance-none rounded border-2 border-border checked:border-primary checked:bg-primary transition-all" />
                    <CheckCircle className="absolute w-3 h-3 text-white left-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <T>Añadir indicaciones especiales al viaje</T>
                </label>
                
                {addNotes && (
                  <div className="mt-4">
                    <Textarea 
                      placeholder={phNotas} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                      className="bg-background border-border min-h-[100px] text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary rounded-xl px-4 py-3 resize-none shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Panel Pago (Oscuro y Nítido) */}
            <div className="bg-zinc-950 p-6 md:p-8 shadow-xl rounded-2xl relative overflow-hidden border border-zinc-800">
              <div className="relative z-10">
                
                {/* Cabecera Pago + Octano Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-white tracking-tight">
                    <CreditCard className="text-primary w-5 h-5" />
                    <T>Pago Seguro</T>
                  </h2>
                  <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center shadow-inner h-12 w-fit">
                     <img src="/logo-octano-2.png" alt="OctanoPayments" className="h-full object-contain" />
                  </div>
                </div>
                  
                {/* Inputs de Tarjeta */}
                <div className="grid gap-4 max-w-lg">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary"><T>Número de Tarjeta</T></label>
                    <Input 
                      placeholder="0000 0000 0000 0000" 
                      required 
                      maxLength={19} 
                      value={cardInfo.number} 
                      onChange={handleCardNumberChange} 
                      className="bg-white/5 border-white/10 h-12 font-mono text-base tracking-widest focus-visible:ring-primary rounded-xl px-4 text-white placeholder:text-white/30" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary"><T>Nombre en la tarjeta</T></label>
                    <Input 
                      placeholder={phNombreTarjeta} 
                      required 
                      value={cardInfo.name} 
                      onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} 
                      className="bg-white/5 border-white/10 h-12 font-medium text-base focus-visible:ring-primary rounded-xl px-4 text-white placeholder:text-white/30" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary"><T>Expiración</T></label>
                      <Input 
                        placeholder={phFecha} 
                        required 
                        maxLength={5} 
                        value={cardInfo.expiry} 
                        onChange={handleExpiryChange} 
                        className="bg-white/5 border-white/10 h-12 font-medium text-base focus-visible:ring-primary rounded-xl px-4 text-white placeholder:text-white/30" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary"><T>Código (CVV)</T></label>
                      <Input 
                        placeholder={phCvv} 
                        type="password" 
                        required 
                        maxLength={4} 
                        value={cardInfo.cvv} 
                        onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} 
                        className="bg-white/5 border-white/10 h-12 font-mono text-base tracking-widest focus-visible:ring-primary rounded-xl px-4 text-white placeholder:text-white/30" 
                      />
                    </div>
                  </div>
                  
                  {/* Badge Seguridad Ligero */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-xs font-medium text-white/50 leading-snug">
                      <T>Procesado por OctanoPayments. Conexión cifrada de 256 bits.</T>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          {/* Columna Derecha: Resumen Sticky */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-card p-6 md:p-8 lg:sticky lg:top-32 border border-border shadow-md rounded-2xl">
              <h2 className="text-xl font-bold mb-6 text-foreground border-b border-border/50 pb-4 tracking-tight"><T>Resumen de Compra</T></h2>
              
              <div className="space-y-4 mb-8">
                {cart.items.length === 0 ? (
                  <p className="text-muted-foreground font-medium text-sm"><T>Tu carrito está vacío.</T></p>
                ) : (
                  cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                      <div>
                        <span className="text-foreground font-bold text-sm block mb-1">
                          <T>{item.experience.title}</T>
                        </span>
                        <span className="text-muted-foreground text-xs">
                          x{item.people} <T>Viajeros</T>
                        </span>
                      </div>
                      <span className="font-bold text-sm text-foreground whitespace-nowrap">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-background rounded-xl p-5 border border-border/50 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground font-bold text-xs"><T>Subtotal</T></span>
                  <span className="font-semibold text-sm text-foreground">{formatPrice(finalTotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground font-bold text-xs"><T>Impuestos</T></span>
                  <span className="font-semibold text-sm text-foreground">Incluidos</span>
                </div>
                <div className="flex justify-between items-end border-t border-border/50 pt-4">
                  <span className="text-foreground font-bold text-sm uppercase tracking-wider"><T>Total General</T></span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary tracking-tight">{formatPrice(finalTotal)}</div>
                  </div>
                </div>
              </div>
                
              <Button 
                type="submit" 
                disabled={!isFormValid || isProcessing} 
                className="w-full bg-primary hover:bg-foreground text-white font-bold h-14 rounded-xl shadow-md hover:shadow-lg transition-all text-base group disabled:opacity-50 disabled:shadow-none"
              >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {isProcessing ? textProcesando : <T>Completar Reserva</T>}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Header />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}