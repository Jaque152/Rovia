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
              <li className="flex items-center gap-4"><Phone className="w-5 h-5 text-white/50" /> + 52 1 55 1708 4773</li>
              <li className="flex items-center gap-4"><MapPin className="w-5 h-5 text-white/50" /> AVENIDA COYOACAN 1878, PISO 14 DEP 1405 - A COLONIA DEL VALLE BENITO JUÁREZ C.P. 03100 CIUDAD DE MEXICO</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-background/50">
          <p>© {new Date().getFullYear()} Rovia. <T>Derechos protegidos.</T></p>
          <div className="flex gap-3">
            <span className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-white/80 tracking-wide"><T>Pagos Encriptados y Seguros</T></span>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                <svg className="h-4" viewBox="0 0 780 500" fill="none"><rect width="780" height="500" rx="40" fill="white"/><path fill="#1434CB" d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"/><path fill="#1434CB" d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"/><path fill="#F7B600" d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"/></svg>
              </div>
              <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                <svg className="h-4" viewBox="0 0 152 100" fill="none"><rect width="152" height="100" rx="8" fill="white"/><circle cx="55" cy="50" r="30" fill="#EB001B"/><circle cx="97" cy="50" r="30" fill="#F79E1B"/><path d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z" fill="#FF5F00"/></svg>
              </div>
            </div>
          </div>
          {/* Bottom Bar: Logos de Pago y Copyright */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-background/10">
            
          </div>
        </div>
      </div>
    </footer>
  );
}