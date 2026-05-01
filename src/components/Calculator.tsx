'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Slider from './Slider';
import CoreHoldings, { Holding } from './CoreHoldings';
import { calculateBreakeven, CalculationInputs } from '../lib/mathEngine';

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    homePrice: 500000,
    downPaymentPercent: 20,
    expectedMarketReturn: 7,
    maintenanceCostPercent: 1.5,
    propertyAppreciation: 3,
    rentGrowth: 2,
    monthlyRent: 2500,
  });

  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', ticker: 'VOO', allocation: 80 },
    { id: '2', ticker: 'BND', allocation: 20 }
  ]);

  // Derive the expected market return based on core holdings (Dummy implementation: average market return roughly scaled by allocation if we had per-ticker returns. For MVP, we just use the expectedMarketReturn slider or let holdings influence it later. We will stick to using the slider for the base math for now, but keep the holdings in UI as requested by PM)
  // To integrate the two, let's say the slider is the main driver.

  const handleInputChange = (key: keyof CalculationInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results = useMemo(() => calculateBreakeven(inputs), [inputs]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Left Column: Inputs */}
      <div className="lg:col-span-2 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Slider
              label="Home Price"
              value={inputs.homePrice}
              min={100000}
              max={2000000}
              step={10000}
              unit="$"
              onChange={(val) => handleInputChange('homePrice', val)}
            />
            <Slider
              label="Monthly Rent (Comparable)"
              value={inputs.monthlyRent}
              min={500}
              max={10000}
              step={100}
              unit="$"
              onChange={(val) => handleInputChange('monthlyRent', val)}
            />
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assumptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Slider
              label="Down Payment"
              value={inputs.downPaymentPercent}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(val) => handleInputChange('downPaymentPercent', val)}
            />
            <Slider
              label="Property Appreciation"
              value={inputs.propertyAppreciation}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              onChange={(val) => handleInputChange('propertyAppreciation', val)}
            />
            <Slider
              label="Maintenance Cost / Year"
              value={inputs.maintenanceCostPercent}
              min={0}
              max={5}
              step={0.1}
              unit="%"
              description="Percent of home value"
              onChange={(val) => handleInputChange('maintenanceCostPercent', val)}
            />
            <Slider
              label="Rent Growth / Year"
              value={inputs.rentGrowth}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              onChange={(val) => handleInputChange('rentGrowth', val)}
            />
            <Slider
              label="Expected Market Return"
              value={inputs.expectedMarketReturn}
              min={0}
              max={15}
              step={0.1}
              unit="%"
              onChange={(val) => handleInputChange('expectedMarketReturn', val)}
            />
          </div>
        </div>

        <div className="border-t pt-8">
          <CoreHoldings holdings={holdings} onChange={setHoldings} />
        </div>
      </div>

      {/* Right Column: Results Dashboard */}
      <div className="lg:col-span-1">
        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg sticky top-8">
          <h2 className="text-xl font-semibold mb-6 text-blue-100">Analysis Results</h2>

          <div className="mb-8">
            <p className="text-sm text-blue-200 mb-1">Breakeven Year</p>
            <div className="text-5xl font-bold">
              {results.breakevenYear ? `Year ${results.breakevenYear}` : 'Never'}
            </div>
            <p className="text-xs text-blue-300 mt-2">
              When buying becomes financially optimal.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-blue-800/50 rounded-xl">
              <p className="text-sm text-blue-200 mb-1">Homeowner Net Worth (Year 30)</p>
              <div className="text-2xl font-bold text-green-400">
                ${results.homeownerNetWorth.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-blue-800/50 rounded-xl">
              <p className="text-sm text-blue-200 mb-1">Renter Net Worth (Year 30)</p>
              <div className="text-2xl font-bold text-blue-300">
                ${results.renterNetWorth.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
