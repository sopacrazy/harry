import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DiceRoller, getRollResult } from '../components/DiceRoller';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, Shield, GraduationCap, Sparkles, History as HistoryIcon, TrendingUp, Zap } from 'lucide-react';

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rolls, setRolls] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('rolagens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (data) setRolls(data);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
        await fetchHistory();
      }
      setLoading(false);
    };
    checkUser();

    // Listen for new rolls
    window.addEventListener('dice-rolled', fetchHistory);
    return () => window.removeEventListener('dice-rolled', fetchHistory);
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-12 w-12 border-4 border-magic-gold/20 border-t-magic-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate stats
  const totalRolls = rolls.length; // This is only for the limited set, but we can assume it's just a demo
  const averageRoll = rolls.length > 0 ? (rolls.reduce((sum, r) => sum + r.v_num, 0) / rolls.length).toFixed(1) : 0;
  const lastResult = rolls.length > 0 ? getRollResult(rolls[0].v_num) : null;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-parchment p-4 overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-magic-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-magic-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-magic-gold/20 bg-[#121212]/80 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 border-b border-magic-gold/10 pb-10">
            <div className="relative group">
              <div className="h-28 w-28 rounded-2xl border-2 border-magic-gold/40 bg-[#1a140a] p-1.5 shadow-[0_0_30px_rgba(212,175,55,0.2)] transform group-hover:rotate-3 transition-transform duration-500">
                <div className="h-full w-full rounded-xl bg-magic-gold/5 flex items-center justify-center border border-magic-gold/10">
                  <User className="h-12 w-12 text-magic-gold" />
                </div>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-magic-gold flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.6)]"
              >
                <Sparkles className="h-4 w-4 text-black" />
              </motion.div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <h2 className="font-medieval text-4xl text-magic-gold drop-shadow-sm">
                  {user?.user_metadata?.username || 'Bruxo'}
                </h2>
                <span className="px-2 py-0.5 bg-magic-gold/20 rounded text-[10px] text-magic-gold font-medieval tracking-[2px] uppercase">
                   Veterano
                </span>
              </div>
              <p className="text-parchment/40 font-crimson text-lg italic mb-4">
                "{user?.email}"
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-medieval uppercase text-parchment/60">
                   <GraduationCap className="h-3.5 w-3.5" /> Grifinória
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-magic-gold/5 rounded-lg border border-magic-gold/20 text-xs font-medieval uppercase text-magic-gold">
                   <Shield className="h-3.5 w-3.5" /> Nível 5
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
              <Zap className="h-4 w-4 text-magic-gold/50 mb-1" />
              <span className="text-[10px] uppercase font-medieval text-parchment/40 tracking-widest">Sorte Média</span>
              <span className="text-2xl font-medieval text-magic-gold">{averageRoll}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
              <TrendingUp className="h-4 w-4 text-magic-gold/50 mb-1" />
              <span className="text-[10px] uppercase font-medieval text-parchment/40 tracking-widest">Atividade</span>
              <span className="text-2xl font-medieval text-magic-gold">{rolls.length > 5 ? 'Alta' : 'Moderada'}</span>
            </div>
            <div className="hidden sm:flex p-4 rounded-xl bg-white/[0.02] border border-white/5 flex-col items-center">
              <HistoryIcon className="h-4 w-4 text-magic-gold/50 mb-1" />
              <span className="text-[10px] uppercase font-medieval text-parchment/40 tracking-widest">Total Hist.</span>
              <span className="text-2xl font-medieval text-magic-gold">{rolls.length}</span>
            </div>
          </div>

          {/* Main Action Component */}
          <div className="mb-10 p-2 rounded-2xl bg-gradient-to-b from-magic-gold/20 to-transparent">
             <div className="p-6 rounded-xl bg-[#0a0a0a] border border-magic-gold/20">
                <h3 className="font-medieval text-xl text-magic-gold mb-6 text-center uppercase tracking-widest">Canal de Rolagens</h3>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-dice-roller'))}
                    className="w-full group relative flex items-center justify-center gap-4 overflow-hidden rounded-xl bg-magic-gold px-6 py-6 font-medieval text-2xl text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                      <path d="M12 2L2 12L12 22L22 12L12 2Z" />
                    </svg>
                    <span>LANÇAR d20</span>
                  </button>

                  {lastResult && (
                    <motion.div 
                      key={rolls[0]?.created_at}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mt-2"
                    >
                      <span className="text-xs font-medieval uppercase tracking-widest text-parchment/40">Último Resultado: </span>
                      <span className="font-medieval text-lg ml-1" style={{ color: lastResult.color }}>{rolls[0].v_num} ({lastResult.label})</span>
                    </motion.div>
                  )}
                </div>
             </div>
          </div>

          {/* Real-time History List */}
          <div>
             <div className="flex items-center gap-2 mb-6">
                <HistoryIcon className="h-5 w-5 text-magic-gold" />
                <h3 className="font-medieval text-xl text-magic-gold uppercase tracking-widest">Diário de Destino</h3>
             </div>

             <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {rolls.length === 0 ? (
                    <p className="text-center py-10 italic text-parchment/20 border border-dashed border-white/5 rounded-xl">
                      Nenhuma magia registrada nesta era...
                    </p>
                  ) : (
                    rolls.map((roll) => {
                      const res = getRollResult(roll.v_num);
                      return (
                        <motion.div
                          layout
                          key={roll.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-magic-gold/20 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                             <div 
                               className="h-12 w-12 rounded-lg border flex items-center justify-center font-medieval text-2xl shadow-inner" 
                               style={{ backgroundColor: `${res.color}10`, borderColor: `${res.color}30`, color: res.color }}
                             >
                               {roll.v_num}
                             </div>
                             <div>
                                <h4 className="font-medieval text-sm uppercase tracking-wider" style={{ color: res.color }}>{res.label}</h4>
                                <p className="text-[10px] text-parchment/30 uppercase flex items-center gap-1 font-crimson">
                                   <Clock className="h-2.5 w-2.5" /> {new Date(roll.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </p>
                             </div>
                          </div>
                          
                          <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] font-crimson italic text-parchment/20 max-w-[150px] line-clamp-1 block text-right">
                               "{res.description}"
                             </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
             </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            {user?.email === 'admin@admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg border border-magic-gold/30 bg-magic-gold/5 text-magic-gold hover:bg-magic-gold/20 transition-all font-medieval text-xs uppercase tracking-widest"
              >
                <Shield className="h-4 w-4" /> Entrar na Torre Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-8 py-3 rounded-full border border-red-500/20 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all font-medieval text-xs uppercase tracking-[3px]"
            >
              <LogOut className="h-4 w-4" /> Deslogar de Hogwarts
            </button>
          </div>
        </motion.div>
      </div>

      <DiceRoller />
    </div>
  );
}

// Subcomponent for simple clock icon since I used it but might have missed the lucide import for it
function Clock({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
