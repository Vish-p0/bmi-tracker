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
    labels: ['Underweight\n< 18.5', 'Normal\n18.5-24.9', 'Overweight\n25-29.9', 'Obese\n≥ 30'],
    datasets: [
      {
        label: 'BMI Upper Limit',
        data: [18.5, 24.9, 29.9, 35],
        backgroundColor: [
          'hsl(207 90% 54% / 0.8)', // Soft blue
          'hsl(142 76% 36% / 0.8)', // Soft green
          'hsl(38 92% 50% / 0.8)',  // Soft orange
          'hsl(0 84% 60% / 0.8)',   // Soft red
        ],
        borderColor: [
          'hsl(207 90% 54%)',
          'hsl(142 76% 36%)',
          'hsl(38 92% 50%)',
          'hsl(0 84% 60%)',
        ],
        borderWidth: 1,
        borderRadius: 6,
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
        text: 'BMI Categories & Ranges',
        color: 'hsl(var(--foreground))',
        font: {
          family: 'system-ui',
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const category = context.label.split('\n')[0];
            return `${category}: Up to ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 40,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            family: 'system-ui',
          },
          callback: function(value) {
            return value + ' BMI';
          },
        },
        title: {
          display: true,
          text: 'BMI Value',
          color: 'hsl(var(--muted-foreground))',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            family: 'system-ui',
            weight: 'normal',
          },
          maxRotation: 0,
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
          ctx.strokeStyle = 'hsl(var(--primary))';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 4]);
          
          ctx.beginPath();
          ctx.moveTo(chartArea.left, yPosition);
          ctx.lineTo(chartArea.right, yPosition);
          ctx.stroke();
          
          // Add label with background
          ctx.fillStyle = 'hsl(var(--primary))';
          ctx.font = '600 11px system-ui';
          const text = `Your BMI: ${currentBMI}`;
          const textWidth = ctx.measureText(text).width;
          
          // Background for text
          ctx.fillStyle = 'hsl(var(--background))';
          ctx.fillRect(chartArea.left + 8, yPosition - 20, textWidth + 8, 16);
          
          // Text
          ctx.fillStyle = 'hsl(var(--primary))';
          ctx.fillText(text, chartArea.left + 12, yPosition - 8);
          
          ctx.restore();
        }
      };
    }
  }, [currentBMI]);

  return (
    <Card className="soft-card animate-scale-in">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">
            BMI Reference Chart
          </h3>
          <p className="text-sm text-muted-foreground">
            WHO Standard BMI Categories
          </p>
        </div>
        
        <div className="h-80">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: 'hsl(207 90% 54%)'}}></div>
              <span className="text-foreground">Underweight: &lt; 18.5</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: 'hsl(142 76% 36%)'}}></div>
              <span className="text-foreground">Normal: 18.5-24.9</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: 'hsl(38 92% 50%)'}}></div>
              <span className="text-foreground">Overweight: 25-29.9</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: 'hsl(0 84% 60%)'}}></div>
              <span className="text-foreground">Obese: ≥ 30</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};