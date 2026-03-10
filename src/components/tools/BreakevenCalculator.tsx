
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BreakevenCalculatorProps {
  onOpenChat: (context: any) => void;
}

const BreakevenCalculator = ({ onOpenChat }: BreakevenCalculatorProps) => {
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(20);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(50);
  
  const [breakevenUnits, setBreakevenUnits] = useState(0);
  const [breakevenRevenue, setBreakevenRevenue] = useState(0);
  const [contributionMargin, setContributionMargin] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Breakeven formula: Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)
    const margin = sellingPricePerUnit - variableCostPerUnit;
    const units = margin > 0 ? Math.ceil(fixedCosts / margin) : 0;
    const revenue = units * sellingPricePerUnit;
    const contributionMarginPercent = margin > 0 ? ((margin / sellingPricePerUnit) * 100) : 0;
    
    setBreakevenUnits(units);
    setBreakevenRevenue(revenue);
    setContributionMargin(contributionMarginPercent);
    
    if (contributionMarginPercent > 70) {
      setStatus("Excellent 🚀");
    } else if (contributionMarginPercent > 50) {
      setStatus("Good 💚");
    } else if (contributionMarginPercent > 30) {
      setStatus("Fair ⚠️");
    } else if (contributionMarginPercent > 0) {
      setStatus("Poor 🔴");
    } else {
      setStatus("Loss ❌");
    }
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit]);

  const chartData = [
    {
      name: 'Fixed Costs',
      amount: fixedCosts,
      color: '#EF4444'
    },
    {
      name: 'Variable Costs',
      amount: variableCostPerUnit * breakevenUnits,
      color: '#F59E0B'
    },
    {
      name: 'Revenue',
      amount: breakevenRevenue,
      color: '#14B8A6'
    }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "breakeven",
      data: {
        breakevenUnits,
        breakevenRevenue,
        contributionMargin,
        fixedCosts,
        variableCostPerUnit,
        sellingPricePerUnit,
        status
      },
      message: `My breakeven analysis shows I need to sell ${breakevenUnits} units to breakeven with ₹${breakevenRevenue.toLocaleString()} revenue. My contribution margin is ${contributionMargin.toFixed(1)}%. What's your advice?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Break-even Calculator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate the minimum sales needed to cover all your costs
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Input Parameters</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fixedCosts">Monthly Fixed Costs (₹)</Label>
              <Input
                id="fixedCosts"
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Rent, salaries, utilities, insurance, etc.
              </p>
            </div>
            
            <div>
              <Label htmlFor="variableCost">Variable Cost per Unit (₹)</Label>
              <Input
                id="variableCost"
                type="number"
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Materials, shipping, commissions per unit
              </p>
            </div>
            
            <div>
              <Label htmlFor="sellingPrice">Selling Price per Unit (₹)</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={sellingPricePerUnit}
                onChange={(e) => setSellingPricePerUnit(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Revenue per unit sold
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {breakevenUnits.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Units to Break-even</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                ₹{breakevenRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Break-even Revenue</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                {contributionMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Contribution Margin</div>
            </div>
            
            <div className="text-center">
              <Badge 
                className={`${
                  status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                  status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
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

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Break-even Analysis Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#94A3B8"
              fontSize={12}
            />
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
            <Bar 
              dataKey="amount" 
              fill="#14B8A6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default BreakevenCalculator;
