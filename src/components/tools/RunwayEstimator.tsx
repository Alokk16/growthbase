
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RunwayEstimatorProps {
  onOpenChat: (context: any) => void;
}

const RunwayEstimator = ({ onOpenChat }: RunwayEstimatorProps) => {
  const [currentCash, setCurrentCash] = useState(1000000);
  const [monthlyBurn, setMonthlyBurn] = useState(150000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(80000);
  const [revenueGrowthRate, setRevenueGrowthRate] = useState(5);
  
  const [runway, setRunway] = useState(0);
  const [breakEvenMonth, setBreakEvenMonth] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cash = currentCash;
    let revenue = monthlyRevenue;
    let month = 0;
    
    while (cash > 0 && month < 60) {
      month++;
      const netBurn = monthlyBurn - revenue;
      cash -= netBurn;
      revenue *= (1 + revenueGrowthRate / 100);
      
      if (revenue >= monthlyBurn && breakEvenMonth === 0) {
        setBreakEvenMonth(month);
      }
    }
    
    setRunway(month);
    
    if (month > 18) setStatus("Strong 💚");
    else if (month > 12) setStatus("Healthy ✅");
    else if (month > 6) setStatus("Caution ⚠️");
    else setStatus("Critical 🔴");
  }, [currentCash, monthlyBurn, monthlyRevenue, revenueGrowthRate]);

  const projectionData = Array.from({ length: Math.min(runway, 24) }, (_, i) => {
    let cash = currentCash;
    let revenue = monthlyRevenue;
    
    for (let m = 0; m <= i; m++) {
      const netBurn = monthlyBurn - revenue;
      cash -= netBurn;
      revenue *= (1 + revenueGrowthRate / 100);
    }
    
    return {
      month: `M${i + 1}`,
      cash: Math.max(0, cash),
      revenue: monthlyRevenue * Math.pow(1 + revenueGrowthRate / 100, i + 1)
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "runway",
      data: { runway, breakEvenMonth, currentCash, monthlyBurn, status },
      message: `I have ${runway} months of runway with ₹${currentCash.toLocaleString()} cash and ₹${monthlyBurn.toLocaleString()} monthly burn. Break-even in month ${breakEvenMonth}. What should I focus on?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Runway Estimator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate how long your cash will last and when you'll break even
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Financial Inputs</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentCash">Current Cash (₹)</Label>
              <Input
                id="currentCash"
                type="number"
                value={currentCash}
                onChange={(e) => setCurrentCash(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="monthlyBurn">Monthly Burn Rate (₹)</Label>
              <Input
                id="monthlyBurn"
                type="number"
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="monthlyRevenue">Current Monthly Revenue (₹)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="revenueGrowthRate">Revenue Growth Rate (%)</Label>
              <Input
                id="revenueGrowthRate"
                type="number"
                value={revenueGrowthRate}
                onChange={(e) => setRevenueGrowthRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Runway Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">{runway}</div>
              <div className="text-sm text-muted-foreground">Months of Runway</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                {breakEvenMonth || 'Never'}
              </div>
              <div className="text-sm text-muted-foreground">Break-even Month</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Strong') ? 'bg-green-500/20 text-green-400' :
                status.includes('Healthy') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Caution') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Cash Flow Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            <Area type="monotone" dataKey="cash" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default RunwayEstimator;
