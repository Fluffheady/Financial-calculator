'use client';

import React, { useState } from 'react';

export interface Holding {
  id: string;
  ticker: string;
  allocation: number; // Percentage
}

interface CoreHoldingsProps {
  holdings: Holding[];
  onChange: (holdings: Holding[]) => void;
}

export default function CoreHoldings({ holdings, onChange }: CoreHoldingsProps) {
  const [newTicker, setNewTicker] = useState('');
  const [newAllocation, setNewAllocation] = useState<number>(0);

  const totalAllocation = holdings.reduce((sum, h) => sum + h.allocation, 0);

  const handleAddHolding = () => {
    if (!newTicker.trim()) return;
    if (totalAllocation + newAllocation > 100) {
      alert("Total allocation cannot exceed 100%");
      return;
    }

    const newHolding: Holding = {
      id: Math.random().toString(36).substring(7),
      ticker: newTicker.toUpperCase(),
      allocation: newAllocation,
    };

    onChange([...holdings, newHolding]);
    setNewTicker('');
    setNewAllocation(0);
  };

  const handleRemoveHolding = (id: string) => {
    onChange(holdings.filter((h) => h.id !== id));
  };

  const handleAllocationChange = (id: string, newAlloc: number) => {
    const holdingToUpdate = holdings.find(h => h.id === id);
    if (!holdingToUpdate) return;

    const otherAllocation = totalAllocation - holdingToUpdate.allocation;
    if (otherAllocation + newAlloc > 100) {
      newAlloc = 100 - otherAllocation;
    }

    onChange(
      holdings.map((h) => (h.id === id ? { ...h, allocation: newAlloc } : h))
    );
  };

  return (
    <div className="flex flex-col space-y-4 py-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Core Holdings</h3>
        <span className={`text-sm font-bold ${totalAllocation > 100 ? 'text-red-600' : totalAllocation === 100 ? 'text-green-600' : 'text-blue-600'}`}>
          Total Allocation: {totalAllocation}%
        </span>
      </div>

      <div className="space-y-3">
        {holdings.map((holding) => (
          <div key={holding.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border">
            <div className="font-bold text-gray-700 w-20">{holding.ticker}</div>
            <div className="flex-grow flex items-center space-x-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={holding.allocation}
                onChange={(e) => handleAllocationChange(holding.id, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-medium w-12 text-right">{holding.allocation}%</span>
            </div>
            <button
              onClick={() => handleRemoveHolding(holding.id)}
              className="text-red-500 hover:text-red-700 font-medium px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {totalAllocation < 100 && (
        <div className="flex items-end space-x-4 mt-4 pt-4 border-t">
          <div className="flex-grow">
            <label className="block text-xs text-gray-500 mb-1">Ticker</label>
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="e.g. VOO"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs text-gray-500 mb-1">Allocation %</label>
            <input
              type="number"
              min={0}
              max={100 - totalAllocation}
              value={newAllocation}
              onChange={(e) => setNewAllocation(parseFloat(e.target.value) || 0)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddHolding}
            disabled={!newTicker || newAllocation <= 0 || totalAllocation + newAllocation > 100}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
