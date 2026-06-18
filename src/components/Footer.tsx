"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { Compass, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleLang = (lang: string) => {
    startTransition(() => router.replace(pathname.replace(`/${locale}`, `/${lang}`) || `/${lang}`));
  };

  return (
    <footer className="bg-foreground text-background pt-20 pb-10 mt-12 rounded-t-[2.5rem] lg:rounded-t-[4rem] px-4 lg:px-8">
      <div className="container mx-auto">

        {/* Grid de Contenido Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">Tripnova</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed font-medium">
              <T>Trazando el nuevo horizonte de la exploración en México. Rutas únicas, logística perfecta.</T>
            </p>
            <div className="flex bg-background/10 rounded-full p-1 w-fit">
              <button onClick={() => handleLang('es')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${locale === 'es' ? 'bg-white text-foreground' : 'text-background/60 hover:text-white'}`}>ES</button>
              <button onClick={() => handleLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${locale === 'en' ? 'bg-white text-foreground' : 'text-background/60 hover:text-white'}`}>EN</button>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs"><T>Explorar</T></h4>
            <ul className="space-y-4 text-sm font-medium text-background/60">
              <li><Link href={`/${locale}/`} className="hover:text-primary transition-colors"><T>Inicio</T></Link></li>
              <li><Link href={`/${locale}/experiencias`} className="hover:text-primary transition-colors"><T>Experiencias</T></Link></li>
              <li><Link href={`/${locale}/#precios`} className="hover:text-primary transition-colors"><T>Precios</T></Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs"><T>Legal</T></h4>
            <ul className="space-y-4 text-sm font-medium text-background/60">
              <li><Link href={`/${locale}/aviso-de-privacidad`} className="hover:text-primary transition-colors"><T>Aviso de Privacidad</T></Link></li>
              <li><Link href={`/${locale}/terminos-y-condiciones`} className="hover:text-primary transition-colors"><T>Términos y Condiciones</T></Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs"><T>Soporte</T></h4>
            <ul className="space-y-4 text-sm font-medium text-background/60">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> soporte@tripnova.com</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +52 55 5555 5555</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> Ciudad de México, MX</li>
            </ul>
          </div>

        </div>

        {/* Separador y Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-background/40">
          <p>© {new Date().getFullYear()} Tripnova. <T>Todos los derechos reservados.</T></p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-background/10 rounded-md">Transacciones 100% Seguras</span>
          </div>
        </div>

      </div>
    </footer>
  );
}