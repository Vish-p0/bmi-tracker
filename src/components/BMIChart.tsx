import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BMIChartProps {
  currentBMI?: number;
}

export const BMIChart: React.FC<BMIChartProps> = ({ currentBMI }) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const data = {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
    datasets: [
      {
        label: 'BMI Range',
        data: [18.5, 24.9, 29.9, 40],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // Blue for underweight
          'rgba(34, 197, 94, 0.6)',  // Green for normal
          'rgba(245, 158, 11, 0.6)', // Yellow for overweight
          'rgba(239, 68, 68, 0.6)',  // Red for obese
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'BMI Categories',
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
            const ranges = [
              'BMI < 18.5',
              'BMI 18.5-24.9',
              'BMI 25-29.9',
              'BMI ≥ 30'
            ];
            return ranges[context.dataIndex];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 45,
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
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Exo 2',
            weight: 'bold',
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
  };

  // Add current BMI indicator
  useEffect(() => {
    if (currentBMI && chartRef.current) {
      const chart = chartRef.current;
      
      // Add annotation plugin manually since we're adding a line
      const originalDraw = chart.draw;
      chart.draw = function() {
        originalDraw.call(this);
        
        const ctx = this.ctx;
        const chartArea = this.chartArea;
        
        // Calculate position for current BMI line
        const yScale = this.scales.y;
        const yPosition = yScale.getPixelForValue(currentBMI);
        
        if (yPosition >= chartArea.top && yPosition <= chartArea.bottom) {
          ctx.save();
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          
          ctx.beginPath();
          ctx.moveTo(chartArea.left, yPosition);
          ctx.lineTo(chartArea.right, yPosition);
          ctx.stroke();
          
          // Add label
          ctx.fillStyle = '#00d4ff';
          ctx.font = 'bold 12px Orbitron';
          ctx.fillText(`Your BMI: ${currentBMI}`, chartArea.left + 10, yPosition - 10);
          
          ctx.restore();
        }
      };
    }
  }, [currentBMI]);

  return (
    <Card className="glass-card neon-glow animate-scale-in">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-orbitron font-semibold text-primary">
            BMI Reference Chart
          </h3>
          <p className="text-sm text-muted-foreground">
            WHO Standard BMI Categories
          </p>
        </div>
        
        <div className="h-80">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Underweight: &lt; 18.5</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Normal: 18.5-24.9</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Overweight: 25-29.9</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Obese: ≥ 30</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};