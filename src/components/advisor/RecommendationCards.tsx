import { Droplets, Leaf, Bug, Lightbulb, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Recommendations } from '../../types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface RecommendationCardsProps {
  recommendations: Recommendations;
  cropName: string;
  temperature: number;
  humidity: number;
}

export default function RecommendationCards({ recommendations, cropName, temperature, humidity }: RecommendationCardsProps) {
  const { irrigation, fertilizer, pestControl, generalTips, cropData } = recommendations;

  const [minTemp, maxTemp] = cropData.idealTemp;
  const [minHum, maxHum] = cropData.idealHumidity;
  const tempPct = Math.min(100, Math.max(0, ((temperature - minTemp) / (maxTemp - minTemp)) * 100));
  const humPct = Math.min(100, Math.max(0, ((humidity - minHum) / (maxHum - minHum)) * 100));

  const tempStatus = temperature < minTemp ? 'low' : temperature > maxTemp ? 'high' : 'optimal';
  const humStatus = humidity < minHum ? 'low' : humidity > maxHum ? 'high' : 'optimal';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
            <span className="text-red-400">🌡</span> Temperature Suitability
          </p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">{temperature}°C</span>
            <Badge label={tempStatus === 'optimal' ? 'Optimal' : tempStatus === 'high' ? 'Too Hot' : 'Too Cold'} variant={tempStatus === 'optimal' ? 'success' : tempStatus === 'high' ? 'high' : 'medium'} />
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${tempStatus === 'optimal' ? 'bg-green-500' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(100, Math.max(5, tempPct))}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Ideal range: {minTemp}–{maxTemp}°C for {cropName}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
            <span>💧</span> Humidity Suitability
          </p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">{humidity}%</span>
            <Badge label={humStatus === 'optimal' ? 'Optimal' : humStatus === 'high' ? 'Too Humid' : 'Too Dry'} variant={humStatus === 'optimal' ? 'success' : humStatus === 'high' ? 'high' : 'medium'} />
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${humStatus === 'optimal' ? 'bg-blue-500' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(100, Math.max(5, humPct))}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Ideal range: {minHum}–{maxHum}% for {cropName}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <Droplets size={15} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Irrigation Advice</h4>
          </div>
          <div className="space-y-2.5 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Frequency</span>
              <span className="font-semibold text-gray-800">{irrigation.frequency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-gray-800">{irrigation.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Method</span>
              <span className="font-semibold text-gray-800 text-right max-w-[60%]">{irrigation.method}</span>
            </div>
          </div>
          <div className="border-t border-gray-50 pt-3 space-y-2">
            {irrigation.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
              <Leaf size={15} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Fertilizer Plan</h4>
          </div>
          <div className="bg-green-50 rounded-xl p-3 mb-3 border border-green-100">
            <p className="text-xs text-green-600 font-medium mb-0.5">NPK Recommendation</p>
            <p className="text-sm font-bold text-green-800 font-mono">{fertilizer.npkRatio}</p>
          </div>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">{fertilizer.schedule}</p>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Organic Options</p>
            <div className="flex flex-wrap gap-1.5">
              {fertilizer.organicOptions.map((opt, i) => (
                <span key={i} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">{opt}</span>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-50 mt-3 pt-3 space-y-2">
            {fertilizer.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              pestControl.riskLevel === 'high' ? 'bg-red-50' : pestControl.riskLevel === 'medium' ? 'bg-amber-50' : 'bg-green-50'
            }`}>
              <Bug size={15} className={
                pestControl.riskLevel === 'high' ? 'text-red-600' : pestControl.riskLevel === 'medium' ? 'text-amber-600' : 'text-green-600'
              } />
            </div>
            <h4 className="font-semibold text-gray-900">Pest & Disease Management</h4>
          </div>
          <Badge
            label={`${pestControl.riskLevel.toUpperCase()} RISK`}
            variant={pestControl.riskLevel}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><AlertTriangle size={11} className="text-amber-500" /> Current Threats</p>
            <div className="space-y-1.5">
              {pestControl.currentThreats.map((pest, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-red-50 px-2.5 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {pest}
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-gray-500 mb-2 mt-3 flex items-center gap-1"><AlertTriangle size={11} className="text-orange-500" /> Disease Risks</p>
            <div className="space-y-1.5">
              {pestControl.diseases.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-orange-50 px-2.5 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><CheckCircle size={11} className="text-green-500" /> Prevention</p>
            <div className="space-y-2">
              {pestControl.preventions.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={11} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><Leaf size={11} className="text-blue-500" /> Treatment Options</p>
            <div className="space-y-2">
              {pestControl.treatments.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Info size={11} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
            <Lightbulb size={15} className="text-amber-600" />
          </div>
          <h4 className="font-semibold text-gray-900">General Farming Tips</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {generalTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-amber-50/50 border border-amber-100 rounded-xl p-3">
              <span className="text-amber-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
              <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">Crop Growth Stages</p>
          <div className="flex items-center gap-1 flex-wrap">
            {cropData.growthStages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1">
                <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full">{stage}</span>
                {i < cropData.growthStages.length - 1 && <span className="text-gray-300 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
