import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BMIChart } from './BMIChart';
import { BMIGauge } from './BMIGauge';
import { BMIHistory } from './BMIHistory';
import { BMIFaq } from './BMIFaq';
import { ScrollToTop } from './ScrollToTop';

interface BMIResult {
  value: number;
  category: string;
  color: string;
  tips: string[];
  date: Date;
}

interface BMIData {
  value: number;
  date: string;
}

export const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [isMetric, setIsMetric] = useState(true);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [history, setHistory] = useState<BMIData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('bmi-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('bmi-history', JSON.stringify(history));
    }
  }, [history]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' };
    return { category: 'Obese', color: 'text-red-400' };
  };

  const getBMITips = (bmi: number): string[] => {
    if (bmi < 18.5) {
      return [
        'Consider consulting a healthcare provider about healthy weight gain',
        'Focus on nutrient-dense foods and regular meals',
        'Include strength training to build muscle mass',
        'Monitor your health with regular check-ups'
      ];
    }
    if (bmi < 25) {
      return [
        'Great job! You\'re in the healthy weight range',
        'Maintain your current lifestyle with balanced diet',
        'Continue regular physical activity (150 min/week)',
        'Keep monitoring your weight regularly'
      ];
    }
    if (bmi < 30) {
      return [
        'Consider gradual weight loss through diet and exercise',
        'Focus on reducing portion sizes and calorie intake',
        'Increase physical activity to 300 minutes per week',
        'Consult a healthcare provider for personalized advice'
      ];
    }
    return [
      'Consult a healthcare provider for a comprehensive plan',
      'Consider working with a registered dietitian',
      'Start with low-impact exercises like walking',
      'Focus on sustainable lifestyle changes, not quick fixes'
    ];
  };

  const calculateBMI = () => {
    setIsCalculating(true);
    
    // Add a small delay for loading animation
    setTimeout(() => {
      let heightInMeters: number;
      let weightInKg: number;

      if (isMetric) {
        const heightCm = parseFloat(height);
        const weightKg = parseFloat(weight);
        
        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
          toast({
            title: "Invalid Input",
            description: "Please enter valid height and weight values.",
            variant: "destructive",
          });
          setIsCalculating(false);
          return;
        }
        
        heightInMeters = heightCm / 100;
        weightInKg = weightKg;
      } else {
        const feetVal = parseFloat(feet);
        const inchesVal = parseFloat(inches) || 0;
        const weightLbs = parseFloat(weight);
        
        if (!feetVal || !weightLbs || feetVal <= 0 || weightLbs <= 0) {
          toast({
            title: "Invalid Input",
            description: "Please enter valid height and weight values.",
            variant: "destructive",
          });
          setIsCalculating(false);
          return;
        }
        
        const totalInches = (feetVal * 12) + inchesVal;
        heightInMeters = totalInches * 0.0254;
        weightInKg = weightLbs * 0.453592;
      }

      const bmi = weightInKg / (heightInMeters * heightInMeters);
      const categoryInfo = getBMICategory(bmi);
      const tips = getBMITips(bmi);

      const newResult: BMIResult = {
        value: parseFloat(bmi.toFixed(1)),
        category: categoryInfo.category,
        color: categoryInfo.color,
        tips,
        date: new Date()
      };

      setResult(newResult);

      // Add to history (keep only last 10 entries)
      const newHistoryEntry: BMIData = {
        value: newResult.value,
        date: new Date().toISOString()
      };
      
      setHistory(prev => [newHistoryEntry, ...prev].slice(0, 10));

      toast({
        title: "BMI Calculated!",
        description: `Your BMI is ${newResult.value} (${newResult.category})`,
      });

      setIsCalculating(false);
    }, 1000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bmi-history');
    toast({
      title: "History Cleared",
      description: "Your BMI history has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-space-deep to-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-orbitron font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">
              BMI CALC
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-exo max-w-2xl mx-auto">
              Advanced Body Mass Index Calculator with Health Insights
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-primary rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Main Calculator Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="glass-card neon-glow animate-scale-in">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-orbitron font-semibold text-primary">
                  Calculate BMI
                </h2>
                <p className="text-muted-foreground">Enter your measurements below</p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center justify-center space-x-4 p-4 bg-secondary/50 rounded-xl">
                <span className={`font-medium ${isMetric ? 'text-primary' : 'text-muted-foreground'}`}>
                  Metric
                </span>
                <Switch
                  checked={!isMetric}
                  onCheckedChange={(checked) => setIsMetric(!checked)}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`font-medium ${!isMetric ? 'text-primary' : 'text-muted-foreground'}`}>
                  Imperial
                </span>
              </div>

              {/* Height Input */}
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Height {isMetric ? '(cm)' : '(ft/in)'}
                </Label>
                {isMetric ? (
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 175"
                    className="glass text-lg h-12"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="Feet"
                      className="glass text-lg h-12"
                    />
                    <Input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="Inches"
                      className="glass text-lg h-12"
                    />
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Weight {isMetric ? '(kg)' : '(lbs)'}
                </Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={isMetric ? "e.g., 70" : "e.g., 154"}
                  className="glass text-lg h-12"
                />
              </div>

              {/* Calculate Button */}
              <Button
                onClick={calculateBMI}
                disabled={isCalculating}
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-neon transition-all duration-300"
              >
                {isCalculating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculating...</span>
                  </div>
                ) : (
                  'Calculate BMI'
                )}
              </Button>
            </div>
          </Card>

          {/* Result Display */}
          {result && (
            <Card className="glass-card neon-glow animate-scale-in">
              <div className="space-y-6 text-center">
                <h3 className="text-2xl font-orbitron font-semibold text-primary">
                  Your BMI Result
                </h3>
                
                <div className="space-y-4">
                  <div className="text-6xl font-orbitron font-bold text-primary animate-glow">
                    {result.value}
                  </div>
                  <div className={`text-2xl font-semibold ${result.color}`}>
                    {result.category}
                  </div>
                </div>

                <BMIGauge value={result.value} />

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-accent">Health Recommendations</h4>
                  <ul className="text-left space-y-2">
                    {result.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <BMIChart currentBMI={result?.value} />
          {history.length > 0 && (
            <BMIHistory 
              history={history} 
              onClearHistory={clearHistory}
            />
          )}
        </div>

        {/* FAQ Section */}
        <BMIFaq />
      </div>

      {/* Footer */}
      <footer className="glass border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-orbitron font-semibold text-primary mb-4">BMI Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Professional health tracking tool with advanced analytics and insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Disclaimer</h4>
              <p className="text-xs text-muted-foreground">
                BMI is a screening tool and not a diagnostic tool. Consult healthcare professionals for medical advice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 BMI Calculator. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};
