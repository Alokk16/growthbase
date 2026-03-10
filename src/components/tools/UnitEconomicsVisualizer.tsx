
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UnitEconomicsVisualizerProps {
  onOpenChat: (context: any) => void;
}

const UnitEconomicsVisualizer = ({ onOpenChat }: UnitEconomicsVisualizerProps) => {
  const [revenue, setRevenue] = useState(1000);
  const [cogs, setCogs] = useState(300);
  const [cac, setCac] = useState(200);
  const [cltv, setCltv] = useState(3000);
  const [churnRate, setChurnRate] = useState(5);
  
  const [unitMargin, setUnitMargin] = useState(0);
  const [paybackPeriod, setPaybackPeriod] = useState(0);
  const [cltvCacRatio, setCltvCacRatio] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const margin = revenue - cogs;
    const payback = margin > 0 ? cac / margin : 0;
    const ratio = cac > 0 ? cltv / cac : 0;
    
    setUnitMargin(margin);
    setPaybackPeriod(payback);
    setCltvCacRatio(ratio);
    
    if (ratio > 5 && payback < 6) setStatus("Excellent 🚀");
    else if (ratio > 3 && payback < 12) setStatus("Very Good 💚");
    else if (ratio > 2 && payback < 18) setStatus("Good ✅");
    else if (ratio > 1) setStatus("Improving ⚠️");
    else setStatus("Needs Work 🔴");
  }, [revenue, cogs, cac, cltv, churnRate]);

  const pieData = [
    { name: 'COGS', value: cogs, color: '#EF4444' },
    { name: 'CAC', value: cac, color: '#F59E0B' },
    { name: 'Unit Profit', value: Math.max(0, unitMargin), color: '#14B8A6' }
  ];

  const barData = [
    { name: 'Revenue', value: revenue, type: 'positive' },
    { name: 'COGS', value: cogs, type: 'negative' },
    { name: 'CAC', value: cac, type: 'negative' },
    { name: 'Unit Margin', value: unitMargin, type: unitMargin >= 0 ? 'positive' : 'negative' }
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#14B8A6'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "uniteconomics",
      data: { revenue, unitMargin, cltvCacRatio, paybackPeriod, status },
      message: `Unit revenue: ₹${revenue}, margin: ₹${unitMargin}, CLTV:CAC is ${cltvCacRatio.toFixed(1)}:1, payback in ${paybackPeriod.toFixed(1)} months. How are my unit economics?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Unit Economics Visualizer</h2>
          <p className="text-muted-foreground mt-2">
            Analyze profitability at the individual customer/unit level
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Unit Metrics</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="revenue">Revenue per Unit (₹)</Label>
              <Input
                id="revenue"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cogs">Cost of Goods Sold per Unit (₹)</Label>
              <Input
                id="cogs"
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cac">Customer Acquisition Cost (₹)</Label>
              <Input
                id="cac"
                type="number"
                value={cac}
                onChange={(e) => setCac(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cltv">Customer Lifetime Value (₹)</Label>
              <Input
                id="cltv"
                type="number"
                value={cltv}
                onChange={(e) => setCltv(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="churnRate">Monthly Churn Rate (%)</Label>
              <Input
                id="churnRate"
                type="number"
                value={churnRate}
                onChange={(e) => setChurnRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Economics Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-3xl font-bold ${unitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{unitMargin.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Unit Margin</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary">
                {cltvCacRatio.toFixed(1)}:1
              </div>
              <div className="text-sm text-muted-foreground">CLTV:CAC Ratio</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                {paybackPeriod.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Payback Period (Months)</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Very Good') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Improving') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Unit Cost Breakdown</h3>
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
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Unit Economics Waterfall</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Bar 
                dataKey="value" 
                fill="#14B8A6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default UnitEconomicsVisualizer;
