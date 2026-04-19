import { useState } from 'react';
import { Sprout, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { Crop, WeatherInput, Recommendations, ChatMessage } from '../../types';
import CropSelector from './CropSelector';
import WeatherInputForm from './WeatherInput';
import RecommendationCards from './RecommendationCards';
import AiChat from './AiChat';
import Card from '../ui/Card';
import { fetchRecommendations, buildInitialMessages } from '../../lib/api';

const defaultWeather: WeatherInput = {
  location: '',
  temperature: 28,
  humidity: 65,
  rainfall: 10,
  windSpeed: 12,
  soilType: 'loamy',
  season: 'summer',
};

type Step = 'select' | 'configure' | 'results';

export default function AdvisorView() {
  const [step, setStep] = useState<Step>('select');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [weather, setWeather] = useState<WeatherInput>(defaultWeather);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [sessionRecordId, setSessionRecordId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'chat'>('recommendations');

  async function handleGetRecommendations() {
    if (!selectedCrop) return;
    setLoading(true);
    setError(null);
    try {
      const { recommendations: recs, sessionRecordId: sid } = await fetchRecommendations(
        selectedCrop.id,
        selectedCrop.name,
        weather
      );
      setRecommendations(recs);
      setSessionRecordId(sid);
      setChatMessages(buildInitialMessages(selectedCrop.name, weather));
      setStep('results');
    } catch {
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep('select');
    setSelectedCrop(null);
    setWeather(defaultWeather);
    setRecommendations(null);
    setSessionRecordId(null);
    setChatMessages([]);
    setError(null);
  }

  if (step === 'results' && recommendations && selectedCrop) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedCrop.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedCrop.name} Recommendations</h2>
              <p className="text-sm text-gray-500">
                {weather.location || 'Custom location'} · {weather.temperature}°C · {weather.humidity}% humidity
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-colors"
          >
            <RotateCcw size={14} />
            New Query
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-100">
          {(['recommendations', 'chat'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'recommendations' ? 'Farming Advice' : 'AI Advisor Chat'}
            </button>
          ))}
        </div>

        {activeTab === 'recommendations' ? (
          <RecommendationCards
            recommendations={recommendations}
            cropName={selectedCrop.name}
            temperature={weather.temperature}
            humidity={weather.humidity}
          />
        ) : (
          <AiChat
            cropId={selectedCrop.id}
            cropName={selectedCrop.name}
            temperature={weather.temperature}
            humidity={weather.humidity}
            farmingSessionId={sessionRecordId}
            messages={chatMessages}
            onMessagesChange={setChatMessages}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-2 text-sm">
        {(['select', 'configure'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              step === s
                ? 'bg-green-500 text-white border-green-500'
                : i === 0 && step === 'configure'
                ? 'bg-green-50 text-green-700 border-green-200 cursor-pointer'
                : 'bg-gray-50 text-gray-400 border-gray-100'
            }`}
            onClick={() => i === 0 && step === 'configure' && setStep('select')}
            >
              <span>{i + 1}</span>
              <span>{s === 'select' ? 'Select Crop' : 'Set Conditions'}</span>
            </div>
            {i < 1 && <ChevronRight size={14} className="text-gray-300" />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 'select' ? (
          <>
            <CropSelector selectedCrop={selectedCrop} onSelect={setSelectedCrop} />
            {selectedCrop && (
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedCrop.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedCrop.name} selected</p>
                    <p className="text-xs text-gray-500">{selectedCrop.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep('configure')}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-green-500/30"
                >
                  Next: Set Conditions
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <WeatherInputForm weather={weather} onChange={setWeather} />
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setStep('select')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                Back to crop selection
              </button>
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-green-500/30 disabled:shadow-none"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Sprout size={15} /> Get Recommendations</>
                )}
              </button>
            </div>
          </>
        )}
      </Card>

      {step === 'select' && !selectedCrop && (
        <div className="text-center py-8 text-gray-400">
          <Sprout size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a crop above to get started with personalized farming advice.</p>
        </div>
      )}
    </div>
  );
}
