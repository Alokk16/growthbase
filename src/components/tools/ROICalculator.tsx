
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ROICalculatorProps {
  onOpenChat: (context: any) => void;
}

const ROICalculator = ({ onOpenChat }: ROICalculatorProps) => {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [finalValue, setFinalValue] = useState(150000);
  const [timeperiod, setTimeperiod] = useState(12); // months
  
  const [roi, setROI] = useState(0);
  const [annualizedROI, setAnnualizedROI] = useState(0);
  const [profit, setProfit] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // ROI formula: ((Final Value - Initial Investment) / Initial Investment) * 100
    const profitAmount = finalValue - initialInvestment;
    const roiPercent = initialInvestment > 0 ? (profitAmount / initialInvestment) * 100 : 0;
    const annualizedRoi = timeperiod > 0 ? (roiPercent / timeperiod) * 12 : 0;
    
    setProfit(profitAmount);
    setROI(roiPercent);
    setAnnualizedROI(annualizedRoi);
    
    if (annualizedRoi > 50) {
      setStatus("Excellent 🚀");
    } else if (annualizedRoi > 25) {
      setStatus("Very Good 💚");
    } else if (annualizedRoi > 15) {
      setStatus("Good ✅");
    } else if (annualizedRoi > 0) {
      setStatus("Fair ⚠️");
    } else {
      setStatus("Loss 🔴");
    }
  }, [initialInvestment, finalValue, timeperiod]);

  const pieData = [
    { name: 'Initial Investment', value: initialInvestment, color: '#EF4444' },
    { name: 'Profit/Loss', value: Math.max(0, profit), color: '#14B8A6' }
  ];

  const barData = [
    {
      name: 'Investment',
      amount: initialInvestment,
      type: 'investment'
    },
    {
      name: 'Returns',
      amount: finalValue,
      type: 'returns'
    }
  ];

  const COLORS = ['#EF4444', '#14B8A6'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "roi",
      data: {
        roi,
        annualizedROI,
        profit,
        initialInvestment,
        finalValue,
        timeperiod,
        status
      },
      message: `I invested ₹${initialInvestment.toLocaleString()} and got ₹${finalValue.toLocaleString()} back over ${timeperiod} months. My ROI is ${roi.toFixed(1)}% (${annualizedROI.toFixed(1)}% annualized). How does this look?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">ROI Calculator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate Return on Investment for your business decisions
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="initialInvestment">Initial Investment (₹)</Label>
              <Input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total amount invested initially
              </p>
            </div>
            
            <div>
              <Label htmlFor="finalValue">Final Value (₹)</Label>
              <Input
                id="finalValue"
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Current or expected final value
              </p>
            </div>
            
            <div>
              <Label htmlFor="timeperiod">Time Period (Months)</Label>
              <Input
                id="timeperiod"
                type="number"
                value={timeperiod}
                onChange={(e) => setTimeperiod(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Duration of investment
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">ROI Results</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {roi.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Total ROI</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                {annualizedROI.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Annualized ROI</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{profit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {profit >= 0 ? 'Profit' : 'Loss'}
              </div>
            </div>
            
            <div className="text-center">
              <Badge 
                className={`${
                  status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                  status.includes('Very Good') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                  status.includes('Fair') ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}
              >
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Investment vs Returns</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Bar dataKey="amount" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Investment Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;
