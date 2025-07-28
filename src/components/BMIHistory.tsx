import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Trash2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BMIData {
  value: number;
  date: string;
}

interface BMIHistoryProps {
  history: BMIData[];
  onClearHistory: () => void;
}

export const BMIHistory: React.FC<BMIHistoryProps> = ({ history, onClearHistory }) => {
  // Reverse history to show oldest to newest for the chart
  const chartHistory = [...history].reverse();

  const data = {
    labels: chartHistory.map((entry, index) => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }),
    datasets: [
      {
        label: 'BMI Trend',
        data: chartHistory.map(entry => entry.value),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#00ffff',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'BMI Progress Tracking',
        color: '#00d4ff',
        font: {
          family: 'Orbitron',
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: '#e2e8f0',
        borderColor: '#00d4ff',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `BMI: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.min(...chartHistory.map(e => e.value)) - 2,
        max: Math.max(...chartHistory.map(e => e.value)) + 2,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Exo 2',
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Exo 2',
          },
          maxRotation: 45,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getCategoryColor = (bmi: number): string => {
    if (bmi < 18.5) return 'text-blue-400';
    if (bmi < 25) return 'text-green-400';
    if (bmi < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="glass-card neon-glow animate-scale-in">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-orbitron font-semibold text-primary">
              BMI History
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your progress over time
            </p>
          </div>
          <Button
            onClick={onClearHistory}
            variant="outline"
            size="sm"
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="h-64">
          <Line data={data} options={options} />
        </div>

        {/* Recent Entries List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-accent">Recent Calculations</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.slice(0, 5).map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold text-primary">
                    {entry.value}
                  </div>
                  <div className={`text-sm font-medium ${getCategoryColor(entry.value)}`}>
                    {getBMICategory(entry.value)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        {history.length > 1 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Trend</div>
              <div className={`font-semibold ${
                history[0].value > history[history.length - 1].value 
                  ? 'text-green-400' 
                  : history[0].value < history[history.length - 1].value
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}>
                {history[0].value > history[history.length - 1].value 
                  ? '↓ Decreasing' 
                  : history[0].value < history[history.length - 1].value
                  ? '↑ Increasing'
                  : '→ Stable'
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Entries</div>
              <div className="font-semibold text-primary">{history.length}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};