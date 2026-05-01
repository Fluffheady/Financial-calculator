"use client";

import React, { useState, useMemo } from 'react';
import { generateSimulationData } from '@/utils/simulator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

export default function InvestorDashboard() {
  const [homePrice, setHomePrice] = useState(500000);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [marketReturnRate, setMarketReturnRate] = useState(0.07);

  const simulationData = useMemo(() => {
    return generateSimulationData({
      homePrice,
      monthlyRent,
      marketReturnRate,
      homeAppreciationRate: 0.03,
      downPaymentPercent: 0.2
    });
  }, [homePrice, monthlyRent, marketReturnRate]);

  const breakevenYear = simulationData.find(d => d.isBreakeven)?.year || 'Never';
  const finalYear = simulationData[simulationData.length - 1];

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Investor Dashboard: Rent vs Buy</h1>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg dark:bg-gray-800">
        <div>
          <label className="block text-sm font-medium mb-2">Home Price: {formatter.format(homePrice)}</label>
          <input
            type="range"
            min={100000}
            max={2000000}
            step={10000}
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Rent: {formatter.format(monthlyRent)}</label>
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Market Return: {(marketReturnRate * 100).toFixed(1)}%</label>
          <input
            type="range"
            min={0.01}
            max={0.15}
            step={0.01}
            value={marketReturnRate}
            onChange={(e) => setMarketReturnRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Breakeven Year</h3>
          <p className="text-3xl font-bold text-blue-600">Year {breakevenYear}</p>
          <p className="text-sm mt-2 text-gray-500">When buying beats renting</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Homeowner Net Worth (Yr 30)</h3>
          <p className="text-3xl font-bold text-green-600">{formatter.format(finalYear?.homeNetWorth || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border dark:bg-gray-900 dark:border-gray-700">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Renter Net Worth (Yr 30)</h3>
          <p className="text-3xl font-bold text-purple-600">{formatter.format(finalYear?.renterNetWorth || 0)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow border h-[500px] dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4">30-Year Net Worth Projection</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simulationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'bottom' }} />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={80}
            />
            <Tooltip
              formatter={(value: unknown) => formatter.format(Number(value))}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="homeNetWorth"
              name="Homeowner Net Worth"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="renterNetWorth"
              name="Renter/Investor Net Worth"
              stroke="#9333ea"
              strokeWidth={3}
              dot={false}
            />
            {typeof breakevenYear === 'number' && (
              <ReferenceDot
                x={breakevenYear}
                y={simulationData[breakevenYear - 1].homeNetWorth}
                r={6}
                fill="#2563eb"
                stroke="white"
                strokeWidth={2}
                label={{ position: "top", value: "Breakeven" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
