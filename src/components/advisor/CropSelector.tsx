import { Check } from 'lucide-react';
import { Crop } from '../../types';
import { crops } from '../../data/crops';

interface CropSelectorProps {
  selectedCrop: Crop | null;
  onSelect: (crop: Crop) => void;
}

export default function CropSelector({ selectedCrop, onSelect }: CropSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Your Crop</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {crops.map((crop) => {
          const isSelected = selectedCrop?.id === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => onSelect(crop)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5
                ${isSelected
                  ? 'border-green-500 bg-green-50 shadow-md shadow-green-100'
                  : 'border-gray-100 bg-white hover:border-green-200'}
              `}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
              )}
              <span className="text-3xl block mb-2">{crop.emoji}</span>
              <p className={`text-sm font-semibold ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>
                {crop.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{crop.category}</p>
              <div className="mt-2">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  crop.waterNeeds === 'high' ? 'bg-blue-100 text-blue-600' :
                  crop.waterNeeds === 'medium' ? 'bg-cyan-100 text-cyan-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {crop.waterNeeds} water
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
