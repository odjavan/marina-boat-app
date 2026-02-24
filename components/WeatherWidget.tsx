import React, { useEffect, useState } from 'react';
import { Sun, Wind, Droplets, CloudRain, Cloud } from 'lucide-react';
import { Card } from './ui';
import { fetchWeather, WeatherData } from '../lib/weather';

export const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWeatherData = async () => {
            const data = await fetchWeather();
            setWeather(data);
            setLoading(false);
        };
        getWeatherData();

        // Atualizar a cada 30 minutos
        const interval = setInterval(getWeatherData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

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
        <Card className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-lg relative overflow-hidden group">
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    Status da Marina
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Real-time</span>
                </h3>
                <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-medium backdrop-blur-sm">
                    {weather ? 'Via OpenWeather' : 'Modo Offline'}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all hover:scale-105">
                    {getWeatherIcon(data.description)}
                    <p className="text-3xl font-bold mb-1">{data.temp}°C</p>
                    <p className="text-sm opacity-90 capitalize">{data.description}</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all hover:scale-105">
                    <Wind className="mx-auto mb-2" size={32} />
                    <p className="text-3xl font-bold mb-1">{data.wind_speed}</p>
                    <p className="text-sm opacity-90">Nós de Vento</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all hover:scale-105">
                    <Droplets className="mx-auto mb-2" size={32} />
                    <p className="text-3xl font-bold mb-1">{data.humidity}%</p>
                    <p className="text-sm opacity-90">Umidade</p>
                </div>
            </div>
        </Card>
    );
};
