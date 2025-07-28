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
    // BMI ranges: 0-15 (underweight), 15-18.5 (underweight), 18.5-25 (normal), 25-30 (overweight), 30+ (obese)
    // Map to 180 degrees (semicircle)
    let rotation: number;
    
    if (bmi <= 15) {
      rotation = (bmi / 15) * 36; // 0-36 degrees
    } else if (bmi <= 18.5) {
      rotation = 36 + ((bmi - 15) / 3.5) * 36; // 36-72 degrees
    } else if (bmi <= 25) {
      rotation = 72 + ((bmi - 18.5) / 6.5) * 36; // 72-108 degrees
    } else if (bmi <= 30) {
      rotation = 108 + ((bmi - 25) / 5) * 36; // 108-144 degrees
    } else {
      rotation = 144 + Math.min((bmi - 30) / 10, 1) * 36; // 144-180 degrees
    }
    
    return rotation;
  };

  const needleRotation = calculateNeedleRotation(value);

  const data = {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese', 'Hidden'],
    datasets: [
      {
        data: [20, 25, 25, 25, 5], // Hidden section to create half-circle effect
        backgroundColor: [
          '#3b82f6', // Blue
          '#22c55e', // Green
          '#f59e0b', // Yellow
          '#ef4444', // Red
          'transparent', // Hidden section
        ],
        borderColor: [
          '#1d4ed8',
          '#16a34a',
          '#d97706',
          '#dc2626',
          'transparent',
        ],
        borderWidth: 2,
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
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * (radius - 30),
          centerY + Math.sin(angle) * (radius - 30)
        );
        ctx.stroke();
        
        // Draw center dot
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs font-medium">
        <span className="text-blue-400">15</span>
        <span className="text-blue-400">18.5</span>
        <span className="text-green-400">25</span>
        <span className="text-yellow-400">30</span>
        <span className="text-red-400">35+</span>
      </div>
      
      {/* Current Value Display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl font-orbitron font-bold text-primary animate-pulse-slow">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">BMI</div>
      </div>
    </div>
  );
};