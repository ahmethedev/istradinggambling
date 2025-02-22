import React from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { Share2 } from 'lucide-react';
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
  currentDay: number;
}

interface SimulationResultsProps {
  metrics: SimulationMetrics;
  onShare: (imageUrl: string) => void;
}

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
        label: t('metrics.finalBalance'),
        data: metrics.balanceHistory,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Balance History - Day ${metrics.currentDay} of 365`,
        color: '#1F2937'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Balance: $${context.raw.toFixed(2)}`
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
          callback: (value: any) => `$${value}`
        }
      },
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          maxTicksLimit: 10
        }
      }
    }
  };

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

      <div className="h-[400px] mb-8">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title={t('metrics.successfulTrades')}
          value={metrics.successfulTrades}
        />
        <MetricCard
          title={t('metrics.failedTrades')}
          value={metrics.failedTrades}
        />
        <MetricCard
          title={t('metrics.winRate')}
          value={`${(metrics.winRate * 100).toFixed(2)}%`}
        />
        <MetricCard
          title={t('metrics.longestWinStreak')}
          value={metrics.longestWinStreak}
        />
        <MetricCard
          title={t('metrics.longestLossStreak')}
          value={metrics.longestLossStreak}
        />
        <MetricCard
          title={t('metrics.finalBalance')}
          value={`$${metrics.finalBalance.toFixed(2)}`}
        />
        <MetricCard
          title={t('metrics.profitLoss')}
          value={`$${metrics.profitLoss.toFixed(2)}`}
          className={metrics.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <MetricCard
          title={t('metrics.maxDrawdown')}
          value={`${(metrics.maxDrawdown * 100).toFixed(2)}%`}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          istradinggamble.com
        </p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, className = '' }: { title: string; value: string | number; className?: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <p className={`mt-1 text-2xl font-semibold ${className}`}>{value}</p>
    </div>
  );
}