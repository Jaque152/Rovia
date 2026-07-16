"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Compass } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: <T>Portada</T> },
  { href: "/experiencias", label: <T>Explora</T> }, 
  { href: "/#contacto", label: <T>Atención</T> },
];

export function Header() {
  const locale = useLocale();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[95%] max-w-4xl bg-background/80 backdrop-blur-2xl border border-border/50 rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
      
      {/* Marca Rovia */}
      <Link href={`/${locale}/`} className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg shadow-primary/30">
          <Compass className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-foreground">Rovia</span>
      </Link>

      {/* Navegación Desktop */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const href = link.href.startsWith("/#") ? `/${locale}${link.href.replace('/#', '#')}` : `/${locale}${link.href}`;
          return (
            <Link key={link.href} href={href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Controles: Carrito + Menú Mobile */}
      <div className="flex items-center gap-3">
        <div className="relative" onMouseEnter={() => setShowMiniCart(true)} onMouseLeave={() => setShowMiniCart(false)}>
          <Link href={`/${locale}/carrito`} className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 hover:bg-primary hover:text-white transition-all text-foreground relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-black border-2 border-background shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mini Cart Popover */}
          {showMiniCart && (
            <div className="absolute right-0 top-full mt-4 w-[340px] bg-background/95 backdrop-blur-3xl rounded-[2rem] overflow-hidden z-50 border border-border shadow-2xl">
              <div className="p-6 border-b border-border/40"><h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground"><T>Bolsa de Viaje</T></h3></div>
              {cart.items.length === 0 ? (
                <div className="p-10 text-center text-sm font-medium text-muted-foreground flex flex-col items-center gap-4"><ShoppingCart className="w-10 h-10 opacity-20" /><T>Tu lista está vacía</T></div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                    {cart.items.slice(0, 3).map((item) => (
                      <div key={`${item.packageId}-${item.date}`} className="p-3 bg-card rounded-2xl border border-border/50">
                        <div className="flex gap-4 items-center">
                          <img src={item.experience.images?.[0] || '/placeholder.jpg'} className="w-16 h-16 rounded-[1rem] object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate"><T>{item.experience.title}</T></h4>
                            <p className="text-xs font-medium text-muted-foreground mt-1">{item.people}p • <T>{item.levelName}</T></p>
                            <p className="text-sm font-black text-primary mt-1">{formatPrice(item.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-card/50 border-t border-border/40">
                    <Link href={`/${locale}/carrito`} className="block w-full py-4 bg-foreground text-background hover:bg-primary transition-all text-center rounded-2xl text-sm font-bold shadow-lg"><T>Ir al Pago</T></Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-foreground text-background hover:bg-primary transition-all shadow-md">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="rounded-l-[3rem] border-l-0 bg-background/95 backdrop-blur-3xl">
            <SheetTitle className="sr-only"><T>Opciones de Rovia</T></SheetTitle>
            <div className="flex flex-col gap-10 mt-24 px-6">
              {navLinks.map((link) => {
                const href = link.href.startsWith("/#") ? `/${locale}${link.href.replace('/#', '#')}` : `/${locale}${link.href}`;
                return <Link key={link.href} href={href} className="text-5xl font-black text-foreground hover:text-primary transition-colors tracking-tighter">{link.label}</Link>;
              })}
            </div>
            <div className="absolute bottom-12 left-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3"><T>Conecta con Rovia</T></p>
              <a href="mailto:info@rovia.com.mx" className="block text-xl font-bold text-foreground hover:opacity-70 transition-opacity">info@rovia.com.mx</a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}