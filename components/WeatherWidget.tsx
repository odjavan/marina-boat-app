import React from 'react';
import { Sun, Wind, Droplets } from 'lucide-react';
import { Card } from './ui';

export const WeatherWidget: React.FC = () => {
    return (
        <Card className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Status da Marina</h3>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                    Atualizado agora
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <Sun className="mx-auto mb-2" size={32} />
                    <p className="text-3xl font-bold mb-1">28°C</p>
                    <p className="text-sm opacity-90">Temperatura</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <Wind className="mx-auto mb-2" size={32} />
                    <p className="text-3xl font-bold mb-1">12</p>
                    <p className="text-sm opacity-90">Nós de Vento</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <Droplets className="mx-auto mb-2" size={32} />
                    <p className="text-3xl font-bold mb-1">0.8m</p>
                    <p className="text-sm opacity-90">Ondas</p>
                </div>
            </div>
        </Card>
    );
};
