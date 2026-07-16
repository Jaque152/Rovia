"use client";
import { T } from "@/components/T";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalPageProps {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-48 pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          
          <div className="flex flex-col lg:flex-row gap-20">
            
            <div className="w-full lg:w-1/3 lg:sticky lg:top-48 h-fit">
              <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-foreground leading-[0.95]">
                <T>{title}</T>
              </h1>
              <div className="hidden lg:block bg-card border border-border/50 rounded-[2rem] p-8 shadow-xl">
                <p className="text-sm font-black uppercase tracking-widest text-primary mb-6"><T>Índice de Temas</T></p>
                <div className="space-y-4">
                  {sections.map((section, idx) => (
                    <p key={idx} className="text-base font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors line-clamp-2 leading-snug">
                      <T>{section.heading}</T>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-card border border-border/50 rounded-[3rem] p-10 md:p-16 shadow-lg">
              <div className="space-y-20">
                {sections.map((section, index) => (
                  <div key={index} className="scroll-mt-48">
                    <h2 className="text-3xl font-black text-foreground mb-6 tracking-tight">
                      <T>{section.heading}</T>
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg md:text-xl leading-loose whitespace-pre-line">
                      <T>{section.content}</T>
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}