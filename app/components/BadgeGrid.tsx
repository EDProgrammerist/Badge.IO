"use client";
import { useState, useMemo } from "react";
import { Category, Badge } from "@/app/lib/parser"; 
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Menu, X, Github } from "lucide-react";

// --- BADGE CARD COMPONENT ---
const BadgeCard = ({ badge }: { badge: Badge }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(badge.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy}
      className="relative group bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition-all duration-200 h-32"
    >
      <div className="h-10 w-full flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={badge.url} 
          alt={badge.name} 
          loading="lazy" 
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center group-hover:text-white truncate w-full px-2">
        {badge.name}
      </p>

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-900/95 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm"
          >
            <span className="text-green-200 font-bold text-xs flex items-center gap-1">
              <Check className="w-3 h-3" /> COPIED
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function BadgeGrid({ data }: { data: Category[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.map(cat => ({
      ...cat,
      badges: cat.badges.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    })).filter(cat => cat.badges.length > 0);
  }, [data, searchTerm]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* --- TOP NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-[#0a0a0a]/90 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1 text-gray-400">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          {/* UPDATED LOGO */}
          <span className="font-bold text-xl tracking-tight">Badge<span className="text-purple-500">.IO</span></span>
        </div>

        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-full px-4 py-2 w-full max-w-md mx-4 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input 
            type="text"
            placeholder="Search badges..."
            className="bg-transparent outline-none text-sm w-full placeholder-gray-600 text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-8 hidden lg:block"></div>
      </header>

      {/* --- LAYOUT WRAPPER --- */}
      <div className="flex pt-16 h-screen overflow-hidden"> 
        
        {/* --- SIDEBAR --- */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 pt-16 lg:pt-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="h-full overflow-y-auto p-4 space-y-1 no-scrollbar pb-20">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
            {data.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors truncate"
              >
                {cat.title}
              </button>
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth relative">
          <div className="min-h-[calc(100vh-10rem)]">
            {filteredData.map(category => (
              <section key={category.id} id={category.id} className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-200">
                  <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                  {category.title}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {category.badges.map((badge, idx) => (
                    <BadgeCard key={`${category.id}-${idx}`} badge={badge} />
                  ))}
                </div>
              </section>
            ))}
            
            {filteredData.length === 0 && (
              <div className="text-center py-20 text-gray-500">No results found.</div>
            )}
          </div>

          {/* --- FOOTER --- */}
          <footer className="mt-20 py-8 border-t border-gray-800">
            <div className="flex flex-col items-center justify-center text-sm text-gray-500 gap-2">
              <p>
                Built by <span className="text-white font-semibold">EDProgrammerist</span>
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span>Data Source by</span>
                <a 
                  href="https://github.com/alexandresanlim" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  alexandresanlim
                </a>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}