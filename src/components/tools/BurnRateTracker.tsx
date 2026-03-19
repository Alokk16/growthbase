
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BurnRateTrackerProps {
  onOpenChat: (context: any) => void;
}

const BurnRateTracker = ({ onOpenChat }: BurnRateTrackerProps) => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(75000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(125000);
  const [currentCash, setCurrentCash] = useState(500000);
  
  const [burnRate, setBurnRate] = useState(0);
  const [runway, setRunway] = useState(0);
  const [netBurn, setNetBurn] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Burn Rate = Monthly Expenses - Monthly Revenue
    const netBurnRate = monthlyExpenses - monthlyRevenue;
    const runwayMonths = netBurnRate > 0 ? Math.floor(currentCash / netBurnRate) : Infinity;
    
    setBurnRate(monthlyExpenses);
    setNetBurn(netBurnRate);
    setRunway(runwayMonths);
    
    if (runwayMonths > 18) {
      setStatus("Healthy 💚");
    } else if (runwayMonths > 12) {
      setStatus("Good ✅");
    } else if (runwayMonths > 6) {
      setStatus("Caution ⚠️");
    } else if (runwayMonths > 3) {
      setStatus("Critical 🔴");
    } else {
      setStatus("Emergency 🚨");
    }
  }, [monthlyRevenue, monthlyExpenses, currentCash]);

  // Generate projection data for next 12 months
  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const cashRemaining = Math.max(0, currentCash - (netBurn * month));
    const cumulativeRevenue = monthlyRevenue * month;
    const cumulativeExpenses = monthlyExpenses * month;
    
    return {
      month: `M${month}`,
      cash: cashRemaining,
      revenue: cumulativeRevenue,
      expenses: cumulativeExpenses,
      netBurn: netBurn * month
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "burnrate",
      data: {
        burnRate,
        netBurn,
        runway,
        monthlyRevenue,
        monthlyExpenses,
        currentCash,
        status
      },
      message: `My monthly burn rate is ₹${burnRate.toLocaleString()} with net burn of ₹${netBurn.toLocaleString()}. I have ${runway} months of runway left. What should I do?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Burn Rate Tracker</h2>
          <p className="text-muted-foreground mt-2">
            Monitor your cash burn and runway to make informed decisions
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Metrics</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="monthlyRevenue">Monthly Revenue (₹)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
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
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Key Results</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-red-400">
                ₹{burnRate.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Burn Rate</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-2xl font-bold ${netBurn <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{netBurn.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net Burn Rate</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {runway === Infinity ? '∞' : runway}
              </div>
              <div className="text-sm text-muted-foreground">
                Months of Runway
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Health Status</h3>
          <div className="space-y-4">
            <div className="text-center">
              <Badge 
                className={`text-lg px-4 py-2 ${
                  status.includes('Healthy') ? 'bg-green-500/20 text-green-400' :
                  status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                  status.includes('Caution') ? 'bg-yellow-500/20 text-yellow-400' :
                  status.includes('Critical') ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}
              >
                {status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Revenue Growth:</span>
                <span className="text-green-400">Target +20%</span>
              </div>
              <div className="flex justify-between">
                <span>Cost Efficiency:</span>
                <span className="text-yellow-400">Monitor</span>
              </div>
              <div className="flex justify-between">
                <span>Runway Target:</span>
                <span className="text-blue-400">12+ months</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Cash Flow Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString()}`, 
                  name === 'cash' ? 'Cash Remaining' : 
                  name === 'revenue' ? 'Cumulative Revenue' : 'Cumulative Expenses'
                ]}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cash" 
                stroke="#14B8A6" 
                fill="#14B8A6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue vs Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString()}`, 
                  name === 'revenue' ? 'Cumulative Revenue' : 'Cumulative Expenses'
                ]}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#14B8A6" 
                strokeWidth={3}
                dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default BurnRateTracker;
