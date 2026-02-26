/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Brain, 
  Heart, 
  ShieldCheck, 
  Clock, 
  Video, 
  Smile, 
  ArrowRight, 
  Menu, 
  X,
  Quote
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Form State
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.message.trim()) newErrors.message = "Mensagem é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 1500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Loading Animation Logic
    const hideLoader = () => {
      if (!loaderRef.current) return;
      
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => setIsLoading(false)
      });

      // Start Hero Animation slightly before loader finishes
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(heroRef.current, 
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
      )
      .fromTo(textRef.current?.children || [], 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power3.out" },
        "-=1"
      );
    };

    // Wait for window load or minimum time
    const minTime = new Promise(resolve => setTimeout(resolve, 2000)); // Ensure at least 2s of branding
    const windowLoad = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(true);
      } else {
        window.addEventListener('load', () => resolve(true));
      }
    });

    Promise.all([minTime, windowLoad]).then(() => {
      hideLoader();
    });

    // Scroll Reveal for Sections
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#020604] text-[#ecfdf5] selection:bg-[#34d399] selection:text-black relative">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div 
          ref={loaderRef}
          className="fixed inset-0 z-[100] bg-[#020604] flex flex-col items-center justify-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-2 border-[#34d399]/20 rounded-full absolute inset-0"></div>
            <div className="w-16 h-16 border-t-2 border-[#34d399] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#34d399] rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-6 animate-pulse">
            <img src="https://iili.io/qfW5RAQ.png" alt="Lilian Pereira Logo" className="h-24 w-auto object-contain" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#020604]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <a href="#" className="block">
            <img src="https://iili.io/qfW5RAQ.png" alt="Lilian Pereira" className="h-12 md:h-16 w-auto object-contain" />
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm tracking-widest uppercase opacity-80">
            <a href="#sobre" className="group relative hover:text-[#34d399] transition-colors">
              Sobre
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#34d399] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#especialidades" className="group relative hover:text-[#34d399] transition-colors">
              Especialidades
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#34d399] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#metodo" className="group relative hover:text-[#34d399] transition-colors">
              Método TCC
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#34d399] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="https://wa.me/5531998816133?text=Quero%20agendar%20uma%20consulta!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 border border-[#34d399] text-[#34d399] hover:bg-[#34d399] hover:text-black transition-all duration-300 rounded-full"
            >
              Agendar Consulta
            </a>
          </div>

          {/* Mobile Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#05100a] border-b border-white/10 p-6 flex flex-col space-y-4 text-center">
            <a href="#sobre" onClick={toggleMenu} className="block py-2 hover:text-[#34d399]">Sobre</a>
            <a href="#especialidades" onClick={toggleMenu} className="block py-2 hover:text-[#34d399]">Especialidades</a>
            <a href="#metodo" onClick={toggleMenu} className="block py-2 hover:text-[#34d399]">Método TCC</a>
            <a 
              href="https://wa.me/5531998816133?text=Quero%20agendar%20uma%20consulta!" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={toggleMenu} 
              className="block py-2 text-[#34d399]"
            >
              Agendar Consulta
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div ref={heroRef} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
            alt="Calm Ocean" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020604]/60 via-[#020604]/40 to-[#020604]"></div>
        </div>

        <div ref={textRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center py-12">
          <span className="inline-block py-1 px-3 border border-white/20 rounded-full text-[10px] md:text-xs tracking-[0.2em] uppercase mb-4 md:mb-6 text-[#34d399]">
            Psicologia Clínica Online
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif mb-6 leading-[1.2] md:leading-[1.1] tracking-tight">
            Reencontre seu <br className="hidden sm:block" /> <span className="italic text-[#34d399]">equilíbrio interior</span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 md:mb-10 font-light leading-relaxed">
            Terapia Cognitiva-Comportamental humanizada e diretiva. 
            Assuma o controle da sua história com segurança e acolhimento.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/5531998816133?text=Quero%20agendar%20uma%20consulta!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-[#34d399] text-black rounded-full font-medium tracking-wide overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Iniciar Jornada <ArrowRight size={18} />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
            <a href="#sobre" className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-colors">
              Saiba mais
            </a>
          </div>
        </div>
      </header>

      {/* Authority Banner */}
      <div className="border-y border-white/5 bg-[#05100a]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="flex items-center gap-2 text-sm tracking-widest uppercase"><Video size={16}/> Atendimento Online</span>
            <span className="flex items-center gap-2 text-sm tracking-widest uppercase"><ShieldCheck size={16}/> Sigilo Absoluto</span>
            <span className="flex items-center gap-2 text-sm tracking-widest uppercase"><Clock size={16}/> Horários Flexíveis</span>
            <span className="flex items-center gap-2 text-sm tracking-widest uppercase"><Heart size={16}/> Abordagem Humanizada</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-[#020604] relative overflow-hidden" ref={addToRefs}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#34d399]/30"></div>
            <img 
              src="https://iili.io/qfVBewJ.jpg" 
              alt="Psicóloga Lilian Pereira" 
              className="w-full h-[600px] object-cover object-top rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#34d399]/30"></div>
          </div>

          {/* Text Column */}
          <div className="order-1 lg:order-2">
            <span className="text-[#34d399] tracking-widest uppercase text-sm mb-4 block">Sobre Mim</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Olá, sou <br/> <span className="italic text-[#34d399]">Lilian Pereira</span>
            </h2>
            <h3 className="text-xl text-gray-300 mb-6 font-light">
              Psicóloga, pós-graduada em Saúde Mental e graduanda em Sexualidade Humana.
            </h3>
            
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                Minha paixão é acompanhar mulheres em seus processos de reencontro consigo mesmas, ajudando-as a reconhecer sua própria força, suas necessidades emocionais e sua essência. Acredito profundamente no poder do autoconhecimento como caminho para uma vida mais consciente, leve e alinhada àquilo que cada pessoa verdadeiramente é.
              </p>
              <p>
                Atuo na abordagem da <strong>Terapia Cognitivo-Comportamental (TCC)</strong>, uma metodologia baseada em evidências que permite compreender como pensamentos, emoções e comportamentos se conectam — possibilitando mudanças reais, práticas e transformadoras.
              </p>
              <p>
                Entendo que cada mulher carrega sua própria história, subjetividade e trajetória, e é através dessa singularidade que construo um atendimento:
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full"></span>
                  <span className="text-gray-300">Acolhedor</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full"></span>
                  <span className="text-gray-300">Respeitoso</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full"></span>
                  <span className="text-gray-300">Sem julgamentos</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full"></span>
                  <span className="text-gray-300">Focado em autonomia</span>
                </li>
              </ul>

              <p>
                Meu compromisso é oferecer um espaço seguro, ético e sensível, onde você possa explorar suas vivências, desenvolver clareza sobre quem é e fortalecer seu caminho de reconexão consigo mesma.
              </p>
              
              <p className="text-[#34d399] font-serif italic text-lg border-l-2 border-[#34d399] pl-4 mt-6">
                "Seja bem-vinda. Aqui, sua história tem espaço para florescer."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="py-24 md:py-32 relative" ref={addToRefs}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Áreas de Atuação</h2>
            <div className="w-24 h-1 bg-[#34d399]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Ansiedade */}
            <div className="group p-8 md:p-12 rounded-2xl bg-[#05100a] border border-white/5 hover:border-[#34d399]/30 transition-all duration-500">
              <div className="mb-6 p-4 bg-white/5 rounded-full w-fit group-hover:bg-[#34d399]/10 transition-colors">
                <Brain className="text-[#34d399]" size={32} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Ansiedade</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Imagine ter controle para lidar com seus problemas sem deixar a ansiedade influenciar suas escolhas. 
                Ofereço orientação estruturada e diretiva, com metas definidas por você.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Reprogramação mental</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Técnicas de respiração</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Ressignificação de situações</li>
              </ul>
            </div>

            {/* Card 2: Depressão */}
            <div className="group p-8 md:p-12 rounded-2xl bg-[#05100a] border border-white/5 hover:border-[#34d399]/30 transition-all duration-500">
              <div className="mb-6 p-4 bg-white/5 rounded-full w-fit group-hover:bg-[#34d399]/10 transition-colors">
                <Heart className="text-[#34d399]" size={32} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Depressão</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Não espere chegar ao fundo do poço. Você não precisa passar por essa angústia sozinho(a). 
                Vamos identificar e confrontar pensamentos distorcidos juntos.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Compreensão do desenvolvimento</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Visão realista da realidade</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Prevenção de recaídas</li>
              </ul>
            </div>

            {/* Card 3: Medos e Fobias */}
            <div className="group p-8 md:p-12 rounded-2xl bg-[#05100a] border border-white/5 hover:border-[#34d399]/30 transition-all duration-500">
              <div className="mb-6 p-4 bg-white/5 rounded-full w-fit group-hover:bg-[#34d399]/10 transition-colors">
                <ShieldCheck className="text-[#34d399]" size={32} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Medos e Fobias</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transforme a energia do medo a seu favor. É possível tratar limitações internas e ter uma perspectiva realista para a superação.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Psicoeducação</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Diálogo socrático</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Exposição gradativa</li>
              </ul>
            </div>

            {/* Card 4: TDAH */}
            <div className="group p-8 md:p-12 rounded-2xl bg-[#05100a] border border-white/5 hover:border-[#34d399]/30 transition-all duration-500">
              <div className="mb-6 p-4 bg-white/5 rounded-full w-fit group-hover:bg-[#34d399]/10 transition-colors">
                <Brain className="text-[#34d399]" size={32} />
              </div>
              <h3 className="text-2xl font-serif mb-4">TDAH</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Enfrenta dificuldades com desatenção ou hiperatividade? Compreendemos o transtorno para proporcionar uma vida mais organizada.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Estratégias de autorregulação</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Gerenciamento do tempo</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#34d399] rounded-full"></span>Reestruturação de pensamentos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section (TCC) */}
      <section id="metodo" className="py-24 bg-[#05100a]" ref={addToRefs}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#34d399]/30"></div>
            <img 
              src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop" 
              alt="Terapia" 
              className="w-full h-[600px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#34d399]/30"></div>
          </div>
          
          <div>
            <span className="text-[#34d399] tracking-widest uppercase text-sm mb-4 block">Metodologia</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Terapia Cognitiva <br/> <span className="italic text-gray-500">Comportamental</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-lg">
              A TCC se fundamenta na crença de que o afeto e o comportamento de um indivíduo são em grande parte determinados pelo modo como ele estrutura o mundo em sua mente.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              As cognições do sujeito se baseiam em atitudes ou pressuposições desenvolvidas a partir de vulnerabilidades biológicas e experiências. Minhas técnicas visam identificar e testar reações distorcidas, guiando para a construção de comportamentos mais funcionais.
            </p>
            <a 
              href="https://wa.me/5531998816133?text=Quero%20agendar%20uma%20consulta!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#34d399] hover:text-white transition-colors border-b border-[#34d399] pb-1"
            >
              Agendar uma conversa <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Differentials (Bento Grid) */}
      <section className="py-24 md:py-32" ref={addToRefs}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Por que escolher?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Um espaço seguro, pensado para o seu conforto e evolução pessoal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[200px]">
            {/* Large Item */}
            <div className="md:col-span-2 md:row-span-2 bg-[#05100a] border border-white/5 p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Smile className="text-[#34d399] mb-6" size={40} />
              <h3 className="text-3xl font-serif mb-4">Atendimento Humanizado</h3>
              <p className="text-gray-400 text-lg">
                Cada história é única. O acolhimento é a base de todo o processo terapêutico, 
                criando um vínculo de confiança e respeito mútuo essencial para o progresso.
              </p>
            </div>

            {/* Small Item */}
            <div className="bg-[#05100a] border border-white/5 p-8 rounded-2xl flex flex-col justify-center hover:border-[#34d399]/30 transition-colors">
              <Video className="text-[#34d399] mb-4" size={24} />
              <h3 className="text-xl font-serif mb-2">Comodidade</h3>
              <p className="text-gray-500 text-sm">Terapia no conforto da sua casa, sem deslocamentos.</p>
            </div>

            {/* Small Item */}
            <div className="bg-[#05100a] border border-white/5 p-8 rounded-2xl flex flex-col justify-center hover:border-[#34d399]/30 transition-colors">
              <Clock className="text-[#34d399] mb-4" size={24} />
              <h3 className="text-xl font-serif mb-2">Horários Flexíveis</h3>
              <p className="text-gray-500 text-sm">Agenda adaptável à sua rotina e necessidades.</p>
            </div>

            {/* Medium Item */}
            <div className="md:col-span-2 bg-[#05100a] border border-white/5 p-8 rounded-2xl flex items-center gap-6 hover:border-[#34d399]/30 transition-colors">
              <div className="p-4 bg-white/5 rounded-full">
                <ShieldCheck className="text-[#34d399]" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-2">Segurança e Acessibilidade</h3>
                <p className="text-gray-400">Plataformas seguras e valores acessíveis para democratizar o acesso à saúde mental.</p>
              </div>
            </div>

             {/* Small Item */}
             <div className="bg-[#05100a] border border-white/5 p-8 rounded-2xl flex flex-col justify-center hover:border-[#34d399]/30 transition-colors">
              <Heart className="text-[#34d399] mb-4" size={24} />
              <h3 className="text-xl font-serif mb-2">Acessível</h3>
              <p className="text-gray-500 text-sm">Valores justos para facilitar seu tratamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#05100a] border-t border-white/5" ref={addToRefs}>
        <div className="max-w-7xl mx-auto px-6">
          <Quote className="text-[#34d399] w-12 h-12 mb-10 opacity-50" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
                "A terapia com a Lilian foi um divisor de águas na minha vida. 
                Aprendi a lidar com minha ansiedade de forma prática e acolhedora."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">M.S.</p>
                  <p className="text-sm text-gray-500">Paciente Online</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
                "Profissional excelente. O método TCC é muito assertivo e a Lilian conduz 
                as sessões com muita empatia e clareza."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">R.A.</p>
                  <p className="text-sm text-gray-500">Paciente Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contato-form" className="py-24 bg-[#020604] relative" ref={addToRefs}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Entre em Contato</h2>
            <p className="text-gray-400">
              Envie sua mensagem para agendar uma consulta ou tirar dúvidas.
            </p>
          </div>

          <div className="bg-[#05100a] border border-white/5 rounded-2xl p-8 md:p-12">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#34d399]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-[#34d399]" size={32} />
                </div>
                <h3 className="text-2xl font-serif mb-4">Mensagem Enviada!</h3>
                <p className="text-gray-400">
                  Obrigada pelo contato. Retornarei o mais breve possível.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-8 text-[#34d399] hover:text-white transition-colors"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm text-gray-500 uppercase tracking-wider">Nome</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-[#020604] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#34d399] transition-colors`}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm text-gray-500 uppercase tracking-wider">Telefone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#020604] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#34d399] transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-500 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-[#020604] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#34d399] transition-colors`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm text-gray-500 uppercase tracking-wider">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full bg-[#020604] border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#34d399] transition-colors resize-none`}
                    placeholder="Como posso ajudar?"
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#34d399] text-black font-medium py-4 rounded-lg hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>Enviar Mensagem <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA / Footer */}
      <footer id="contato" className="py-24 relative overflow-hidden" ref={addToRefs}>
        <div className="absolute inset-0 bg-[#34d399]/5"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="mb-10 flex justify-center">
            <img src="https://iili.io/qfW5RAQ.png" alt="Lilian Pereira Logo" className="h-32 w-auto object-contain" />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif mb-8">
            Vamos conversar?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Dê o primeiro passo em direção ao seu bem-estar. 
            Agende sua sessão online e comece sua transformação.
          </p>
          <a 
            href="https://wa.me/5531998816133?text=Quero%20agendar%20uma%20consulta!" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 bg-[#34d399] text-black text-lg font-medium rounded-full hover:bg-white transition-colors duration-300"
          >
            Agendar Consulta Online
          </a>
          
          <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2026 Lilian Pereira. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#34d399]">Instagram</a>
              <a href="#" className="hover:text-[#34d399]">LinkedIn</a>
              <a href="#" className="hover:text-[#34d399]">WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

