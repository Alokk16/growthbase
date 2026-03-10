
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SaaSMRREstimatorProps {
  onOpenChat: (context: any) => void;
}

const SaaSMRREstimator = ({ onOpenChat }: SaaSMRREstimatorProps) => {
  const [currentMRR, setCurrentMRR] = useState(500000);
  const [newCustomers, setNewCustomers] = useState(50);
  const [avgRevenuePerUser, setAvgRevenuePerUser] = useState(2000);
  const [churnRate, setChurnRate] = useState(5);
  const [expansionRate, setExpansionRate] = useState(2);
  
  const [newMRR, setNewMRR] = useState(0);
  const [churnedMRR, setChurnedMRR] = useState(0);
  const [expansionMRR, setExpansionMRR] = useState(0);
  const [netNewMRR, setNetNewMRR] = useState(0);
  const [projectedMRR, setProjectedMRR] = useState(0);
  const [annualARR, setAnnualARR] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const calculatedNewMRR = newCustomers * avgRevenuePerUser;
    const calculatedChurnedMRR = currentMRR * (churnRate / 100);
    const calculatedExpansionMRR = currentMRR * (expansionRate / 100);
    const calculatedNetNewMRR = calculatedNewMRR + calculatedExpansionMRR - calculatedChurnedMRR;
    const calculatedProjectedMRR = currentMRR + calculatedNetNewMRR;
    const calculatedARR = calculatedProjectedMRR * 12;
    
    setNewMRR(calculatedNewMRR);
    setChurnedMRR(calculatedChurnedMRR);
    setExpansionMRR(calculatedExpansionMRR);
    setNetNewMRR(calculatedNetNewMRR);
    setProjectedMRR(calculatedProjectedMRR);
    setAnnualARR(calculatedARR);
    
    const growthRate = currentMRR > 0 ? (calculatedNetNewMRR / currentMRR) * 100 : 0;
    if (growthRate > 20) setStatus("Hypergrowth 🚀");
    else if (growthRate > 10) setStatus("Strong Growth 💚");
    else if (growthRate > 5) setStatus("Healthy Growth ✅");
    else if (growthRate > 0) setStatus("Slow Growth ⚠️");
    else setStatus("Declining 🔴");
  }, [currentMRR, newCustomers, avgRevenuePerUser, churnRate, expansionRate]);

  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthlyGrowthRate = netNewMRR / currentMRR;
    const projectedValue = currentMRR * Math.pow(1 + monthlyGrowthRate, month);
    return {
      month: `M${month}`,
      mrr: projectedValue,
      arr: projectedValue * 12
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "saas",
      data: { currentMRR, projectedMRR, churnRate, netNewMRR, status },
      message: `Current MRR: ₹${currentMRR.toLocaleString()}, projected: ₹${projectedMRR.toLocaleString()}, ${churnRate}% churn rate, ₹${netNewMRR.toLocaleString()} net new MRR. How can I optimize my SaaS metrics?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">SaaS MRR/ARR Estimator</h2>
          <p className="text-muted-foreground mt-2">
            Track Monthly Recurring Revenue and Annual Run Rate with churn analysis
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">SaaS Metrics</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentMRR">Current MRR (₹)</Label>
              <Input
                id="currentMRR"
                type="number"
                value={currentMRR}
                onChange={(e) => setCurrentMRR(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newCustomers">New Customers This Month</Label>
              <Input
                id="newCustomers"
                type="number"
                value={newCustomers}
                onChange={(e) => setNewCustomers(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="avgRevenuePerUser">Average Revenue Per User (₹)</Label>
              <Input
                id="avgRevenuePerUser"
                type="number"
                value={avgRevenuePerUser}
                onChange={(e) => setAvgRevenuePerUser(Number(e.target.value))}
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
            <div>
              <Label htmlFor="expansionRate">Expansion Revenue Rate (%)</Label>
              <Input
                id="expansionRate"
                type="number"
                value={expansionRate}
                onChange={(e) => setExpansionRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-green-400">₹{newMRR.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">New MRR</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-red-400">₹{churnedMRR.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Churned MRR</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-blue-400">₹{expansionMRR.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Expansion MRR</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-3xl font-bold ${netNewMRR >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{netNewMRR.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net New MRR</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary">
                ₹{projectedMRR.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Projected MRR</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-purple-400">
                ₹{annualARR.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Annual ARR</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Hypergrowth') ? 'bg-green-500/20 text-green-400' :
                status.includes('Strong') || status.includes('Healthy') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Slow') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">MRR Growth Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'MRR']} />
            <Area type="monotone" dataKey="mrr" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default SaaSMRREstimator;
