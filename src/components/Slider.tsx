import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: '%' | '$' | 'years';
  onChange: (value: number) => void;
  description?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  description
}: SliderProps) {

  const displayValue = unit === '$' ? `$${value.toLocaleString()}` : unit === '%' ? `${value}%` : unit === 'years' ? `${value} years` : value;

  return (
    <div className="flex flex-col space-y-2 py-3 w-full">
      <div className="flex justify-between items-center">
        <div>
          <label className="text-sm font-semibold text-gray-800">{label}</label>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {displayValue}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />

      <div className="flex justify-between text-xs text-gray-400">
        <span>{unit === '$' ? `$${min.toLocaleString()}` : unit === '%' ? `${min}%` : min}</span>
        <span>{unit === '$' ? `$${max.toLocaleString()}` : unit === '%' ? `${max}%` : max}</span>
      </div>
    </div>
  );
}
