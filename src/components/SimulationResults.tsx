import React from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { Share2, TrendingUp, ArrowUpRight, Percent } from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SimulationMetrics {
  successfulTrades: number;
  failedTrades: number;
  winRate: number;
  longestWinStreak: number;
  longestLossStreak: number;
  finalBalance: number;
  profitLoss: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  balanceHistory: number[];
  tradesPerDay: number[];
  winsPerDay: number[];
  lossesPerDay: number[];
  totalCashOut: number;
  cashOutHistory: { day: number; amount: number }[];
  currentDay: number;
}

interface SimulationResultsProps {
  metrics: SimulationMetrics;
  onShare: (imageUrl: string) => void;
}

// Mock market comparison data (to be replaced with real data)
const marketComparison = {
  averageRetailWinRate: 0.35, // 35% average win rate for retail traders
  bankInterestRate: 0.05, // 5% annual interest rate
  topPerformerThreshold: 0.85, // 85th percentile
};

export default function SimulationResults({ metrics, onShare }: SimulationResultsProps) {
  const { t } = useTranslation();
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (resultsRef.current) {
      try {
        const canvas = await html2canvas(resultsRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        
        const imageUrl = canvas.toDataURL('image/png');
        onShare(imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const chartData = {
    labels: Array.from({ length: metrics.balanceHistory.length }, (_, i) => `Day ${i}`),
    datasets: [
      {
        label: t('metrics.balance'),
        data: metrics.balanceHistory,
        borderColor: 'rgb(79, 70, 229)', // Indigo 600
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.1,
        fill: true,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Balance History - Day ${metrics.currentDay} of 365`,
        color: '#1F2937',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
        padding: 16,
        boxPadding: 8,
        usePointStyle: true,
        callbacks: {
          title: (context: any) => {
            return `Day ${context[0].label.split(' ')[1]}`;
          },
          label: (context: any) => {
            const dayIndex = parseInt(context.label.split(' ')[1]);
            return [
              `Balance: $${context.raw.toFixed(2)}`,
              `Trades: ${metrics.tradesPerDay[dayIndex]}`,
              `Wins: ${metrics.winsPerDay[dayIndex]}`,
              `Losses: ${metrics.lossesPerDay[dayIndex]}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 12,
          callback: (value: any, index: number) => {
            const day = parseInt(chartData.labels[index].split(' ')[1]);
            return `Day ${day}`;
          }
        }
      }
    }
  };

  // Calculate performance metrics
  const totalTrades = metrics.successfulTrades + metrics.failedTrades;
  const profitFactor = metrics.averageWin * metrics.successfulTrades / (metrics.averageLoss * metrics.failedTrades);
  const expectancy = (metrics.averageWin * metrics.winRate) - (metrics.averageLoss * (1 - metrics.winRate));
  const annualReturn = ((metrics.finalBalance + metrics.totalCashOut) / metrics.balanceHistory[0] - 1) * 100;

  return (
    <div ref={resultsRef} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{t('results.title')}</h2>
        <button
          onClick={handleShare}
          className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t('share.button')}
        </button>
      </div>

      {/* Final Balance Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-1">Final Portfolio Value</p>
            <h3 className="text-3xl font-bold">${(metrics.finalBalance + metrics.totalCashOut).toLocaleString()}</h3>
            <p className="text-indigo-100 mt-1">
              Initial: ${metrics.balanceHistory[0].toLocaleString()} | Return: {annualReturn.toFixed(2)}%
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-indigo-200" />
        </div>
      </div>

      <div className="h-[400px] mb-8">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Market Comparison */}
      {metrics.currentDay === 365 && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <ArrowUpRight className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Win Rate Comparison</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {metrics.winRate > marketComparison.averageRetailWinRate ? 'Above' : 'Below'} Average
                </p>
                <p className="text-xs text-gray-500">Retail trader average: 35%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">vs Bank Interest</p>
                <p className="text-lg font-semibold text-blue-600">
                  {annualReturn > (marketComparison.bankInterestRate * 100) ? 
                    `${(annualReturn / (marketComparison.bankInterestRate * 100)).toFixed(1)}x Better` : 
                    'Below Rate'}
                </p>
                <p className="text-xs text-gray-500">Annual bank rate: 5%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance Ranking</p>
                <p className="text-lg font-semibold text-purple-600">
                  Top {metrics.winRate > marketComparison.topPerformerThreshold ? '15%' : '50%'}
                </p>
                <p className="text-xs text-gray-500">Of retail traders</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Trading Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Win Rate"
              value={`${(metrics.winRate * 100).toFixed(2)}%`}
              description="Percentage of successful trades"
              type="primary"
            />
            <MetricCard
              title="Profit Factor"
              value={profitFactor.toFixed(2)}
              description="Ratio of total gains to total losses"
              type="success"
            />
            <MetricCard
              title="Expectancy"
              value={`$${expectancy.toFixed(2)}`}
              description="Average expected profit per trade"
              type="info"
            />
            <MetricCard
              title="Total Trades"
              value={totalTrades}
              description="Number of trades executed"
              type="warning"
            />
          </div>
        </div>

        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Risk Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Max Drawdown"
              value={`${(metrics.maxDrawdown * 100).toFixed(2)}%`}
              description="Largest peak-to-trough decline"
              type="danger"
            />
            <MetricCard
              title="Average Win"
              value={`$${metrics.averageWin.toFixed(2)}`}
              description="Average profit per winning trade"
              type="success"
            />
            <MetricCard
              title="Average Loss"
              value={`$${metrics.averageLoss.toFixed(2)}`}
              description="Average loss per losing trade"
              type="danger"
            />
            <MetricCard
              title="Total Cash Out"
              value={`$${metrics.totalCashOut.toFixed(2)}`}
              description="Total profits realized"
              type="info"
            />
          </div>
        </div>

        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Streak Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Longest Win Streak"
              value={metrics.longestWinStreak}
              description="Most consecutive winning trades"
              type="success"
            />
            <MetricCard
              title="Longest Loss Streak"
              value={metrics.longestLossStreak}
              description="Most consecutive losing trades"
              type="danger"
            />
          </div>
        </div>
      </div>

      {metrics.cashOutHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('metrics.cashOutHistory')}</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="space-y-2">
              {metrics.cashOutHistory.map((cashOut, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{t('metrics.cashOutDay', { day: cashOut.day })}</span>
                  <span className="font-medium text-indigo-600">${cashOut.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          istradinggambling.com
        </p>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  description, 
  type = 'primary' 
}: { 
  title: string; 
  value: string | number; 
  description: string;
  type?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
}) {
  const colors = {
    primary: 'from-indigo-50 to-blue-50 border-indigo-100',
    success: 'from-emerald-50 to-green-50 border-emerald-100',
    danger: 'from-red-50 to-rose-50 border-red-100',
    warning: 'from-amber-50 to-yellow-50 border-amber-100',
    info: 'from-sky-50 to-cyan-50 border-sky-100'
  };

  const textColors = {
    primary: 'text-indigo-600',
    success: 'text-emerald-600',
    danger: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-sky-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[type]} p-4 rounded-lg border`}>
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <p className={`mt-1 text-2xl font-semibold ${textColors[type]}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}