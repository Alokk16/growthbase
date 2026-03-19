
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CashFlowVisualizerProps {
  onOpenChat: (context: any) => void;
}

const CashFlowVisualizer = ({ onOpenChat }: CashFlowVisualizerProps) => {
  const [startingCash, setStartingCash] = useState(500000);
  const [monthlyInflow, setMonthlyInflow] = useState(150000);
  const [monthlyOutflow, setMonthlyOutflow] = useState(120000);
  const [inflowGrowth, setInflowGrowth] = useState(5);
  const [outflowGrowth, setOutflowGrowth] = useState(2);
  
  const [endingCash, setEndingCash] = useState(0);
  const [avgMonthlyFlow, setAvgMonthlyFlow] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cash = startingCash;
    let totalFlow = 0;
    const months = 12;
    
    for (let month = 1; month <= months; month++) {
      const inflow = monthlyInflow * Math.pow(1 + inflowGrowth / 100, month - 1);
      const outflow = monthlyOutflow * Math.pow(1 + outflowGrowth / 100, month - 1);
      const netFlow = inflow - outflow;
      cash += netFlow;
      totalFlow += netFlow;
    }
    
    setEndingCash(cash);
    setAvgMonthlyFlow(totalFlow / months);
    
    if (cash > startingCash * 2) setStatus("Growing Fast 🚀");
    else if (cash > startingCash * 1.5) setStatus("Healthy Growth 💚");
    else if (cash > startingCash) setStatus("Positive ✅");
    else if (cash > startingCash * 0.8) setStatus("Declining ⚠️");
    else setStatus("Critical 🔴");
  }, [startingCash, monthlyInflow, monthlyOutflow, inflowGrowth, outflowGrowth]);

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    let cash = startingCash;
    
    for (let m = 1; m <= month; m++) {
      const inflow = monthlyInflow * Math.pow(1 + inflowGrowth / 100, m - 1);
      const outflow = monthlyOutflow * Math.pow(1 + outflowGrowth / 100, m - 1);
      cash += (inflow - outflow);
    }
    
    const inflow = monthlyInflow * Math.pow(1 + inflowGrowth / 100, month - 1);
    const outflow = monthlyOutflow * Math.pow(1 + outflowGrowth / 100, month - 1);
    
    return {
      month: `M${month}`,
      cash: Math.round(cash),
      inflow: Math.round(inflow),
      outflow: Math.round(outflow),
      netFlow: Math.round(inflow - outflow)
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "cashflow",
      data: { startingCash, endingCash, avgMonthlyFlow, status },
      message: `Starting with ₹${startingCash.toLocaleString()}, projected to have ₹${endingCash.toLocaleString()} after 12 months. Average monthly flow: ₹${avgMonthlyFlow.toLocaleString()}. What should I focus on?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Cash Flow Visualizer</h2>
          <p className="text-muted-foreground mt-2">
            Track and project your cash position over time
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Cash Flow Inputs</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="startingCash">Starting Cash (₹)</Label>
              <Input
                id="startingCash"
                type="number"
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="monthlyInflow">Monthly Inflow (₹)</Label>
              <Input
                id="monthlyInflow"
                type="number"
                value={monthlyInflow}
                onChange={(e) => setMonthlyInflow(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="monthlyOutflow">Monthly Outflow (₹)</Label>
              <Input
                id="monthlyOutflow"
                type="number"
                value={monthlyOutflow}
                onChange={(e) => setMonthlyOutflow(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inflowGrowth">Inflow Growth Rate (%)</Label>
              <Input
                id="inflowGrowth"
                type="number"
                value={inflowGrowth}
                onChange={(e) => setInflowGrowth(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="outflowGrowth">Outflow Growth Rate (%)</Label>
              <Input
                id="outflowGrowth"
                type="number"
                value={outflowGrowth}
                onChange={(e) => setOutflowGrowth(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Cash Position</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-blue-400">
                ₹{startingCash.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Starting Cash</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                ₹{endingCash.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Projected 12M Cash</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-xl font-bold ${avgMonthlyFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{avgMonthlyFlow.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Avg Monthly Flow</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Growing') ? 'bg-green-500/20 text-green-400' :
                status.includes('Healthy') || status.includes('Positive') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Declining') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Cash Flow Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            <Line type="monotone" dataKey="cash" stroke="#14B8A6" strokeWidth={3} dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }} />
            <Line type="monotone" dataKey="inflow" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default CashFlowVisualizer;
