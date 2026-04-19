import { MapPin, Thermometer, Droplets, CloudRain, Wind, ChevronDown } from 'lucide-react';
import { WeatherInput } from '../../types';
import { cityWeatherPresets, soilTypes, seasons } from '../../data/crops';

interface WeatherInputProps {
  weather: WeatherInput;
  onChange: (updated: WeatherInput) => void;
}

const cities = Object.keys(cityWeatherPresets);

export default function WeatherInputForm({ weather, onChange }: WeatherInputProps) {
  function handleCitySelect(city: string) {
    const preset = cityWeatherPresets[city];
    if (preset) {
      onChange({ ...weather, location: city, ...preset });
    } else {
      onChange({ ...weather, location: city });
    }
  }

  function handleField<K extends keyof WeatherInput>(key: K, value: WeatherInput[K]) {
    onChange({ ...weather, [key]: value });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Location & Weather Conditions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <MapPin size={12} className="inline mr-1" />
              City (auto-fill weather)
            </label>
            <div className="relative">
              <select
                value={weather.location}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pr-8"
              >
                <option value="">-- Select or enter manually --</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Custom location name</label>
            <input
              type="text"
              value={weather.location}
              onChange={(e) => handleField('location', e.target.value)}
              placeholder="e.g., My Farm, Village Name"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: 'temperature', label: 'Temperature (°C)', icon: Thermometer, min: 0, max: 50, step: 0.5, color: 'text-red-500' },
          { key: 'humidity', label: 'Humidity (%)', icon: Droplets, min: 0, max: 100, step: 1, color: 'text-blue-500' },
          { key: 'rainfall', label: 'Rainfall (mm)', icon: CloudRain, min: 0, max: 200, step: 1, color: 'text-blue-400' },
          { key: 'windSpeed', label: 'Wind Speed (km/h)', icon: Wind, min: 0, max: 100, step: 1, color: 'text-gray-400' },
        ].map(({ key, label, icon: Icon, min, max, step, color }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <Icon size={12} className={`inline mr-1 ${color}`} />
              {label}
            </label>
            <input
              type="number"
              value={weather[key as keyof WeatherInput] as number}
              onChange={(e) => handleField(key as keyof WeatherInput, parseFloat(e.target.value) as WeatherInput[keyof WeatherInput])}
              min={min}
              max={max}
              step={step}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Soil Type</label>
          <div className="relative">
            <select
              value={weather.soilType}
              onChange={(e) => handleField('soilType', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pr-8"
            >
              {soilTypes.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Season</label>
          <div className="relative">
            <select
              value={weather.season}
              onChange={(e) => handleField('season', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pr-8"
            >
              {seasons.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
