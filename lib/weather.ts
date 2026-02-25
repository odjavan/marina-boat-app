
export interface WeatherData {
    temp: number;
    wind_speed: number;
    humidity: number;
    description: string;
}

export const fetchWeather = async (
    lat: string = import.meta.env.VITE_MARINA_LAT || '-23.0039',
    lon: string = import.meta.env.VITE_MARINA_LON || '-43.3231'
): Promise<WeatherData | null> => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!API_KEY) {
        console.warn('OpenWeather API Key missing in environment variables');
        return null;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
        );

        if (!response.ok) throw new Error('Failed to fetch weather');

        const data = await response.json();
        return {
            temp: Math.round(data.main.temp),
            wind_speed: Math.round(data.wind.speed * 1.94384), // Convert m/s to knots
            humidity: data.main.humidity,
            description: data.weather[0].description
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};
