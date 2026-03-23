import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Particles } from '../components/Particles';
import { BookOpen, Scroll } from 'lucide-react';

export function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=1920&auto=format&fit=crop")' 
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />

      {/* Particles Effect */}
      <Particles />

      {/* Ornamental Golden Border */}
      <div className="pointer-events-none absolute inset-4 z-10 rounded-xl border-2 border-magic-gold/30 md:inset-8">
        <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-magic-gold" />
        <div className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-magic-gold" />
        <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-magic-gold" />
        <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-magic-gold" />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 flex w-full max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="font-medieval text-4xl font-bold tracking-wider text-magic-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] md:text-6xl">
            Hogwarts: Magical Britain - Tales Untold
          </h1>
          <div className="mx-auto mt-4 h-px w-3/4 bg-gradient-to-r from-transparent via-magic-gold/50 to-transparent" />
        </motion.div>

        <motion.p 
          className="mb-12 font-crimson text-xl italic text-parchment/80 md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          "Selecione o seu caminho de aprendizado, bruxo."
        </motion.p>

        <div className="flex w-full flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Link 
              to="/grade"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-magic-gold/40 bg-[#1a140a] px-6 py-4 font-medieval text-lg text-magic-gold transition-all duration-300 hover:border-magic-gold hover:bg-[#2a1f0f] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magic-gold/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Scroll className="h-6 w-6" />
              <span>Grade Curricular Oficial de Hogwarts</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Link 
              to="/feiticos"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-magic-gold/40 bg-[#1a140a] px-6 py-4 font-medieval text-lg text-magic-gold transition-all duration-300 hover:border-magic-gold hover:bg-[#2a1f0f] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magic-gold/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <BookOpen className="h-6 w-6" />
              <span>Compêndio de Azarações e Feitiços</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
