import React, { useEffect, useState } from 'react';
import { Sun, Wind, Droplets, CloudRain, Cloud } from 'lucide-react';
import { Card } from './ui';
import { fetchWeather, WeatherData } from '../lib/weather';

interface WeatherWidgetProps {
    lat?: string;
    lon?: string;
    marinaName?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lon, marinaName }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWeatherData = async () => {
            setLoading(true);
            const data = await fetchWeather(lat, lon);
            setWeather(data);
            setLoading(false);
        };
        getWeatherData();

        const interval = setInterval(getWeatherData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [lat, lon]);

    const getWeatherIcon = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes('chuva')) return <CloudRain className="mx-auto mb-2" size={32} />;
        if (d.includes('nuven')) return <Cloud className="mx-auto mb-2" size={32} />;
        return <Sun className="mx-auto mb-2" size={32} />;
    };

    if (loading) {
        return (
            <Card className="p-6 bg-gradient-to-br from-cyan-600/20 to-blue-700/20 animate-pulse border-0">
                <div className="h-32 flex items-center justify-center text-cyan-500 font-medium">
                    Carregando condições climáticas...
                </div>
            </Card>
        );
    }

    // Fallback para dados realistas se falhar, mas avisando
    const data = weather || { temp: 24, wind_speed: 8, humidity: 65, description: 'Céu limpo' };

    return (
        <Card className="p-6 bg-gradient-to-br from-cyan-500/90 via-blue-600/90 to-blue-800/90 text-white border-0 shadow-xl relative overflow-hidden group backdrop-blur-md">
            {/* Background Decorativo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl group-hover:bg-cyan-400/30 transition-all duration-700" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {marinaName || 'Clima Local'}
                    </h3>
                    <p className="text-[10px] text-white/70 font-medium uppercase tracking-[0.2em]">Condições Atuais</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 bg-white/20 rounded-lg text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                        {weather ? 'API Live' : 'Dados Offline'}
                    </span>
                    <span className="text-[8px] opacity-50">OpenWeatherMap</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/10 shadow-inner group/item hover:bg-white/20 transition-all cursor-default overflow-hidden">
                    <div className="transform group-hover/item:scale-110 transition-transform duration-500">
                      {getWeatherIcon(data.description)}
                    </div>
                    <p className="text-2xl font-black mb-0.5 tracking-tighter">{data.temp}°C</p>
                    <p className="text-[9px] font-bold opacity-80 uppercase truncate w-full text-center px-1">{data.description}</p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/10 shadow-inner group/item hover:bg-white/20 transition-all cursor-default">
                    <div className="transform rotate-0 group-hover/item:rotate-[360deg] transition-transform duration-1000 mb-2">
                        <Wind className="text-cyan-200" size={24} />
                    </div>
                    <p className="text-2xl font-black mb-0.5 tracking-tighter">{data.wind_speed}</p>
                    <p className="text-[9px] font-bold opacity-80 uppercase">Nós de Vento</p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/10 shadow-inner group/item hover:bg-white/20 transition-all cursor-default">
                    <div className="animate-bounce-slow mb-2">
                        <Droplets className="text-blue-200" size={24} />
                    </div>
                    <p className="text-2xl font-black mb-0.5 tracking-tighter">{data.humidity}%</p>
                    <p className="text-[9px] font-bold opacity-80 uppercase">Umidade</p>
                </div>
            </div>
        </Card>
    );
};
