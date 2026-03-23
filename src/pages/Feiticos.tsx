import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Feiticos() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 text-parchment">
      <Link to="/" className="inline-flex items-center gap-2 text-magic-gold hover:underline font-medieval mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Portal
      </Link>
      <h1 className="text-4xl font-medieval text-magic-gold mb-6">Compêndio de Azarações e Feitiços</h1>
      <p className="font-crimson text-lg">Conteúdo do compêndio em desenvolvimento...</p>
    </div>
  );
}
