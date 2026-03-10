
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ValueBasedPricingPlannerProps {
  onOpenChat: (context: any) => void;
}

const ValueBasedPricingPlanner = ({ onOpenChat }: ValueBasedPricingPlannerProps) => {
  const [clientCurrentCost, setClientCurrentCost] = useState(200000);
  const [valueCreated, setValueCreated] = useState(800000);
  const [implementationTime, setImplementationTime] = useState(6); // months
  const [maintenanceCost, setMaintenanceCost] = useState(50000);
  const [competitorPrice, setCompetitorPrice] = useState(400000);
  const [yourCostToDeliver, setYourCostToDeliver] = useState(150000);
  
  const [netValueToClient, setNetValueToClient] = useState(0);
  const [valueBasedPrice, setValueBasedPrice] = useState(0);
  const [costPlusPrice, setCostPlusPrice] = useState(0);
  const [recommendedPrice, setRecommendedPrice] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const netValue = valueCreated - clientCurrentCost - maintenanceCost;
    const valuePrice = netValue * 0.3; // 30% of value created
    const costPrice = yourCostToDeliver * 2; // 100% markup
    const recommended = Math.min(valuePrice, Math.max(costPrice, competitorPrice * 0.9));
    const margin = recommended > 0 ? ((recommended - yourCostToDeliver) / recommended) * 100 : 0;
    
    setNetValueToClient(netValue);
    setValueBasedPrice(valuePrice);
    setCostPlusPrice(costPrice);
    setRecommendedPrice(recommended);
    setProfitMargin(margin);
    
    if (margin > 70) setStatus("Premium Value 🚀");
    else if (margin > 50) setStatus("High Value 💚");
    else if (margin > 30) setStatus("Good Value ✅");
    else if (margin > 10) setStatus("Low Margin ⚠️");
    else setStatus("Unprofitable 🔴");
  }, [clientCurrentCost, valueCreated, implementationTime, maintenanceCost, competitorPrice, yourCostToDeliver]);

  const pricingComparison = [
    { name: 'Cost-Plus', price: costPlusPrice, color: '#EF4444' },
    { name: 'Value-Based', price: valueBasedPrice, color: '#14B8A6' },
    { name: 'Competitor', price: competitorPrice, color: '#F59E0B' },
    { name: 'Recommended', price: recommendedPrice, color: '#8B5CF6' }
  ];

  const valueBreakdown = [
    { name: 'Value Created', value: valueCreated, color: '#14B8A6' },
    { name: 'Current Cost', value: clientCurrentCost, color: '#EF4444' },
    { name: 'Maintenance', value: maintenanceCost, color: '#F59E0B' },
    { name: 'Net Value', value: Math.max(0, netValueToClient), color: '#8B5CF6' }
  ];

  const COLORS = ['#EF4444', '#14B8A6', '#F59E0B', '#8B5CF6'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "valuepricing",
      data: { recommendedPrice, profitMargin, netValueToClient, status },
      message: `Value-based pricing: ₹${recommendedPrice.toLocaleString()} recommended price, ${profitMargin.toFixed(1)}% margin, ₹${netValueToClient.toLocaleString()} net value to client. How can I optimize my pricing strategy?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Value-Based Pricing Planner</h2>
          <p className="text-muted-foreground mt-2">
            Price based on value delivered rather than cost incurred
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Value Assessment</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientCurrentCost">Client's Current Cost (₹)</Label>
              <Input
                id="clientCurrentCost"
                type="number"
                value={clientCurrentCost}
                onChange={(e) => setClientCurrentCost(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="valueCreated">Value You'll Create (₹)</Label>
              <Input
                id="valueCreated"
                type="number"
                value={valueCreated}
                onChange={(e) => setValueCreated(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="implementationTime">Implementation Time (months)</Label>
              <Input
                id="implementationTime"
                type="number"
                value={implementationTime}
                onChange={(e) => setImplementationTime(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maintenanceCost">Annual Maintenance Cost (₹)</Label>
              <Input
                id="maintenanceCost"
                type="number"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="competitorPrice">Competitor Price (₹)</Label>
              <Input
                id="competitorPrice"
                type="number"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="yourCostToDeliver">Your Cost to Deliver (₹)</Label>
              <Input
                id="yourCostToDeliver"
                type="number"
                value={yourCostToDeliver}
                onChange={(e) => setYourCostToDeliver(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Pricing Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                ₹{recommendedPrice.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Recommended Price</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-green-400">₹{valueBasedPrice.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Value-Based</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-blue-400">₹{costPlusPrice.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Cost-Plus</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-purple-400">
                {profitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Profit Margin</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-green-400">
                ₹{netValueToClient.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net Value to Client</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Premium') ? 'bg-green-500/20 text-green-400' :
                status.includes('High') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Low') ? 'bg-yellow-500/20 text-yellow-400' :
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
          <h3 className="text-xl font-semibold mb-4">Pricing Strategy Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pricingComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']} />
              <Bar dataKey="price" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Value Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={valueBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {valueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ValueBasedPricingPlanner;
