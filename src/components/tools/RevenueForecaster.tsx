
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RevenueForecasterProps {
  onOpenChat: (context: any) => void;
}

const RevenueForecaster = ({ onOpenChat }: RevenueForecasterProps) => {
  const [currentRevenue, setCurrentRevenue] = useState(100000);
  const [growthRate, setGrowthRate] = useState(15); // Monthly growth rate %
  const [forecastPeriod, setForecastPeriod] = useState(12);
  const [growthModel, setGrowthModel] = useState("compound");
  
  const [projectedRevenue, setProjectedRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgMonthlyGrowth, setAvgMonthlyGrowth] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let forecastData: number[] = [];
    let total = 0;
    
    for (let month = 1; month <= forecastPeriod; month++) {
      let monthlyRevenue;
      
      if (growthModel === "compound") {
        // Compound growth: Revenue * (1 + growth_rate)^month
        monthlyRevenue = currentRevenue * Math.pow(1 + growthRate / 100, month);
      } else {
        // Linear growth: Revenue + (growth_rate * month * revenue / 100)
        monthlyRevenue = currentRevenue * (1 + (growthRate * month) / 100);
      }
      
      forecastData.push(monthlyRevenue);
      total += monthlyRevenue;
    }
    
    const finalRevenue = forecastData[forecastData.length - 1];
    const avgGrowth = ((finalRevenue - currentRevenue) / currentRevenue) * 100 / forecastPeriod;
    
    setProjectedRevenue(finalRevenue);
    setTotalRevenue(total);
    setAvgMonthlyGrowth(avgGrowth);
    
    if (avgGrowth > 20) {
      setStatus("Aggressive Growth 🚀");
    } else if (avgGrowth > 10) {
      setStatus("Strong Growth 💚");
    } else if (avgGrowth > 5) {
      setStatus("Steady Growth ✅");
    } else if (avgGrowth > 0) {
      setStatus("Slow Growth ⚠️");
    } else {
      setStatus("Declining 🔴");
    }
  }, [currentRevenue, growthRate, forecastPeriod, growthModel]);

  // Generate chart data
  const chartData = Array.from({ length: forecastPeriod }, (_, i) => {
    const month = i + 1;
    let revenue;
    
    if (growthModel === "compound") {
      revenue = currentRevenue * Math.pow(1 + growthRate / 100, month);
    } else {
      revenue = currentRevenue * (1 + (growthRate * month) / 100);
    }
    
    return {
      month: `M${month}`,
      revenue: Math.round(revenue),
      growth: month === 1 ? 0 : ((revenue - currentRevenue) / currentRevenue) * 100
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "revenue",
      data: {
        currentRevenue,
        projectedRevenue,
        totalRevenue,
        growthRate,
        avgMonthlyGrowth,
        forecastPeriod,
        growthModel,
        status
      },
      message: `I'm projecting ${growthRate}% ${growthModel} growth over ${forecastPeriod} months. From ₹${currentRevenue.toLocaleString()} to ₹${projectedRevenue.toLocaleString()}. Is this realistic?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Revenue Forecast Simulator</h2>
          <p className="text-muted-foreground mt-2">
            Project future revenue based on growth assumptions
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Forecast Parameters</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentRevenue">Current Monthly Revenue (₹)</Label>
              <Input
                id="currentRevenue"
                type="number"
                value={currentRevenue}
                onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
              <Input
                id="growthRate"
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            
            <div>
              <Label htmlFor="forecastPeriod">Forecast Period (Months)</Label>
              <Input
                id="forecastPeriod"
                type="number"
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(Number(e.target.value))}
                className="mt-1"
                min="1"
                max="60"
              />
            </div>
            
            <div>
              <Label htmlFor="growthModel">Growth Model</Label>
              <Select value={growthModel} onValueChange={setGrowthModel}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compound">Compound Growth</SelectItem>
                  <SelectItem value="linear">Linear Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Forecast Results</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary">
                ₹{projectedRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Final Month Revenue</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                {avgMonthlyGrowth.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Monthly Growth</div>
            </div>
            
            <div className="text-center">
              <Badge 
                className={`${
                  status.includes('Aggressive') ? 'bg-purple-500/20 text-purple-400' :
                  status.includes('Strong') ? 'bg-green-500/20 text-green-400' :
                  status.includes('Steady') ? 'bg-blue-500/20 text-blue-400' :
                  status.includes('Slow') ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}
              >
                {status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Growth Insights</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-sm font-medium">Growth Multiple</div>
              <div className="text-lg font-bold text-primary">
                {(projectedRevenue / currentRevenue).toFixed(1)}x
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-sm font-medium">Revenue Increase</div>
              <div className="text-lg font-bold text-green-400">
                ₹{(projectedRevenue - currentRevenue).toLocaleString()}
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-sm font-medium">Model Used</div>
              <div className="text-sm font-semibold capitalize text-blue-400">
                {growthModel} Growth
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Compound: Exponential growth</p>
              <p>• Linear: Steady incremental growth</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Growth Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
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
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue Bars</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default RevenueForecaster;
