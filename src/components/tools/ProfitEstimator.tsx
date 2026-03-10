
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ProfitEstimatorProps {
  onOpenChat: (context: any) => void;
}

const ProfitEstimator = ({ onOpenChat }: ProfitEstimatorProps) => {
  const [revenue, setRevenue] = useState(200000);
  const [cogs, setCogs] = useState(60000);
  const [operatingExpenses, setOperatingExpenses] = useState(80000);
  const [taxes, setTaxes] = useState(15);
  
  const [grossProfit, setGrossProfit] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const gross = revenue - cogs;
    const operating = gross - operatingExpenses;
    const taxAmount = operating * (taxes / 100);
    const net = operating - taxAmount;
    const margin = revenue > 0 ? (net / revenue) * 100 : 0;
    
    setGrossProfit(gross);
    setNetProfit(net);
    setProfitMargin(margin);
    
    if (margin > 20) setStatus("Excellent 🚀");
    else if (margin > 15) setStatus("Very Good 💚");
    else if (margin > 10) setStatus("Good ✅");
    else if (margin > 5) setStatus("Fair ⚠️");
    else if (margin > 0) setStatus("Break-even 📊");
    else setStatus("Loss 🔴");
  }, [revenue, cogs, operatingExpenses, taxes]);

  const pieData = [
    { name: 'COGS', value: cogs, color: '#EF4444' },
    { name: 'Operating Expenses', value: operatingExpenses, color: '#F59E0B' },
    { name: 'Taxes', value: (revenue - cogs - operatingExpenses) * (taxes / 100), color: '#8B5CF6' },
    { name: 'Net Profit', value: Math.max(0, netProfit), color: '#14B8A6' }
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#14B8A6'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "profit",
      data: { revenue, grossProfit, netProfit, profitMargin, status },
      message: `My monthly revenue is ₹${revenue.toLocaleString()} with ${profitMargin.toFixed(1)}% profit margin. Net profit is ₹${netProfit.toLocaleString()}. How can I improve?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Monthly Profit Estimator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate your monthly profit margins and identify optimization opportunities
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue & Costs</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="revenue">Monthly Revenue (₹)</Label>
              <Input
                id="revenue"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cogs">Cost of Goods Sold (₹)</Label>
              <Input
                id="cogs"
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="operatingExpenses">Operating Expenses (₹)</Label>
              <Input
                id="operatingExpenses"
                type="number"
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="taxes">Tax Rate (%)</Label>
              <Input
                id="taxes"
                type="number"
                value={taxes}
                onChange={(e) => setTaxes(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Profit Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-blue-400">
                ₹{grossProfit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Gross Profit</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{netProfit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net Profit</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-primary">
                {profitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Profit Margin</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Very Good') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Fair') || status.includes('Break-even') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Profit Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
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
    </div>
  );
};

export default ProfitEstimator;
