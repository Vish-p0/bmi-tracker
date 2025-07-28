import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BMIGaugeProps {
  value: number;
}

export const BMIGauge: React.FC<BMIGaugeProps> = ({ value }) => {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // Calculate the position of the needle based on BMI value
  const calculateNeedleRotation = (bmi: number): number => {
    // BMI ranges mapped to semicircle (180 degrees)
    // Underweight: 0-18.5 (0-54 degrees)
    // Normal: 18.5-25 (54-108 degrees)  
    // Overweight: 25-30 (108-144 degrees)
    // Obese: 30+ (144-180 degrees)
    
    if (bmi <= 18.5) {
      return (bmi / 18.5) * 54; // 0-54 degrees
    } else if (bmi <= 25) {
      return 54 + ((bmi - 18.5) / 6.5) * 54; // 54-108 degrees
    } else if (bmi <= 30) {
      return 108 + ((bmi - 25) / 5) * 36; // 108-144 degrees
    } else {
      return 144 + Math.min((bmi - 30) / 10, 1) * 36; // 144-180 degrees
    }
  };

  const needleRotation = calculateNeedleRotation(value);

  const data = {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese', 'Hidden'],
    datasets: [
      {
        data: [18.5, 6.5, 5, 10, 10], // Proportional to actual BMI ranges + hidden section
        backgroundColor: [
          'hsl(207 90% 54%)', // Soft blue
          'hsl(142 76% 36%)', // Soft green
          'hsl(38 92% 50%)', // Soft orange
          'hsl(0 84% 60%)', // Soft red
          'transparent', // Hidden section
        ],
        borderColor: [
          'hsl(207 90% 54%)',
          'hsl(142 76% 36%)',
          'hsl(38 92% 50%)',
          'hsl(0 84% 60%)',
          'transparent',
        ],
        borderWidth: 1,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      animateRotate: true,
      duration: 2000,
    },
  };

  // Draw custom needle
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const originalDraw = chart.draw;

      chart.draw = function() {
        originalDraw.call(this);
        
        const ctx = this.ctx;
        const chartArea = this.chartArea;
        
        // Calculate center point
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2 + 20; // Slightly lower for semicircle
        
        // Calculate needle position
        const radius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2 - 20;
        const angle = (needleRotation - 90) * (Math.PI / 180); // Convert to radians and adjust for start position
        
        ctx.save();
        
        // Draw needle
        ctx.strokeStyle = 'hsl(207 90% 54%)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * (radius - 25),
          centerY + Math.sin(angle) * (radius - 25)
        );
        ctx.stroke();
        
        // Draw center dot
        ctx.fillStyle = 'hsl(207 90% 54%)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add subtle shadow
        ctx.shadowColor = 'hsl(207 90% 54% / 0.3)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
      };
      
      chart.update();
    }
  }, [needleRotation]);

  return (
    <div className="relative">
      <div className="h-48 relative">
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
      
      {/* BMI Scale Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs font-medium text-muted-foreground">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>35+</span>
      </div>
      
      {/* Current Value Display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-3xl font-semibold text-primary animate-pulse-gentle">
          {value}
        </div>
        <div className="text-xs text-muted-foreground font-medium">BMI</div>
      </div>
    </div>
  );
};