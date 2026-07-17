"use client";
import { T } from "@/components/T";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Scale, ChevronRight } from "lucide-react";

interface LegalPageProps {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white relative overflow-hidden">
      <Header />
      
      {/* Resplandor ambiental */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <main className="flex-1 pt-32 lg:pt-40 pb-32 relative z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-[1400px]">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            
            {/* Lado Izquierdo: Título y Navegación (Sticky) */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-10 animate-fade-up">
              
              <div>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 shadow-sm mb-8">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    <T>Legal & Cumplimiento</T>
                  </span>
                </div>
                <h1 className="text-5xl lg:text-[4rem] font-black tracking-tighter text-foreground leading-[0.95]">
                  <T>{title}</T>
                </h1>
              </div>

              {/* Índice de navegación estilo App */}
              <div className="hidden lg:block bg-card/40 backdrop-blur-2xl border border-border/60 rounded-[2.5rem] p-8 shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 border-b border-border/50 pb-4">
                  <T>Índice de Temas</T>
                </p>
                <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                  {sections.map((section, idx) => (
                    <a 
                      key={idx} 
                      href={`#section-${idx}`}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-all text-sm font-bold text-muted-foreground hover:text-foreground"
                    >
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all mt-0.5" />
                      <span className="line-clamp-2 leading-snug group-hover:translate-x-1 transition-transform">
                        <T>{section.heading}</T>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Lado Derecho: Contenido Legal (Lectura Limpia) */}
            <div className="w-full lg:w-2/3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-card/50 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-8 md:p-14 lg:p-20 shadow-2xl">
                <div className="space-y-16">
                  {sections.map((section, index) => (
                    <div key={index} id={`section-${index}`} className="scroll-mt-40 group">
                      
                      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight flex items-start gap-4">
                        <span className="text-primary text-lg mt-1 font-mono opacity-50">{(index + 1).toString().padStart(2, '0')}.</span>
                        <T>{section.heading}</T>
                      </h2>
                      
                      <p className="text-muted-foreground font-medium text-base md:text-lg leading-loose whitespace-pre-line pl-0 md:pl-10">
                        <T>{section.content}</T>
                      </p>
                      
                      {/* Divisor elegante entre secciones, invisible en el último elemento */}
                      {index !== sections.length - 1 && (
                        <div className="w-full h-px bg-border/50 mt-16 ml-0 md:ml-10 relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-px bg-primary/30" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />

      {/* Estilos para el scrollbar interno del índice */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
