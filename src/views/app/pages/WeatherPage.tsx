import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Cloud, CloudRain, Haze, Droplets, Wind, ArrowLeft, CloudLightning, Snowflake } from "lucide-react";

export const WeatherPage = () => {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            console.log('🌤️ [WeatherPage] Initializing weather fetch...');
            console.log('🌤️ [WeatherPage] Geolocation available:', !!navigator.geolocation);
            
            try {
                // Try to get user's current location
                if (navigator.geolocation) {
                    console.log('🌤️ [WeatherPage] Requesting geolocation...');
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            console.log('✅ [WeatherPage] Geolocation success:', { latitude, longitude });
                            const url = `http://localhost:3001/api/weather?lat=${latitude}&lon=${longitude}`;
                            console.log('🌤️ [WeatherPage] Fetching weather with URL:', url);
                            
                            try {
                                const response = await fetch(url);
                                console.log('📡 [WeatherPage] Weather API response status:', response.status);
                                const data = await response.json();
                                console.log('📦 [WeatherPage] Weather API response data:', data);

                                if (data.success) {
                                    setWeatherData(data.data);
                                    setLocationName(data.data.current.city || 'Your Location');
                                    console.log('✅ [WeatherPage] Weather data set successfully for:', data.data.current.city);
                                } else {
                                    console.error('❌ [WeatherPage] API returned success=false');
                                    setError('Failed to load weather data');
                                }
                            } catch (err) {
                                console.error('❌ [WeatherPage] Fetch error:', err);
                                setError('Network error connecting to weather service');
                            } finally {
                                setLoading(false);
                            }
                        },
                        async (err) => {
                            // If geolocation fails, fall back to default city
                            console.error('❌ [WeatherPage] Geolocation error:', {
                                code: err.code,
                                message: err.message,
                                PERMISSION_DENIED: err.code === 1,
                                POSITION_UNAVAILABLE: err.code === 2,
                                TIMEOUT: err.code === 3
                            });
                            console.log('🔄 [WeatherPage] Falling back to Coimbatore...');
                            try {
                                const response = await fetch('http://localhost:3001/api/weather?city=Coimbatore');
                                console.log('📡 [WeatherPage Fallback] Weather API response status:', response.status);
                                const data = await response.json();
                                console.log('📦 [WeatherPage Fallback] Weather API response data:', data);

                                if (data.success) {
                                    setWeatherData(data.data);
                                    setLocationName(data.data.current.city || 'Coimbatore');
                                    console.log('✅ [WeatherPage Fallback] Weather data set successfully for:', data.data.current.city);
                                } else {
                                    console.error('❌ [WeatherPage Fallback] API returned success=false');
                                    setError('Failed to load weather data');
                                }
                            } catch (err) {
                                console.error('❌ [WeatherPage Fallback] Fetch error:', err);
                                setError('Network error connecting to weather service');
                            } finally {
                                setLoading(false);
                            }
                        },
                        {
                            enableHighAccuracy: false,
                            timeout: 10000,
                            maximumAge: 300000
                        }
                    );
                } else {
                    // Geolocation not supported, use default city
                    console.warn('⚠️ [WeatherPage] Geolocation not supported by browser');
                    const response = await fetch('http://localhost:3001/api/weather?city=Coimbatore');
                    console.log('📡 [WeatherPage No-Geo] Weather API response status:', response.status);
                    const data = await response.json();
                    console.log('📦 [WeatherPage No-Geo] Weather API response data:', data);

                    if (data.success) {
                        setWeatherData(data.data);
                        setLocationName(data.data.current.city || 'Coimbatore');
                        console.log('✅ [WeatherPage No-Geo] Weather data set successfully for:', data.data.current.city);
                    } else {
                        console.error('❌ [WeatherPage No-Geo] API returned success=false');
                        setError('Failed to load weather data');
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error('❌ [WeatherPage] Top-level error:', err);
                setError('Network error connecting to weather service');
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('clear')) return <Sun className="w-8 h-8 text-yellow-500" />;
        if (c.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-400" />;
        if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />;
        if (c.includes('thunder')) return <CloudLightning className="w-8 h-8 text-purple-400" />;
        if (c.includes('snow')) return <Snowflake className="w-8 h-8 text-cyan-200" />;
        return <Haze className="w-8 h-8 text-orange-300" />;
    };

    const getLargeIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('clear')) return <Sun className="w-32 h-32 text-yellow-500" />;
        if (c.includes('cloud')) return <Cloud className="w-32 h-32 text-gray-400" />;
        if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-32 h-32 text-blue-400" />;
        if (c.includes('thunder')) return <CloudLightning className="w-32 h-32 text-purple-400" />;
        if (c.includes('snow')) return <Snowflake className="w-32 h-32 text-cyan-200" />;
        return <Haze className="w-32 h-32 text-zinc-400" />;
    };

    if (loading) return <div className="p-8 text-white">Loading weather data...</div>;
    if (error) return <div className="p-8 text-red-400">{error}</div>;
    if (!weatherData) return null;

    const { current, forecast } = weatherData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2 font-['Orbitron']">Weather Station</h1>
                    <p className="text-zinc-400 text-lg">Real-time weather monitoring for precision farming {locationName && `(${locationName})`}</p>
                </div>
                <button
                    onClick={() => navigate('/app')}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Current Conditions */}
                <div className="md:col-span-2 p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-2xl" />
                    <h2 className="text-2xl font-bold text-white mb-6 mt-4">Current Conditions</h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-7xl font-bold text-white mb-2">{current.temp}°C</div>
                            <div className="text-2xl text-zinc-400 capitalize">{current.description}</div>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/5">
                            {getLargeIcon(current.condition)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Droplets className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-zinc-400 text-sm mb-1">Humidity</div>
                                <div className="text-3xl font-bold text-white">{current.humidity}%</div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-zinc-500/20 rounded-lg">
                                <Wind className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div>
                                <div className="text-zinc-400 text-sm mb-1">Wind Speed</div>
                                <div className="text-3xl font-bold text-white">{current.windSpeed} km/h</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cotton Field Analytics */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="p-6 bg-black/30 border border-white/10 rounded-2xl">
                        <div className="text-zinc-400 text-sm mb-2">Cloud Cover</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-white">{current.cloudiness}%</span>
                            <span className="text-sm text-zinc-500 mb-1">
                                {current.cloudiness > 50 ? "Overcast" : "Clear Sky"}
                            </span>
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                            Photosynthesis Rate: {current.cloudiness > 50 ? "Moderate" : "High"}
                        </div>
                    </div>
                    <div className="p-6 bg-black/30 border border-white/10 rounded-2xl">
                        <div className="text-zinc-400 text-sm mb-2">Pressure</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-white">{current.pressure}</span>
                            <span className="text-sm text-zinc-500 mb-1">hPa</span>
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                            {current.pressure < 1000 ? "Low Pressure System" : "Stable Conditions"}
                        </div>
                    </div>
                    <div className="p-6 bg-black/30 border border-white/10 rounded-2xl">
                        <div className="text-zinc-400 text-sm mb-2">Visibility</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-white">{(current.visibility / 1000).toFixed(1)}</span>
                            <span className="text-sm text-zinc-500 mb-1">km</span>
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                            Aerial Survey Suitability: {current.visibility > 5000 ? "Good" : "Poor"}
                        </div>
                    </div>
                    <div className="p-6 bg-black/30 border border-white/10 rounded-2xl">
                        <div className="text-zinc-400 text-sm mb-2">Wind Direction</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-white">{current.windDeg}°</span>
                            <span className="text-sm text-zinc-500 mb-1">
                                {current.windDeg > 337.5 || current.windDeg <= 22.5 ? 'N' :
                                    current.windDeg > 22.5 && current.windDeg <= 67.5 ? 'NE' :
                                        current.windDeg > 67.5 && current.windDeg <= 112.5 ? 'E' :
                                            current.windDeg > 112.5 && current.windDeg <= 157.5 ? 'SE' :
                                                current.windDeg > 157.5 && current.windDeg <= 202.5 ? 'S' :
                                                    current.windDeg > 202.5 && current.windDeg <= 247.5 ? 'SW' :
                                                        current.windDeg > 247.5 && current.windDeg <= 292.5 ? 'W' : 'NW'}
                            </span>
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                            Spray Drift Risk: {current.windSpeed > 10 ? "High" : "Low"}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cotton Specific Insights */}
                    <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-2xl" />
                        <h2 className="text-xl font-bold text-white mb-4 mt-2">Cotton Picking</h2>
                        <div className={`p-4 rounded-xl border ${current.humidity < 60 && current.rain === undefined ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <div className={`font-bold mb-2 ${current.humidity < 60 && current.rain === undefined ? 'text-green-400' : 'text-red-400'}`}>
                                {current.humidity < 60 && current.rain === undefined ? "Conditions Optimal" : "Conditions Poor"}
                            </div>
                            <p className="text-zinc-400 text-sm">
                                {current.humidity < 60
                                    ? "Low humidity favors clean picking. Cotton moisture content likely standard."
                                    : "High humidity or rain risk. Picking may result in high moisture content."}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-2xl" />
                        <h2 className="text-xl font-bold text-white mb-4 mt-2">Pest & Disease</h2>
                        <div className={`p-4 rounded-xl border ${current.humidity > 80 && current.temp > 25 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                            <div className={`font-bold mb-2 ${current.humidity > 80 && current.temp > 25 ? 'text-red-400' : 'text-green-400'}`}>
                                {current.humidity > 80 && current.temp > 25 ? "High Risk Alert" : "Low Risk"}
                            </div>
                            <p className="text-zinc-400 text-sm">
                                {current.humidity > 80 && current.temp > 25
                                    ? "Warm and humid conditions favor Bollworm and Aphid growth. Monitor closely."
                                    : "Current dry conditions are unfavorable for most fungal diseases."}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-2xl" />
                        <h2 className="text-xl font-bold text-white mb-4 mt-2">Spraying Window</h2>
                        <div className={`p-4 rounded-xl border ${current.windSpeed < 15 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                            <div className={`font-bold mb-2 ${current.windSpeed < 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {current.windSpeed < 15 ? "Favorable" : "Caution"}
                            </div>
                            <p className="text-zinc-400 text-sm">
                                {current.windSpeed < 15
                                    ? `Wind speed ${current.windSpeed} km/h is safe for aerial or ground spraying.`
                                    : `High winds (${current.windSpeed} km/h) may cause drift. Avoid herbicides.`}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* 7-Day Forecast */}
            <div className="md:col-span-3 p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden mt-8">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-2xl" />
                <h2 className="text-2xl font-bold text-white mb-6 mt-4">Weather Forecast</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {forecast.map((day: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-all flex flex-col items-center justify-center min-h-[160px]">
                            <div className="text-zinc-400 font-semibold mb-2">{day.day}</div>
                            <div className="mb-2 p-2 bg-white/5 rounded-full">
                                {getWeatherIcon(day.condition)}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{day.temp}°C</div>
                            <div className="text-zinc-500 text-xs text-center capitalize px-1">{day.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

