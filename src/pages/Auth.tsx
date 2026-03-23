import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/perfil');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (error) throw error;
        
        // If email confirmation is disabled in Supabase, data.session will be present
        if (data.session) {
          navigate('/perfil');
        } else {
          setMessage('Cadastro realizado com sucesso! Você já pode entrar.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center p-6 sm:p-4">
      {/* Magical Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1547756536-cde3673fa2e5?q=80&w=1920&auto=format&fit=crop")' 
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-magic-gold/30 bg-magic-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <Wand2 className="h-10 w-10 text-magic-gold" />
          </motion.div>
          <h1 className="font-medieval text-4xl text-magic-gold tracking-widest text-center shadow-text">
            {isLogin ? 'Portal Bruxo' : 'Novo Aluno'}
          </h1>
          <p className="mt-2 text-parchment/60 font-crimson italic">
            {isLogin ? 'Entre com suas credenciais de Hogwarts' : 'Registre-se na Escola de Magia'}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-magic-gold/20 bg-[#121212]/80 backdrop-blur-xl p-8 shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medieval text-magic-gold/80 ml-1">Nome do Bruxo</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-magic-gold/40 group-focus-within:text-magic-gold transition-colors" />
                    <input
                      type="text"
                      placeholder="Ex: Harry Potter"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                      className="w-full rounded-lg border border-magic-gold/10 bg-black/40 py-3 pl-11 pr-4 text-parchment placeholder-parchment/20 focus:border-magic-gold/50 focus:outline-none focus:ring-1 focus:ring-magic-gold/50 transition-all font-crimson text-lg"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-sm font-medieval text-magic-gold/80 ml-1">Correio Coruja (E-mail)</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-magic-gold/40 group-focus-within:text-magic-gold transition-colors" />
                <input
                  type="email"
                  placeholder="bruxo@hogwarts.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-magic-gold/10 bg-black/40 py-3 pl-11 pr-4 text-parchment placeholder-parchment/20 focus:border-magic-gold/50 focus:outline-none focus:ring-1 focus:ring-magic-gold/50 transition-all font-crimson text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medieval text-magic-gold/80 ml-1">Selo Mágico (Senha)</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-magic-gold/40 group-focus-within:text-magic-gold transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-magic-gold/10 bg-black/40 py-3 pl-11 pr-4 text-parchment placeholder-parchment/20 focus:border-magic-gold/50 focus:outline-none focus:ring-1 focus:ring-magic-gold/50 transition-all font-crimson text-lg"
                />
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-magic-gold/5 border border-magic-gold/20 text-magic-gold text-sm text-center italic"
              >
                {message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-lg bg-magic-gold py-4 font-medieval text-lg text-black transition-all hover:bg-magic-gold/90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <div className="h-6 w-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                isLogin ? <><LogIn className="h-5 w-5" /> Entrar no Salão</> : <><UserPlus className="h-5 w-5" /> Iniciar Matrícula</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-magic-gold/10 pt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-magic-gold/60 hover:text-magic-gold font-crimson transition-colors"
            >
              {isLogin ? "¿Ainda não é um aluno? Matricule-se" : "¿Já faz parte da escola? Entre por aqui"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
