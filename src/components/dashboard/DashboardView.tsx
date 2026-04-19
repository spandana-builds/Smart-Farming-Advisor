import { Sprout, TrendingUp, AlertTriangle, Droplets, Thermometer, Wind, CloudRain, ArrowRight, Sun } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { View } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: View) => void;
}

const statsData = [
  { label: 'Optimal Crops', value: '4', sub: 'in current season', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Avg Yield Index', value: '82%', sub: 'above regional avg', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pest Alerts', value: '2', sub: 'active warnings', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Soil Health', value: 'Good', sub: 'pH 6.2 – optimal', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const weatherSample = {
  city: 'Sample Location',
  temp: 28,
  humidity: 65,
  rainfall: 12,
  wind: 14,
  condition: 'Partly Cloudy',
  uvIndex: 6,
};

const alerts = [
  { title: 'Brown Planthopper Risk', crop: 'Rice', severity: 'high' as const, desc: 'High humidity favors infestation. Scout fields immediately.' },
  { title: 'Early Blight Warning', crop: 'Tomato', severity: 'medium' as const, desc: 'Temperature fluctuations increase blight risk this week.' },
  { title: 'Nitrogen Deficiency', crop: 'Maize', severity: 'medium' as const, desc: 'Yellowing leaves observed. Consider top-dress application.' },
];

const soilTips = [
  { title: 'Add Organic Matter', desc: 'Apply 3–5 tons/ha of compost before the next crop cycle to improve structure.', icon: '🌿' },
  { title: 'Check Drainage', desc: 'Waterlogged fields reduce oxygen availability. Ensure field bunds are intact.', icon: '💧' },
  { title: 'Soil pH Testing', desc: 'Test soil pH every 2 seasons. Most crops thrive between pH 6.0–7.0.', icon: '🧪' },
  { title: 'Cover Cropping', desc: 'Plant legumes between seasons to fix nitrogen and prevent erosion.', icon: '🌱' },
];

const quickCrops = [
  { id: 'rice', name: 'Rice', emoji: '🌾', season: 'Kharif', status: 'In season' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', season: 'Year-round', status: 'Optimal' },
  { id: 'maize', name: 'Maize', emoji: '🌽', season: 'Kharif', status: 'In season' },
  { id: 'wheat', name: 'Wheat', emoji: '🌾', season: 'Rabi', status: 'Off season' },
];

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#0f2417] to-[#1a3d26] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-green-400 text-sm font-medium mb-1">Welcome back, Farmer</p>
            <h2 className="text-2xl font-bold mb-2">Smart Farming Advisor</h2>
            <p className="text-white/70 text-sm max-w-md">
              Get AI-powered recommendations for irrigation, fertilizers, and pest control tailored to your crops and local conditions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('advisor')}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 whitespace-nowrap self-start md:self-auto"
          >
            <Sprout size={16} />
            Start Crop Advisor
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Weather Overview</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">Sample Data</span>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Sun size={28} className="text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{weatherSample.temp}°C</p>
              <p className="text-sm text-gray-500">{weatherSample.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Droplets, label: 'Humidity', value: `${weatherSample.humidity}%`, color: 'text-blue-500' },
              { icon: CloudRain, label: 'Rainfall', value: `${weatherSample.rainfall}mm`, color: 'text-blue-400' },
              { icon: Wind, label: 'Wind', value: `${weatherSample.wind} km/h`, color: 'text-gray-400' },
              { icon: Sun, label: 'UV Index', value: `${weatherSample.uvIndex} / 10`, color: 'text-amber-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={13} className={color} />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Use Crop Advisor to enter your actual location</p>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              Active Alerts
            </h3>
            <Badge label={`${alerts.length} Active`} variant="medium" />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-100'
                    : 'bg-amber-50 border-amber-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alert.severity === 'high' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <AlertTriangle size={14} className={alert.severity === 'high' ? 'text-red-600' : 'text-amber-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                    <Badge label={alert.crop} variant="info" />
                  </div>
                  <p className="text-xs text-gray-600">{alert.desc}</p>
                </div>
                <Badge label={alert.severity} variant={alert.severity} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Soil Health Tips</h3>
          </div>
          <div className="space-y-3">
            {soilTips.map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Quick Crop Status</h3>
            <button
              onClick={() => onNavigate('advisor')}
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              Get advice <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {quickCrops.map((crop) => (
              <div key={crop.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50/30 transition-colors cursor-pointer" onClick={() => onNavigate('advisor')}>
                <span className="text-2xl">{crop.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{crop.name}</p>
                  <p className="text-xs text-gray-400">{crop.season}</p>
                </div>
                <Badge
                  label={crop.status}
                  variant={crop.status === 'In season' || crop.status === 'Optimal' ? 'success' : 'medium'}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('advisor')}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm py-3 rounded-xl border border-green-200 transition-colors"
          >
            <Sprout size={15} />
            Open Crop Advisor
          </button>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Season Calendar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { season: 'Kharif', months: 'Jun – Nov', crops: 'Rice, Maize, Cotton, Soybean', color: 'bg-green-50 border-green-200 text-green-700' },
            { season: 'Rabi', months: 'Oct – Mar', crops: 'Wheat, Potato, Mustard, Pea', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { season: 'Zaid', months: 'Mar – Jun', crops: 'Cucumber, Watermelon, Vegetables', color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { season: 'Year-round', months: 'All seasons', crops: 'Tomato, Onion, Garlic, Ginger', color: 'bg-rose-50 border-rose-200 text-rose-700' },
          ].map((s) => (
            <div key={s.season} className={`p-4 rounded-xl border ${s.color}`}>
              <p className="font-bold text-sm">{s.season}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.months}</p>
              <p className="text-xs mt-2 opacity-80 leading-relaxed">{s.crops}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
