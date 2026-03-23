import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface RollResult {
  value: number;
  label: string;
  description: string;
  color: string;
}

const getRollResult = (roll: number): RollResult => {
  if (roll === 1) {
    return {
      value: roll,
      label: "Falha Crítica",
      description: "Algo dá muito errado. Você sofre duas Condições ou uma consequência grave à escolha do narrador.",
      color: "#ef4444" // red
    };
  }
  if (roll <= 9) {
    return {
      value: roll,
      label: "Falha",
      description: "Você não consegue o que queria. Ganha 1 ponto de experiência (XP) e sofre uma Consequência Séria.",
      color: "#f87171" // lighter red
    };
  }
  if (roll <= 16) {
    return {
      value: roll,
      label: "Sucesso Parcial",
      description: "Você consegue, mas não perfeitamente. O narrador pode impor uma complicação menor.",
      color: "#fbbf24" // amber/gold
    };
  }
  if (roll <= 19) {
    return {
      value: roll,
      label: "Sucesso Total",
      description: "Você consegue exatamente o que queria e seu oponente não.",
      color: "#34d399" // green
    };
  }
  return {
    value: roll,
    label: "Sucesso Crítico",
    description: "Você consegue além do esperado. Ganha alguma vantagem extra.",
    color: "#10b981" // emerald green
  };
};

export function DiceRoller() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<RollResult | null>(null);

  const rollDice = () => {
    setIsRolling(true);
    setResult(null);
    
    // Simulate rolling animation time
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      setResult(getRollResult(roll));
      setIsRolling(false);
    }, 1200);
  };

  React.useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      if (!isRolling) rollDice();
    };
    window.addEventListener('open-dice-roller', handleOpen);
    return () => window.removeEventListener('open-dice-roller', handleOpen);
  }, [isRolling]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          if (!result && !isRolling) rollDice();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full border-2 border-magic-gold/50 bg-[#1a140a] text-magic-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:border-magic-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300"
      >
        <div className="relative h-10 w-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7.5 10.5 12 1 16.5 10.5" />
            <polyline points="12 1 12 10.5" />
            <polyline points="7.5 10.5 12 23 16.5 10.5" />
            <polyline points="12 23 12 10.5" />
            <polyline points="2 10.5 12 1 22 10.5 12 23 2 10.5" />
            <polyline points="2 10.5 7.5 10.5" />
            <polyline points="22 10.5 16.5 10.5" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-medieval text-xs mt-1">d20</span>
        </div>
      </motion.button>

      {/* Modal / Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId="dice-modal"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-magic-gold/30 bg-[#0f0a05] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-magic-gold/50 hover:text-magic-gold transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col items-center text-center">
                <h2 className="mb-6 font-medieval text-2xl text-magic-gold">Sistema de Rolagem</h2>

                <div className="relative mb-8 h-32 w-32">
                  {/* D20 Animation / Result */}
                  <motion.div
                    animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : {}}
                    transition={isRolling ? { duration: 0.4, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                    className="flex h-full w-full items-center justify-center"
                    style={{ color: result ? result.color : 'var(--color-magic-gold)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-full w-full opacity-30">
                      <path d="M12 2L2 12L12 22L22 12L12 2Z" />
                      <path d="M12 2V22" />
                      <path d="M2 12H22" />
                      <path d="M7 7L17 17" />
                      <path d="M17 7L7 17" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isRolling ? (
                        <span className="font-medieval text-4xl text-magic-gold">?</span>
                      ) : (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="font-medieval text-6xl font-bold"
                        >
                          {result?.value}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  {result && !isRolling && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <span 
                          className="font-medieval text-xl font-bold tracking-widest uppercase px-3 py-1 rounded border border-current"
                          style={{ color: result.color }}
                        >
                          {result.label}
                        </span>
                      </div>
                      <p className="font-crimson text-lg italic text-parchment/90 leading-relaxed">
                        "{result.description}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  disabled={isRolling}
                  onClick={rollDice}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-8 w-full rounded-lg border border-magic-gold/40 bg-magic-gold/10 py-3 font-medieval text-magic-gold transition-all hover:bg-magic-gold/20 disabled:opacity-50 ${
                    isRolling ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isRolling ? 'Rolasando...' : 'Rolar Novamente'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
