
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface CLTVCalculatorProps {
  onOpenChat: (context: any) => void;
}

const CLTVCalculator = ({ onOpenChat }: CLTVCalculatorProps) => {
  const [avgOrderValue, setAvgOrderValue] = useState(2500);
  const [purchaseFrequency, setPurchaseFrequency] = useState(3);
  const [grossMargin, setGrossMargin] = useState(40);
  const [customerLifespan, setCustomerLifespan] = useState(24);
  const [cac, setCac] = useState(800);
  
  const [cltv, setCltv] = useState(0);
  const [cltvCacRatio, setCltvCacRatio] = useState(0);
  const [monthlyValue, setMonthlyValue] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const monthlyRevenue = avgOrderValue * purchaseFrequency;
    const monthlyProfit = monthlyRevenue * (grossMargin / 100);
    const totalCltv = monthlyProfit * customerLifespan;
    const ratio = cac > 0 ? totalCltv / cac : 0;
    
    setCltv(totalCltv);
    setCltvCacRatio(ratio);
    setMonthlyValue(monthlyProfit);
    
    if (ratio > 5) setStatus("Excellent 🚀");
    else if (ratio > 3) setStatus("Very Good 💚");
    else if (ratio > 2) setStatus("Good ✅");
    else if (ratio > 1) setStatus("Break-even ⚠️");
    else setStatus("Unprofitable 🔴");
  }, [avgOrderValue, purchaseFrequency, grossMargin, customerLifespan, cac]);

  const chartData = Array.from({ length: Math.min(customerLifespan, 24) }, (_, i) => {
    const month = i + 1;
    const cumulativeValue = monthlyValue * month;
    const netValue = cumulativeValue - cac;
    
    return {
      month: `M${month}`,
      cltv: cumulativeValue,
      netValue: netValue,
      cac: cac
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "cltv",
      data: { cltv, cltvCacRatio, cac, monthlyValue, status },
      message: `My CLTV is ₹${cltv.toLocaleString()} with CAC of ₹${cac.toLocaleString()}. CLTV:CAC ratio is ${cltvCacRatio.toFixed(1)}:1. How's my unit economics?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">CLTV Calculator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate Customer Lifetime Value and optimize your unit economics
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Metrics</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="avgOrderValue">Average Order Value (₹)</Label>
              <Input
                id="avgOrderValue"
                type="number"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="purchaseFrequency">Monthly Purchase Frequency</Label>
              <Input
                id="purchaseFrequency"
                type="number"
                value={purchaseFrequency}
                onChange={(e) => setPurchaseFrequency(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="grossMargin">Gross Margin (%)</Label>
              <Input
                id="grossMargin"
                type="number"
                value={grossMargin}
                onChange={(e) => setGrossMargin(Number(e.target.value))}
                className="mt-1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="customerLifespan">Customer Lifespan (Months)</Label>
              <Input
                id="customerLifespan"
                type="number"
                value={customerLifespan}
                onChange={(e) => setCustomerLifespan(Number(e.target.value))}
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
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">CLTV Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                ₹{cltv.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Customer Lifetime Value</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                {cltvCacRatio.toFixed(1)}:1
              </div>
              <div className="text-sm text-muted-foreground">CLTV:CAC Ratio</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                ₹{monthlyValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Value per Customer</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Very Good') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Break-even') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">CLTV vs CAC Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            <Line type="monotone" dataKey="cltv" stroke="#14B8A6" strokeWidth={3} name="Cumulative CLTV" />
            <Line type="monotone" dataKey="cac" stroke="#EF4444" strokeWidth={2} name="CAC" />
            <Line type="monotone" dataKey="netValue" stroke="#3B82F6" strokeWidth={2} name="Net Value" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default CLTVCalculator;
