
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface WorkingCapitalEstimatorProps {
  onOpenChat: (context: any) => void;
}

const WorkingCapitalEstimator = ({ onOpenChat }: WorkingCapitalEstimatorProps) => {
  const [inventory, setInventory] = useState(500000);
  const [accountsReceivable, setAccountsReceivable] = useState(300000);
  const [accountsPayable, setAccountsPayable] = useState(200000);
  const [monthlySales, setMonthlySales] = useState(1000000);
  const [monthlyCogs, setMonthlyCogs] = useState(600000);
  
  const [workingCapital, setWorkingCapital] = useState(0);
  const [workingCapitalRatio, setWorkingCapitalRatio] = useState(0);
  const [daysWorkingCapital, setDaysWorkingCapital] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const currentAssets = inventory + accountsReceivable;
    const currentLiabilities = accountsPayable;
    const wc = currentAssets - currentLiabilities;
    const wcRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const daysWc = monthlyCogs > 0 ? (wc / monthlyCogs) * 30 : 0;
    
    setWorkingCapital(wc);
    setWorkingCapitalRatio(wcRatio);
    setDaysWorkingCapital(daysWc);
    
    if (wcRatio > 2 && daysWc < 30) setStatus("Excellent 💚");
    else if (wcRatio > 1.5 && daysWc < 45) setStatus("Good ✅");
    else if (wcRatio > 1 && daysWc < 60) setStatus("Fair ⚠️");
    else if (wcRatio > 0.8) setStatus("Tight 🔴");
    else setStatus("Critical 🚨");
  }, [inventory, accountsReceivable, accountsPayable, monthlySales, monthlyCogs]);

  const chartData = [
    { name: 'Inventory', value: inventory, type: 'asset' },
    { name: 'A/R', value: accountsReceivable, type: 'asset' },
    { name: 'A/P', value: accountsPayable, type: 'liability' },
    { name: 'Net WC', value: workingCapital, type: workingCapital >= 0 ? 'positive' : 'negative' }
  ];

  const trendData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Simulate seasonal variations
    const seasonality = 1 + 0.2 * Math.sin((month - 1) * Math.PI / 6);
    const projectedSales = monthlySales * seasonality;
    const projectedInventory = inventory * seasonality;
    const projectedAR = accountsReceivable * seasonality;
    const projectedWC = (projectedInventory + projectedAR) - accountsPayable;
    
    return {
      month: `M${month}`,
      workingCapital: projectedWC,
      inventory: projectedInventory,
      accountsReceivable: projectedAR
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "workingcapital",
      data: { workingCapital, workingCapitalRatio, daysWorkingCapital, status },
      message: `Working capital is ₹${workingCapital.toLocaleString()} with ratio of ${workingCapitalRatio.toFixed(2)}. Need ${daysWorkingCapital.toFixed(0)} days of funding. How can I optimize?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Working Capital Estimator</h2>
          <p className="text-muted-foreground mt-2">
            Analyze your short-term liquidity and cash flow needs
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Balance Sheet Items</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inventory">Inventory (₹)</Label>
              <Input
                id="inventory"
                type="number"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="accountsReceivable">Accounts Receivable (₹)</Label>
              <Input
                id="accountsReceivable"
                type="number"
                value={accountsReceivable}
                onChange={(e) => setAccountsReceivable(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="accountsPayable">Accounts Payable (₹)</Label>
              <Input
                id="accountsPayable"
                type="number"
                value={accountsPayable}
                onChange={(e) => setAccountsPayable(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="monthlySales">Monthly Sales (₹)</Label>
              <Input
                id="monthlySales"
                type="number"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="monthlyCogs">Monthly COGS (₹)</Label>
              <Input
                id="monthlyCogs"
                type="number"
                value={monthlyCogs}
                onChange={(e) => setMonthlyCogs(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Working Capital Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-3xl font-bold ${workingCapital >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{workingCapital.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Working Capital</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary">
                {workingCapitalRatio.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Current Ratio</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                {daysWorkingCapital.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Days Working Capital</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Fair') ? 'bg-yellow-500/20 text-yellow-400' :
                status.includes('Tight') ? 'bg-orange-500/20 text-orange-400' :
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
          <h3 className="text-xl font-semibold mb-4">Working Capital Components</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Bar 
                dataKey="value" 
                fill="#14B8A6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Seasonal Working Capital Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Line type="monotone" dataKey="workingCapital" stroke="#14B8A6" strokeWidth={3} name="Working Capital" />
              <Line type="monotone" dataKey="inventory" stroke="#3B82F6" strokeWidth={2} name="Inventory" />
              <Line type="monotone" dataKey="accountsReceivable" stroke="#F59E0B" strokeWidth={2} name="A/R" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default WorkingCapitalEstimator;
