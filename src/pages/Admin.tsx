import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getRollResult } from '../components/DiceRoller';
import { motion } from 'motion/react';
import { Shield, Users, History, ArrowLeft, Search, RefreshCw, Clock } from 'lucide-react';

export function Admin() {
  const [rolls, setRolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@admin') {
        navigate('/');
        return;
      }
      setIsAdmin(true);
      fetchFullHistory();
    };
    checkAdmin();
  }, [navigate]);

  const fetchFullHistory = async () => {
    setLoading(true);
    // Fetch rolls with user data if possible, or just the rolls
    // We'll try to fetch with a join or just the email if stored (but it's not in the table yet)
    // For now, we'll fetch the rolls and assume the user_id is enough, 
    // but a join with auth.users is hard in frontend without profiles table
    const { data, error } = await supabase
      .from('rolagens')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setRolls(data);
    setLoading(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-parchment p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => navigate('/perfil')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-magic-gold transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-medieval text-3xl text-magic-gold flex items-center gap-2">
                <Shield className="h-6 w-6" /> Torre do Observador
              </h1>
              <p className="text-xs uppercase tracking-widest text-parchment/40 font-medieval mt-1">
                Painel do Narrador Supremo
              </p>
            </div>
          </div>

          <button 
            onClick={fetchFullHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-magic-gold/10 border border-magic-gold/20 text-magic-gold hover:bg-magic-gold/20 transition-all font-medieval text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sincronizar Orbe
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="p-6 rounded-2xl bg-[#121212] border border-white/5">
              <span className="text-[10px] uppercase font-medieval text-parchment/30 tracking-widest block mb-1">Total de Rolagens</span>
              <span className="text-3xl font-medieval text-magic-gold">{rolls.length}</span>
           </div>
           <div className="p-6 rounded-2xl bg-[#121212] border border-white/5">
              <span className="text-[10px] uppercase font-medieval text-parchment/30 tracking-widest block mb-1">Bruxos Ativos</span>
              <span className="text-3xl font-medieval text-magic-gold">{new Set(rolls.map(r => r.user_id)).size}</span>
           </div>
           <div className="p-6 rounded-2xl bg-[#121212] border border-white/5">
              <span className="text-[10px] uppercase font-medieval text-parchment/30 tracking-widest block mb-1">Última Sucesso Crítico</span>
              <span className="text-3xl font-medieval text-green-400">
                {rolls.find(r => r.v_num === 20)?.v_num || '-'}
              </span>
           </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 font-medieval text-xs uppercase tracking-widest text-magic-gold">Bruxo (ID)</th>
                  <th className="p-4 font-medieval text-xs uppercase tracking-widest text-magic-gold text-center">Valor</th>
                  <th className="p-4 font-medieval text-xs uppercase tracking-widest text-magic-gold">Resultado</th>
                  <th className="p-4 font-medieval text-xs uppercase tracking-widest text-magic-gold">Data e Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-parchment/20 italic">
                      Consultando os arquivos da biblioteca...
                    </td>
                  </tr>
                ) : rolls.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-parchment/20 italic">
                      Nenhum feitiço lançado nesta era.
                    </td>
                  </tr>
                ) : (
                  rolls.map((roll) => {
                    const res = getRollResult(roll.v_num);
                    return (
                      <motion.tr 
                        key={roll.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-4 text-xs font-mono text-parchment/40 group-hover:text-parchment/60 transition-colors">
                          {roll.user_id.substring(0, 8)}...
                        </td>
                        <td className="p-4 text-center">
                          <span 
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border font-medieval text-xl"
                            style={{ backgroundColor: `${res.color}10`, borderColor: `${res.color}30`, color: res.color }}
                          >
                            {roll.v_num}
                          </span>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="font-medieval text-sm uppercase tracking-wide" style={{ color: res.color }}>
                                {res.label}
                              </span>
                              <span className="text-[10px] text-parchment/20 line-clamp-1 italic">
                                "{res.description}"
                              </span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2 text-xs text-parchment/40">
                              <Clock className="h-3 w-3" />
                              {new Date(roll.created_at).toLocaleDateString('pt-BR')} {new Date(roll.created_at).toLocaleTimeString('pt-BR')}
                           </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
