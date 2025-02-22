import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, FastForward } from 'lucide-react';

interface SimulationFormProps {
  onSubmit: (values: {
    balance: number;
    riskPercentage: number;
    riskReward: number;
    maxTrades: number;
  }) => void;
  onSpeedChange: (speed: number) => void;
  onPauseToggle: () => void;
  isRunning: boolean;
  speed: number;
}

export default function SimulationForm({ 
  onSubmit, 
  onSpeedChange, 
  onPauseToggle, 
  isRunning,
  speed 
}: SimulationFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = React.useState({
    balance: 1000,
    riskPercentage: 2,
    riskReward: 2,
    maxTrades: 3
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
            {t('balance')}
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="balance"
              min="100"
              value={values.balance}
              onChange={(e) => setValues({ ...values, balance: Number(e.target.value) })}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="riskPercentage" className="block text-sm font-medium text-gray-700">
            {t('riskPercentage')}
          </label>
          <div className="mt-1">
            <div className="relative">
              <input
                type="number"
                id="riskPercentage"
                min="0.1"
                max="10"
                step="0.1"
                value={values.riskPercentage}
                onChange={(e) => setValues({ ...values, riskPercentage: Number(e.target.value) })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-8"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">%</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t('riskAmount')}: ${(values.balance * (values.riskPercentage / 100)).toFixed(2)}
          </p>
        </div>

        <div>
          <label htmlFor="riskReward" className="block text-sm font-medium text-gray-700">
            {t('riskReward')}
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="riskReward"
              min="0.1"
              step="0.1"
              value={values.riskReward}
              onChange={(e) => setValues({ ...values, riskReward: Number(e.target.value) })}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxTrades" className="block text-sm font-medium text-gray-700">
            {t('maxTrades')}
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="maxTrades"
              min="1"
              max="10"
              value={values.maxTrades}
              onChange={(e) => setValues({ ...values, maxTrades: Number(e.target.value) })}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isRunning}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {t('simulate')}
          </button>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onPauseToggle}
                  className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? t('pause') : t('resume')}
                </button>
                <div className="flex items-center space-x-2">
                  <FastForward className="w-4 h-4 text-indigo-600" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}