import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertTriangle, Info, Heart, Target } from 'lucide-react';

export const BMIFaq = () => {
  const faqData = [
    {
      question: "What is BMI?",
      answer: "Body Mass Index (BMI) is a measurement that uses your height and weight to determine if you're a healthy weight. It's calculated by dividing your weight in kilograms by your height in meters squared (kg/m²). While BMI is a useful screening tool, it's not a diagnostic measure and doesn't directly measure body fat.",
      icon: <Info className="w-5 h-5 text-primary" />
    },
    {
      question: "Is BMI accurate for everyone?",
      answer: "BMI has limitations and may not be accurate for everyone. It doesn't distinguish between muscle and fat mass, so athletes with high muscle mass may have high BMIs despite being healthy. It's also less accurate for older adults, pregnant women, and may vary by ethnicity. Always consult healthcare professionals for comprehensive health assessment.",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />
    },
    {
      question: "What's considered a healthy BMI?",
      answer: "According to WHO standards: Underweight (BMI < 18.5), Normal weight (BMI 18.5-24.9), Overweight (BMI 25-29.9), Obese Class I (BMI 30-34.9), Obese Class II (BMI 35-39.9), Obese Class III (BMI ≥ 40). However, optimal BMI can vary based on individual factors like age, muscle mass, and overall health.",
      icon: <Target className="w-5 h-5 text-green-400" />
    },
    {
      question: "How can I improve my BMI?",
      answer: "To achieve a healthy BMI: maintain a balanced diet with appropriate calorie intake, engage in regular physical activity (150+ minutes of moderate exercise weekly), stay hydrated, get adequate sleep (7-9 hours), manage stress, and avoid crash diets. Focus on gradual, sustainable lifestyle changes rather than quick fixes.",
      icon: <Heart className="w-5 h-5 text-red-400" />
    },
    {
      question: "How often should I check my BMI?",
      answer: "For general monitoring, checking BMI monthly is sufficient. If you're actively working on weight management, weekly checks can help track progress. Daily weighing isn't recommended as weight naturally fluctuates. Focus on long-term trends rather than daily variations. Always combine BMI tracking with other health markers.",
      icon: <Info className="w-5 h-5 text-primary" />
    },
    {
      question: "Can BMI predict health risks?",
      answer: "BMI can indicate potential health risks associated with being underweight or overweight, including cardiovascular disease, diabetes, and certain cancers. However, it's just one factor. Waist circumference, body composition, fitness level, family history, and other health markers provide a more complete health picture.",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />
    }
  ];

  return (
    <Card className="glass-card neon-glow animate-fade-in">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-orbitron font-semibold text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about BMI and health tracking
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/50 rounded-xl glass p-4"
            >
              <AccordionTrigger className="text-left hover:no-underline group">
                <div className="flex items-center space-x-3">
                  {faq.icon}
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="text-muted-foreground leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-400">Important Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This BMI calculator is for informational purposes only and should not replace professional medical advice. 
                BMI is a screening tool that may not accurately reflect health status for all individuals. Factors such as 
                muscle mass, bone density, age, sex, and ethnicity can affect the accuracy of BMI calculations. Always 
                consult with qualified healthcare professionals for personalized health assessments, medical advice, 
                diagnosis, or treatment recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};