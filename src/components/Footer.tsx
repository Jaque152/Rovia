"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { Compass, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleLang = (lang: string) => {
    startTransition(() => router.replace(pathname.replace(`/${locale}`, `/${lang}`) || `/${lang}`));
  };

  return (
    <footer className="bg-foreground text-background pt-24 pb-12 mt-16 rounded-t-[4rem] lg:rounded-t-[6rem] px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                <Compass className="w-7 h-7" />
              </div>
              <span className="text-4xl font-black tracking-tighter">Rovia</span>
            </div>
            <p className="text-background/70 text-base leading-relaxed font-medium">
              <T>Abriendo nuevas fronteras para descubrir México. Experiencias inigualables, ejecución impecable.</T>
            </p>
            <div className="flex bg-background/10 rounded-full p-1.5 w-fit border border-white/5">
              <button onClick={() => handleLang('es')} className={`px-6 py-2 rounded-full text-sm font-black transition-all ${locale === 'es' ? 'bg-white text-foreground shadow-sm' : 'text-background/60 hover:text-white'}`}>ES</button>
              <button onClick={() => handleLang('en')} className={`px-6 py-2 rounded-full text-sm font-black transition-all ${locale === 'en' ? 'bg-white text-foreground shadow-sm' : 'text-background/60 hover:text-white'}`}>EN</button>
            </div>
          </div>

          <div>
            <h4 className="font-black mb-8 text-primary uppercase tracking-widest text-sm"><T>Navegación</T></h4>
            <ul className="space-y-5 text-base font-bold text-background/80">
              <li><Link href={`/${locale}/`} className="hover:text-white hover:translate-x-1 transition-all block"><T>Portada</T></Link></li>
              <li><Link href={`/${locale}/experiencias`} className="hover:text-white hover:translate-x-1 transition-all block"><T>Explora</T></Link></li>
              <li><Link href={`/${locale}/#precios`} className="hover:text-white hover:translate-x-1 transition-all block"><T>Precios</T></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-primary uppercase tracking-widest text-sm"><T>Normativa</T></h4>
            <ul className="space-y-5 text-base font-bold text-background/80">
              <li><Link href={`/${locale}/aviso-de-privacidad`} className="hover:text-white hover:translate-x-1 transition-all block"><T>Aviso de Privacidad</T></Link></li>
              <li><Link href={`/${locale}/terminos-y-condiciones`} className="hover:text-white hover:translate-x-1 transition-all block"><T>Términos y Condiciones</T></Link></li>
              <li><Link href={`/${locale}/politica-de-cancelacion`} className="hover:text-white hover:translate-x-1 transition-all block"><T>Política de Reembolsos, Cancelaciones y Devoluciones</T></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-primary uppercase tracking-widest text-sm"><T>Atención al Cliente</T></h4>
            <ul className="space-y-5 text-base font-bold text-background/80">
              <li className="flex items-center gap-4"><Mail className="w-5 h-5 text-white/50" /> info@rovia.com.mx</li>
              <li className="flex items-center gap-4"><Phone className="w-5 h-5 text-white/50" /> +52 55 5555 5555</li>
              <li className="flex items-center gap-4"><MapPin className="w-5 h-5 text-white/50" /> Ciudad de México, MX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-background/50">
          <p>© {new Date().getFullYear()} Rovia. <T>Derechos protegidos.</T></p>
          <div className="flex gap-3">
            <span className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-white/80 tracking-wide"><T>Pagos Encriptados y Seguros</T></span>
          </div>
        </div>
      </div>
    </footer>
  );
}