import React from 'react';

export const DebugEnv = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const isPlaceholder = url === 'https://placeholder.supabase.co';

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black/90 text-green-400 p-4 font-mono text-xs z-50 border-t-2 border-green-500 opacity-90 hover:opacity-100 transition-opacity">
            <h3 className="font-bold text-white mb-2 uppercase border-b border-gray-700 pb-1">Diagnóstico de Ambiente (Temporário)</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-gray-400">VITE_SUPABASE_URL:</span><br />
                    {url ? (
                        <span className={isPlaceholder ? "text-red-500 font-bold" : "text-green-400"}>
                            {isPlaceholder ? "⚠️ PLACEHOLDER (Erro)" : `${url.substring(0, 20)}...`}
                        </span>
                    ) : <span className="text-red-500 font-bold">UNDEFINED/MISSING</span>}
                </div>
                <div>
                    <span className="text-gray-400">VITE_SUPABASE_ANON_KEY:</span><br />
                    {key ? (
                        <span className={key === 'placeholder-key' ? "text-red-500 font-bold" : "text-green-400"}>
                            {key === 'placeholder-key' ? "⚠️ PLACEHOLDER (Erro)" : "Loaded (Hidden)"}
                        </span>
                    ) : <span className="text-red-500 font-bold">UNDEFINED/MISSING</span>}
                </div>
                <div>
                    <span className="text-gray-400">OPENWEATHER_KEY:</span><br />
                    {import.meta.env.VITE_OPENWEATHER_API_KEY ? (
                        <span className="text-green-400">
                            {import.meta.env.VITE_OPENWEATHER_API_KEY.substring(0, 8)}... (OK)
                        </span>
                    ) : <span className="text-red-500 font-bold">MISSING (ERRO)</span>}
                </div>
                <div>
                    <span className="text-gray-400">COORDENADAS PADRÃO:</span><br />
                    <span className="text-cyan-400">
                        LAT: {import.meta.env.VITE_MARINA_LAT || 'Def'} | LON: {import.meta.env.VITE_MARINA_LON || 'Def'}
                    </span>
                </div>
            </div>
            <div className="mt-2 text-gray-500 italic">
                Se aparecer "PLACEHOLDER", o sistema não está lendo o arquivo .env corretamente.
            </div>
        </div>
    );
};
