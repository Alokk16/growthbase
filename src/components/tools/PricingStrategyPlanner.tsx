
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PricingStrategyPlannerProps {
  onOpenChat: (context: any) => void;
}

const PricingStrategyPlanner = ({ onOpenChat }: PricingStrategyPlannerProps) => {
  const [cost, setCost] = useState(500);
  const [desiredMargin, setDesiredMargin] = useState(40);
  const [competitorPrice, setCompetitorPrice] = useState(900);
  const [valuePerception, setValuePerception] = useState(85);
  const [priceElasticity, setPriceElasticity] = useState(-1.5);
  const [strategy, setStrategy] = useState("value-based");
  
  const [recommendedPrice, setRecommendedPrice] = useState(0);
  const [projectedDemand, setProjectedDemand] = useState(100);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let price = 0;
    
    switch (strategy) {
      case "cost-plus":
        price = cost / (1 - desiredMargin / 100);
        break;
      case "competitive":
        price = competitorPrice * 0.95; // 5% below competitor
        break;
      case "value-based":
        price = (competitorPrice * valuePerception) / 100;
        break;
      case "penetration":
        price = cost * 1.2; // 20% markup for market entry
        break;
      case "premium":
        price = competitorPrice * 1.25; // 25% premium
        break;
      default:
        price = cost / (1 - desiredMargin / 100);
    }
    
    // Calculate demand based on price elasticity
    const baseDemand = 100;
    const priceChange = (price - competitorPrice) / competitorPrice;
    const demandChange = priceElasticity * priceChange;
    const demand = Math.max(10, baseDemand * (1 + demandChange));
    
    const revenue = price * demand;
    
    setRecommendedPrice(price);
    setProjectedDemand(Math.round(demand));
    setTotalRevenue(revenue);
    
    const margin = ((price - cost) / price) * 100;
    if (margin > 50) setStatus("High Margin 💰");
    else if (margin > 30) setStatus("Good Margin ✅");
    else if (margin > 15) setStatus("Fair Margin ⚠️");
    else if (margin > 0) setStatus("Low Margin 🔴");
    else setStatus("Loss 🚨");
  }, [cost, desiredMargin, competitorPrice, valuePerception, priceElasticity, strategy]);

  const priceScenarios = [
    { price: cost * 1.2, strategy: "Penetration" },
    { price: cost / (1 - desiredMargin / 100), strategy: "Cost-Plus" },
    { price: competitorPrice * 0.95, strategy: "Competitive" },
    { price: (competitorPrice * valuePerception) / 100, strategy: "Value-Based" },
    { price: competitorPrice * 1.25, strategy: "Premium" }
  ].map(scenario => {
    const demand = Math.max(10, 100 * (1 + priceElasticity * ((scenario.price - competitorPrice) / competitorPrice)));
    const revenue = scenario.price * demand;
    const profit = (scenario.price - cost) * demand;
    return {
      ...scenario,
      demand: Math.round(demand),
      revenue: Math.round(revenue),
      profit: Math.round(profit),
      margin: ((scenario.price - cost) / scenario.price) * 100
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "pricing",
      data: { recommendedPrice, strategy, projectedDemand, totalRevenue, cost, competitorPrice, status },
      message: `Using ${strategy} strategy, recommended price is ₹${recommendedPrice.toFixed(0)} vs competitor's ₹${competitorPrice}. Expected ${projectedDemand} units demand. Good strategy?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Pricing Strategy Planner</h2>
          <p className="text-muted-foreground mt-2">
            Optimize your pricing strategy based on costs, competition, and value
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Pricing Inputs</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cost">Unit Cost (₹)</Label>
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="desiredMargin">Desired Margin (%)</Label>
              <Input
                id="desiredMargin"
                type="number"
                value={desiredMargin}
                onChange={(e) => setDesiredMargin(Number(e.target.value))}
                className="mt-1"
                max="90"
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
              <Label htmlFor="valuePerception">Value Perception (%)</Label>
              <Input
                id="valuePerception"
                type="number"
                value={valuePerception}
                onChange={(e) => setValuePerception(Number(e.target.value))}
                className="mt-1"
                max="150"
              />
            </div>
            <div>
              <Label htmlFor="priceElasticity">Price Elasticity</Label>
              <Input
                id="priceElasticity"
                type="number"
                value={priceElasticity}
                onChange={(e) => setPriceElasticity(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="strategy">Pricing Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost-plus">Cost-Plus</SelectItem>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="value-based">Value-Based</SelectItem>
                  <SelectItem value="penetration">Penetration</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Pricing Recommendation</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                ₹{recommendedPrice.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Recommended Price</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                {projectedDemand}
              </div>
              <div className="text-sm text-muted-foreground">Projected Units</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('High') ? 'bg-green-500/20 text-green-400' :
                status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Fair') ? 'bg-yellow-500/20 text-yellow-400' :
                status.includes('Low') ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Pricing Strategy Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceScenarios}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="strategy" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            <Bar dataKey="revenue" fill="#14B8A6" name="Revenue" />
            <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default PricingStrategyPlanner;
