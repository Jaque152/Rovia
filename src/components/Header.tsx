"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Compass } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: <T>Inicio</T> },
  { href: "/experiencias", label: <T>Experiencias</T> }, 
  { href: "/#contacto", label: <T>Contacto</T> },
];

export function Header() {
  const locale = useLocale();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  // Smart scroll: Oculta los botones suavemente al bajar, los muestra al subir
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <>
      {/* Esquina Superior Izquierda: Logo Flotante */}
      <div className={`fixed top-6 left-6 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        <Link href={`/${locale}/`} className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:scale-110 transition-transform duration-300">
          <Compass className="w-8 h-8" />
        </Link>
      </div>

      {/* Esquina Superior Derecha: Botonera Flotante (Cart + Menu) */}
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        
        {/* Hover Dropdown: Carrito */}
        <div className="relative" onMouseEnter={() => setShowMiniCart(true)} onMouseLeave={() => setShowMiniCart(false)}>
          <Link href={`/${locale}/carrito`} className="flex items-center justify-center w-14 h-14 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-lg hover:border-primary transition-all relative">
            <ShoppingCart className="w-6 h-6 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-secondary text-foreground text-[11px] rounded-full flex items-center justify-center font-black shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mini Cart Popover */}
          {showMiniCart && (
            <div className="absolute right-0 top-full mt-4 w-80 glass-panel rounded-3xl overflow-hidden z-50 border border-border shadow-2xl">
              <div className="p-5 border-b border-border/30 bg-card/90">
                <h3 className="font-bold text-sm tracking-tight"><T>Tu Itinerario</T></h3>
              </div>
              {cart.items.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-muted-foreground flex flex-col items-center gap-3 bg-card/50">
                  <ShoppingCart className="w-8 h-8 opacity-20" />
                  <T>Aún no hay aventuras</T>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto p-3 bg-card/50">
                    {cart.items.slice(0, 3).map((item) => {
                      const miniImage = item.experience.images && item.experience.images.length > 0 ? item.experience.images[0] : '/placeholder.jpg';
                      return (
                        <div key={`${item.packageId}-${item.date}`} className="p-3 mb-2 bg-background rounded-2xl border border-border hover:border-primary/50 transition-colors">
                          <div className="flex gap-4 items-center">
                            <img src={miniImage} className="w-14 h-14 rounded-xl object-cover" alt={item.experience.title} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold truncate"><T>{item.experience.title}</T></h4>
                              <p className="text-xs font-medium text-muted-foreground mb-1">{item.people}p • <T>{item.levelName}</T></p>
                              <p className="text-sm font-black text-primary">{formatPrice(item.totalPrice)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-background">
                    <Link href={`/${locale}/carrito`} className="block w-full py-3 bg-foreground text-background hover:bg-primary transition-colors text-center rounded-xl text-sm font-bold shadow-lg">
                      <T>Ver Resumen</T>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sheet: Menú Desplegable */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-background shadow-lg hover:scale-105 hover:bg-primary hover:text-white transition-all">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="rounded-l-[2rem] border-l-0 bg-background/95 backdrop-blur-2xl">
            <SheetTitle className="sr-only"><T>Menú de navegación</T></SheetTitle>
            <div className="flex flex-col gap-10 mt-24 px-6">
              {navLinks.map((link) => {
                // Validación para construir correctamente los enlaces con anclas
                const href = link.href.startsWith("/#") 
                  ? `/${locale}${link.href.replace('/#', '#')}` 
                  : `/${locale}${link.href}`;

                return (
                  <Link 
                    key={link.href} 
                    href={href} 
                    className="text-5xl font-black text-foreground hover:text-primary transition-colors tracking-tighter"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            {/* Info extra dentro del menú */}
            <div className="absolute bottom-12 left-10 right-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4"><T>Contacto Rápido</T></p>
              <a href="mailto:soporte@tripnova.com" className="block text-lg font-bold text-foreground hover:text-primary mb-2">soporte@tripnova.com</a>
              <p className="text-sm font-medium text-muted-foreground">Ciudad de México, MX</p>
            </div>
          </SheetContent>
        </Sheet>
        
      </div>
    </>
  );
}