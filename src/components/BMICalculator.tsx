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
import { DarkModeToggle } from './DarkModeToggle';

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
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-soft-blue' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-500' };
    return { category: 'Obese', color: 'text-red-500' };
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
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="relative">
        <div className="absolute top-6 right-6 z-20">
          <DarkModeToggle />
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              BMI Calculator
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional Body Mass Index Calculator with Health Insights
            </p>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Main Calculator Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="soft-card animate-scale-in">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  Calculate BMI
                </h2>
                <p className="text-muted-foreground">Enter your measurements below</p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-xl">
                <span className={`font-medium transition-colors ${isMetric ? 'text-primary' : 'text-muted-foreground'}`}>
                  Metric
                </span>
                <Switch
                  checked={!isMetric}
                  onCheckedChange={(checked) => setIsMetric(!checked)}
                />
                <span className={`font-medium transition-colors ${!isMetric ? 'text-primary' : 'text-muted-foreground'}`}>
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
                      className="text-lg h-12"
                    />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="Feet"
                      className="text-lg h-12"
                    />
                    <Input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="Inches"
                      className="text-lg h-12"
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
                  className="text-lg h-12"
                />
              </div>

              {/* Calculate Button */}
              <Button
                onClick={calculateBMI}
                disabled={isCalculating}
                className="w-full h-14 text-lg font-semibold transition-all duration-300"
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
            <Card className="soft-card animate-scale-in">
              <div className="space-y-6 text-center">
                <h3 className="text-2xl font-semibold text-foreground">
                  Your BMI Result
                </h3>
                
                <div className="space-y-4">
                  <div className="text-5xl font-bold text-primary">
                    {result.value}
                  </div>
                  <div className={`text-xl font-semibold ${result.color}`}>
                    {result.category}
                  </div>
                </div>

                <BMIGauge value={result.value} />

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-foreground">Health Recommendations</h4>
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
      <footer className="border-t border-border mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-foreground mb-4">BMI Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Professional health tracking tool with comprehensive health insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Disclaimer</h4>
              <p className="text-xs text-muted-foreground">
                BMI is a screening tool and not a diagnostic tool. Consult healthcare professionals for medical advice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Health Resources</h4>
              <p className="text-xs text-muted-foreground">
                For more information about healthy lifestyle choices, consult certified healthcare providers.
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 BMI Calculator. Professional health assessment tool.
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};
