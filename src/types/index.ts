export interface Crop {
  id: string;
  name: string;
  category: string;
  emoji: string;
  waterNeeds: 'low' | 'medium' | 'high';
  growingSeason: string;
  soilTypes: string[];
  description: string;
}

export interface WeatherInput {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  soilType: string;
  season: string;
}

export interface IrrigationAdvice {
  frequency: string;
  amount: string;
  method: string;
  tips: string[];
}

export interface FertilizerAdvice {
  npkRatio: string;
  schedule: string;
  organicOptions: string[];
  tips: string[];
}

export interface PestAdvice {
  riskLevel: 'low' | 'medium' | 'high';
  currentThreats: string[];
  diseases: string[];
  preventions: string[];
  treatments: string[];
}

export interface Recommendations {
  irrigation: IrrigationAdvice;
  fertilizer: FertilizerAdvice;
  pestControl: PestAdvice;
  generalTips: string[];
  cropData: {
    idealTemp: [number, number];
    idealHumidity: [number, number];
    soilPH: string;
    growthStages: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FarmingSession {
  id: string;
  session_id: string;
  crop_name: string;
  crop_id: string;
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  soil_type: string;
  season: string;
  created_at: string;
}

export type View = 'dashboard' | 'advisor' | 'history';
