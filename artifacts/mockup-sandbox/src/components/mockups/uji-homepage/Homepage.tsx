import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Leaf, Globe, ShieldCheck, Sparkles } from "lucide-react";

export function Homepage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-['Inter'] bg-[#F2EADB] text-[#1C201B] selection:bg-[#78933C] selection:text-[#F2EADB] overflow-x-hidden min-h-screen">
      
      {/* 1. HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-[#F2EADB]/90 backdrop-blur-md border-[#C8BBA4]/20 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="flex flex-col gap-[5px] w-6">
              <span className={`block h-[1px] w-full transition-colors ${isScrolled ? "bg-[#16281D]" : "bg-[#F2EADB]"}`}></span>
              <span className={`block h-[1px] w-full transition-colors ${isScrolled ? "bg-[#16281D]" : "bg-[#F2EADB]"}`}></span>
            </div>
            <span className={`text-xs uppercase tracking-[0.2em] hidden md:block transition-colors ${isScrolled ? "text-[#16281D]" : "text-[#F2EADB]"}`}>Menu</span>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <img 
              src={isScrolled ? "/__mockup/images/brand/uji-logo-forest-green.png" : "/__mockup/images/brand/uji-logo-white.png"} 
              alt="UJI MATCHA" 
              className="h-8 md:h-12 lg:h-[80px] object-contain transition-opacity duration-300"
            />
          </div>

          <div className={`flex items-center gap-6 md:gap-8 text-xs uppercase tracking-[0.15em] transition-colors ${isScrolled ? "text-[#16281D]" : "text-[#F2EADB]"}`}>
            <div className="hidden lg:flex items-center gap-8">
              <a href="#shop" className="hover:opacity-70 transition-opacity">Shop</a>
              <a href="#story" className="hover:opacity-70 transition-opacity">Our Story</a>
              <a href="#ritual" className="hover:opacity-70 transition-opacity">Ritual</a>
              <a href="#journal" className="hover:opacity-70 transition-opacity">Journal</a>
              <span className="opacity-40">|</span>
              <a href="#lang" className="hover:opacity-70 transition-opacity">AR/EN</a>
            </div>
            <div className="flex items-center gap-5">
              <button className="hover:opacity-70 transition-opacity"><Search size={18} strokeWidth={1.5} /></button>
              <button className="hover:opacity-70 transition-opacity relative">
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className={`absolute -top-2 -right-2 text-[9px] w-4 h-4 flex items-center justify-center rounded-full ${isScrolled ? "bg-[#1F3929] text-[#F2EADB]" : "bg-[#F2EADB] text-[#1F3929]"}`}>2</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/__mockup/images/hero/uji-hero-tin-powder-explosion.png" 
            alt="UJI Matcha Tin Explosion" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col md:w-[60%] lg:w-[50%] pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <span className="text-[#9BA17B] text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium">Ceremonial Japanese Matcha</span>
            <h1 className="font-['Cormorant_Garamond'] text-[#F2EADB] text-5xl md:text-7xl lg:text-[80px] font-light leading-[1.1] tracking-wide">
              Experience Japanese<br/>Matcha Like Never Before
            </h1>
            <p className="text-[#F2EADB] text-base md:text-lg font-light max-w-md leading-relaxed opacity-90">
              Pure ceremonial-grade matcha, crafted in Uji and designed for your daily ritual.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-[#1F3929] text-[#F2EADB] px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-[#16281D] transition-colors border border-[#1F3929]">
                Discover UJI
              </button>
              <button className="bg-transparent text-[#F2EADB] px-8 py-4 text-xs uppercase tracking-[0.15em] border border-[#F2EADB] hover:bg-[#F2EADB] hover:text-[#1F3929] transition-colors">
                Shop Matcha
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
          <span className="text-[#F2EADB] text-[9px] uppercase tracking-[0.2em] opacity-70">01 — Scroll to discover</span>
          <motion.div 
            animate={{ height: ["0px", "40px", "0px"], opacity: [0, 1, 0], top: ["0%", "50%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] bg-[#F2EADB] relative h-10 overflow-hidden"
          >
            <div className="w-full bg-white absolute left-0" />
          </motion.div>
        </div>
      </section>

      {/* 3. TRANSITIONAL / TAGLINE */}
      <section className="py-[140px] px-6 bg-[#F2EADB] flex flex-col items-center text-center relative border-b border-[#C8BBA4]/20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#16281D] font-light max-w-3xl leading-snug"
        >
          A ritual refined over centuries.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 text-[#9BA17B] text-sm md:text-base tracking-wide"
        >
          From the tea fields of Uji to your daily cup.
        </motion.p>
      </section>

      {/* 4. PRODUCT 360° SECTION */}
      <section className="py-[160px] bg-[#F7F2E8] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <span className="text-[#9BA17B] text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4">
              02 <span className="h-[1px] w-8 bg-[#C8BBA4]"></span> The Tin
            </span>
          </div>

          <div className="relative flex items-center justify-center min-h-[600px] lg:min-h-[800px]">
            {/* Background elements */}
            <div className="absolute w-[40vw] h-[40vw] rounded-full bg-[#F2EADB] blur-3xl opacity-50 -z-10"></div>
            
            {/* Annotation Left */}
            <div className="absolute left-0 lg:left-[10%] top-1/4 hidden md:flex flex-col gap-2 z-20">
              <div className="flex items-center gap-4">
                <span className="font-['Inter'] text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">Ceremonial Grade</span>
                <div className="w-16 h-[1px] bg-[#C8BBA4]/50"></div>
              </div>
            </div>
            
            <div className="absolute left-0 lg:left-[5%] bottom-1/3 hidden md:flex flex-col gap-2 z-20">
              <div className="flex items-center gap-4">
                <span className="font-['Inter'] text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">Stone Ground</span>
                <div className="w-20 h-[1px] bg-[#C8BBA4]/50"></div>
              </div>
            </div>

            {/* Product Images (staggered to imply rotation) */}
            <div className="relative w-full max-w-3xl h-[600px] flex items-center justify-center">
              <motion.img 
                initial={{ opacity: 0, x: -60, rotate: -5 }}
                whileInView={{ opacity: 0.6, x: -180, rotate: -8, scale: 0.85 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src="/__mockup/images/packaging/uji-tin-side.png" 
                alt="UJI Tin Side" 
                className="absolute w-56 md:w-80 object-contain blur-[1px] z-0"
              />
              
              <motion.img 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                src="/__mockup/images/packaging/uji-tin-front.png" 
                alt="UJI Tin Front" 
                className="absolute w-64 md:w-96 object-contain z-10 drop-shadow-2xl"
              />
              
              <motion.img 
                initial={{ opacity: 0, x: 60, rotate: 5 }}
                whileInView={{ opacity: 0.6, x: 180, rotate: 8, scale: 0.85 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src="/__mockup/images/packaging/uji-tin-front-alt.png" 
                alt="UJI Tin Angled" 
                className="absolute w-56 md:w-80 object-contain blur-[1px] z-0"
              />
            </div>

            {/* Annotation Right */}
            <div className="absolute right-0 lg:right-[10%] top-1/3 hidden md:flex flex-col items-end gap-2 z-20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-[1px] bg-[#C8BBA4]/50"></div>
                <span className="font-['Inter'] text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">Shade Grown</span>
              </div>
            </div>
            
            <div className="absolute right-0 lg:right-[5%] bottom-1/4 hidden md:flex flex-col items-end gap-2 z-20">
              <div className="flex items-center gap-4">
                <div className="w-20 h-[1px] bg-[#C8BBA4]/50"></div>
                <span className="font-['Inter'] text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">Single Origin</span>
              </div>
            </div>
            
            <div className="absolute right-1/4 lg:right-[20%] top-10 hidden md:flex flex-col items-end gap-2 z-20">
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#C8BBA4]/50"></div>
                <span className="font-['Inter'] text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">30g Pure Matcha</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY UJI */}
      <section className="py-[160px] bg-[#16281D] text-[#F2EADB]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-[#9BA17B] text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 mb-8">
              03 <span className="h-[1px] w-8 bg-[#4C5734]"></span> Why UJI
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[#F2EADB]">
              Not all matcha is<br/>created equal.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2a3f2f] border border-[#2a3f2f]">
            <div className="bg-[#1F3929] p-12 md:p-16 flex flex-col gap-6 group hover:bg-[#254431] transition-colors">
              <Sparkles className="text-[#9BA17B] w-8 h-8 stroke-[1.5]" />
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-3xl mb-4 text-[#F2EADB]">Ceremonial Grade</h3>
                <p className="text-[#9BA17B] text-sm md:text-base leading-relaxed font-light">Highest-grade matcha with a naturally smooth, umami-rich taste, perfect for traditional preparation without bitterness.</p>
              </div>
            </div>
            
            <div className="bg-[#1F3929] p-12 md:p-16 flex flex-col gap-6 group hover:bg-[#254431] transition-colors">
              <Globe className="text-[#9BA17B] w-8 h-8 stroke-[1.5]" />
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-3xl mb-4 text-[#F2EADB]">Sourced from Uji</h3>
                <p className="text-[#9BA17B] text-sm md:text-base leading-relaxed font-light">Originating from Kyoto's most celebrated tea region, where soil and climate combine for the world's finest tea leaves.</p>
              </div>
            </div>
            
            <div className="bg-[#1F3929] p-12 md:p-16 flex flex-col gap-6 group hover:bg-[#254431] transition-colors">
              <ShieldCheck className="text-[#9BA17B] w-8 h-8 stroke-[1.5]" />
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-3xl mb-4 text-[#F2EADB]">Stone Ground</h3>
                <p className="text-[#9BA17B] text-sm md:text-base leading-relaxed font-light">Slowly ground on traditional granite mills to preserve its vibrant green color, delicate aroma, and potent nutrients.</p>
              </div>
            </div>
            
            <div className="bg-[#1F3929] p-12 md:p-16 flex flex-col gap-6 group hover:bg-[#254431] transition-colors">
              <Leaf className="text-[#9BA17B] w-8 h-8 stroke-[1.5]" />
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-3xl mb-4 text-[#F2EADB]">Pure Matcha</h3>
                <p className="text-[#9BA17B] text-sm md:text-base leading-relaxed font-light">No sugar, additives, artificial colors or fillers. Just pure, unadulterated shade-grown green tea leaves.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE COLLECTION */}
      <section className="py-[160px] bg-[#F2EADB]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-24 flex flex-col items-center">
            <span className="text-[#9BA17B] text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 mb-6">
              <span className="h-[1px] w-8 bg-[#C8BBA4]"></span> 04 — The Collection <span className="h-[1px] w-8 bg-[#C8BBA4]"></span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[#16281D] mb-6">
              The UJI Collection
            </h2>
            <p className="text-[#4C5734] text-base">Everything you need to begin your matcha ritual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="relative bg-[#F7F2E8] aspect-[4/5] flex items-center justify-center p-8 mb-6 overflow-hidden border border-[#C8BBA4]/10">
                <img src="/__mockup/images/packaging/uji-tin-front.png" alt="Ceremonial Matcha Tin" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <button className="w-full bg-[#1F3929] text-[#F2EADB] h-12 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#16281D]">Add to Cart</button>
                </div>
              </div>
              <div className="flex justify-between items-start border-t border-[#C8BBA4]/30 pt-6">
                <div>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#16281D] mb-2">Ceremonial Matcha Tin</h3>
                  <p className="text-[#9BA17B] text-sm">30g / 30 servings</p>
                </div>
                <span className="text-[#16281D] text-sm font-medium mt-1">SAR 89</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="relative bg-[#F7F2E8] aspect-[4/5] flex items-center justify-center p-8 mb-6 overflow-hidden border border-[#C8BBA4]/10">
                <img src="/__mockup/images/uji-product-bamboo-whisk.png" alt="Bamboo Whisk" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <button className="w-full bg-[#1F3929] text-[#F2EADB] h-12 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#16281D]">Add to Cart</button>
                </div>
              </div>
              <div className="flex justify-between items-start border-t border-[#C8BBA4]/30 pt-6">
                <div>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#16281D] mb-2">Bamboo Whisk</h3>
                  <p className="text-[#9BA17B] text-sm">Chasen / 100 prongs</p>
                </div>
                <span className="text-[#16281D] text-sm font-medium mt-1">SAR 45</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="relative bg-[#F7F2E8] aspect-[4/5] flex items-center justify-center p-8 mb-6 overflow-hidden border border-[#C8BBA4]/10">
                <img src="/__mockup/images/packaging/uji-tin-front-alt.png" alt="Matcha Starter Set" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <button className="w-full bg-[#1F3929] text-[#F2EADB] h-12 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#16281D]">Add to Cart</button>
                </div>
              </div>
              <div className="flex justify-between items-start border-t border-[#C8BBA4]/30 pt-6">
                <div>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#16281D] mb-2">Matcha Starter Set</h3>
                  <p className="text-[#9BA17B] text-sm">Tin + Whisk + Scoop</p>
                </div>
                <span className="text-[#16281D] text-sm font-medium mt-1">SAR 149</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIFESTYLE EDITORIAL */}
      <section className="py-[160px] bg-[#F7F2E8] border-t border-[#C8BBA4]/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-24">
            <span className="text-[#9BA17B] text-[10px] uppercase tracking-[0.3em] flex items-center gap-4">
              05 <span className="h-[1px] w-8 bg-[#C8BBA4]"></span> The Ritual
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Left Image */}
            <div className="md:col-span-7 h-[600px] md:h-[900px] relative">
              <img 
                src="/__mockup/images/lifestyle/uji-lifestyle-hijabi-bag.png" 
                alt="UJI Lifestyle" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Right Content */}
            <div className="md:col-span-5 flex flex-col gap-16">
              <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-[#4C5734] font-light leading-[1.1]">
                "Slow down.<br/>Savor matcha."
              </h2>
              
              <div className="h-[500px] md:h-[650px] relative md:-ml-24 mt-4 z-10 shadow-2xl">
                <img 
                  src="/__mockup/images/lifestyle/uji-lifestyle-car-window-01.png" 
                  alt="UJI Matcha To Go" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-[1px] bg-[#9BA17B]"></div>
                <p className="font-['Inter'] text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">Made for your daily ritual.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-[160px] bg-[#F2EADB] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none mix-blend-multiply">
          <img src="/__mockup/images/brand/uji-brand-identity-bowl.png" alt="texture" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-2xl">
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-[#16281D] font-light mb-8">A slower inbox.</h2>
          <p className="text-[#4C5734] text-base mb-12">Matcha rituals, journal notes and exclusive releases.</p>
          
          <form className="w-full flex flex-col sm:flex-row gap-4 sm:gap-0" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-grow bg-transparent border-b border-[#C8BBA4] py-4 px-4 text-[#16281D] placeholder:text-[#9BA17B] focus:outline-none focus:border-[#16281D] transition-colors rounded-none"
              required
            />
            <button type="submit" className="bg-[#1F3929] text-[#F2EADB] px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-[#16281D] transition-colors sm:-ml-[1px]">
              Join the Journal
            </button>
          </form>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#16281D] text-[#F2EADB] pt-[120px] pb-12 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between mb-24 gap-16 lg:gap-8">
            <div className="max-w-xs">
              <img src="/__mockup/images/brand/uji-logo-forest-green.png" alt="UJI MATCHA" className="h-10 object-contain mb-8" />
              <p className="text-[#9BA17B] text-sm leading-relaxed">
                Ceremonial grade matcha crafted in Uji, Japan. Designed for the modern ritual.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-sm">
              <div className="flex flex-col gap-5">
                <span className="text-[#4C5734] uppercase tracking-[0.2em] text-[10px] mb-2 font-medium">Shop</span>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">All Matcha</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Teaware</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Gifts & Sets</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Wholesale</a>
              </div>
              
              <div className="flex flex-col gap-5">
                <span className="text-[#4C5734] uppercase tracking-[0.2em] text-[10px] mb-2 font-medium">Discover</span>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Our Story</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">The Fields of Uji</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Ritual Guide</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Journal</a>
              </div>
              
              <div className="flex flex-col gap-5">
                <span className="text-[#4C5734] uppercase tracking-[0.2em] text-[10px] mb-2 font-medium">Support</span>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Contact</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">FAQ</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Shipping & Returns</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Terms & Privacy</a>
              </div>
              
              <div className="flex flex-col gap-5">
                <span className="text-[#4C5734] uppercase tracking-[0.2em] text-[10px] mb-2 font-medium">Social</span>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Instagram</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">TikTok</a>
                <a href="#" className="text-[#F2EADB] hover:text-[#9BA17B] transition-colors">Pinterest</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#1F3929] gap-4">
            <p className="text-[#9BA17B] text-xs">© 2026 UJI MATCHA — See you in your next ritual.</p>
            <div className="flex gap-4">
              <span className="text-[#9BA17B] text-[10px] uppercase tracking-[0.2em]">AR / EN</span>
            </div>
          </div>
        </div>

        {/* Giant Watermark Logo */}
        <div className="absolute -bottom-10 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.03]">
          <span className="font-['Inter'] font-black text-[22vw] leading-none text-[#F2EADB] whitespace-nowrap tracking-tighter">
            UJI MATCHA
          </span>
        </div>
      </footer>
    </div>
  );
}
