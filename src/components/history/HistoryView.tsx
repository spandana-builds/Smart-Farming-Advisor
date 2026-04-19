import { useState, useEffect } from 'react';
import { Clock, MapPin, Thermometer, Droplets, Sprout, Loader2, RefreshCw, Leaf } from 'lucide-react';
import { FarmingSession } from '../../types';
import { fetchHistory } from '../../lib/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { crops } from '../../data/crops';

function getCropEmoji(cropId: string): string {
  return crops.find((c) => c.id === cropId)?.emoji ?? '🌱';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getPestRisk(humidity: number, temp: number): 'low' | 'medium' | 'high' {
  if (humidity > 80 && temp > 25) return 'high';
  if (humidity > 65) return 'medium';
  return 'low';
}

export default function HistoryView() {
  const [sessions, setSessions] = useState<FarmingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory();
      setSessions(data);
    } catch {
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin text-green-500" />
          <span className="text-sm">Loading your session history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button onClick={load} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 mx-auto">
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No sessions yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Use the Crop Advisor to get farming recommendations. Your sessions will be saved here for future reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{sessions.length} advisory session{sessions.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sessions.map((session) => {
          const pestRisk = getPestRisk(session.humidity, session.temperature);
          return (
            <Card key={session.id} className="p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                    {getCropEmoji(session.crop_id)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{session.crop_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{session.season} season</p>
                  </div>
                </div>
                <Badge label={`${pestRisk} risk`} variant={pestRisk} />
              </div>

              <div className="space-y-2 mb-4">
                {session.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={13} className="text-gray-400" />
                    <span>{session.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Thermometer size={13} className="text-red-400" />
                    <span>{session.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Droplets size={13} className="text-blue-400" />
                    <span>{session.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Sprout size={13} className="text-green-500" />
                    <span className="capitalize">{session.soil_type}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={11} />
                  <span>{formatDate(session.created_at)}</span>
                </div>
                {session.rainfall > 0 && (
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                    {session.rainfall}mm rain
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
