
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdSpendROIEstimatorProps {
  onOpenChat: (context: any) => void;
}

const AdSpendROIEstimator = ({ onOpenChat }: AdSpendROIEstimatorProps) => {
  const [adSpend, setAdSpend] = useState(50000);
  const [clicks, setClicks] = useState(2500);
  const [conversions, setConversions] = useState(125);
  const [avgOrderValue, setAvgOrderValue] = useState(800);
  const [marginPercent, setMarginPercent] = useState(30);
  
  const [cpc, setCpc] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [cpa, setCpa] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [roi, setRoi] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const calculatedCpc = clicks > 0 ? adSpend / clicks : 0;
    const calculatedConversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const calculatedCpa = conversions > 0 ? adSpend / conversions : 0;
    const calculatedRevenue = conversions * avgOrderValue;
    const calculatedProfit = (calculatedRevenue * marginPercent / 100) - adSpend;
    const calculatedRoi = adSpend > 0 ? (calculatedProfit / adSpend) * 100 : 0;
    
    setCpc(calculatedCpc);
    setConversionRate(calculatedConversionRate);
    setCpa(calculatedCpa);
    setRevenue(calculatedRevenue);
    setProfit(calculatedProfit);
    setRoi(calculatedRoi);
    
    if (calculatedRoi > 200) setStatus("Excellent 🚀");
    else if (calculatedRoi > 100) setStatus("Very Good 💚");
    else if (calculatedRoi > 50) setStatus("Good ✅");
    else if (calculatedRoi > 0) setStatus("Profitable ⚠️");
    else setStatus("Loss Making 🔴");
  }, [adSpend, clicks, conversions, avgOrderValue, marginPercent]);

  const chartData = [
    { name: 'Ad Spend', value: adSpend, type: 'expense' },
    { name: 'Revenue', value: revenue, type: 'income' },
    { name: 'Profit', value: Math.max(0, profit), type: 'profit' }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "adspend",
      data: { adSpend, roi, cpa, conversionRate, status },
      message: `Ad spend: ₹${adSpend.toLocaleString()}, ROI: ${roi.toFixed(1)}%, CPA: ₹${cpa.toLocaleString()}, conversion rate: ${conversionRate.toFixed(1)}%. How can I optimize my ad performance?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Ad Spend ROI Estimator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate return on investment for your advertising campaigns
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Campaign Inputs</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adSpend">Total Ad Spend (₹)</Label>
              <Input
                id="adSpend"
                type="number"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="clicks">Total Clicks</Label>
              <Input
                id="clicks"
                type="number"
                value={clicks}
                onChange={(e) => setClicks(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="conversions">Total Conversions</Label>
              <Input
                id="conversions"
                type="number"
                value={conversions}
                onChange={(e) => setConversions(Number(e.target.value))}
                className="mt-1"
              />
            </div>
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
              <Label htmlFor="marginPercent">Profit Margin (%)</Label>
              <Input
                id="marginPercent"
                type="number"
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-blue-400">₹{cpc.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">CPC</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-green-400">{conversionRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Conv. Rate</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-orange-400">₹{cpa.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Cost Per Acquisition</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-3xl font-bold ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {roi.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Very Good') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Profitable') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Revenue vs Spend Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdSpendROIEstimator;
