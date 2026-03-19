
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HourlyRateEstimatorProps {
  onOpenChat: (context: any) => void;
}

const HourlyRateEstimator = ({ onOpenChat }: HourlyRateEstimatorProps) => {
  const [desiredSalary, setDesiredSalary] = useState(1200000); // Annual
  const [billableHours, setBillableHours] = useState(1200); // Annual
  const [businessExpenses, setBusinessExpenses] = useState(200000); // Annual
  const [taxRate, setTaxRate] = useState(30);
  const [profitMargin, setProfitMargin] = useState(20);
  const [experience, setExperience] = useState("intermediate");
  
  const [minimumRate, setMinimumRate] = useState(0);
  const [recommendedRate, setRecommendedRate] = useState(0);
  const [premiumRate, setPremiumRate] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Calculate base requirement
    const totalCosts = desiredSalary + businessExpenses;
    const afterTax = totalCosts / (1 - taxRate / 100);
    const withProfit = afterTax * (1 + profitMargin / 100);
    
    const baseRate = billableHours > 0 ? withProfit / billableHours : 0;
    
    // Experience multipliers
    const multipliers = {
      beginner: 0.8,
      intermediate: 1.0,
      senior: 1.4,
      expert: 2.0
    };
    
    const multiplier = multipliers[experience as keyof typeof multipliers] || 1;
    
    const minRate = baseRate;
    const recRate = baseRate * multiplier;
    const premRate = recRate * 1.5;
    
    setMinimumRate(minRate);
    setRecommendedRate(recRate);
    setPremiumRate(premRate);
    setMonthlyIncome((recRate * billableHours) / 12);
    
    if (recRate > 5000) setStatus("Premium Expert 🚀");
    else if (recRate > 3000) setStatus("Senior Professional 💚");
    else if (recRate > 2000) setStatus("Experienced ✅");
    else if (recRate > 1000) setStatus("Intermediate ⚠️");
    else setStatus("Entry Level 🔴");
  }, [desiredSalary, billableHours, businessExpenses, taxRate, profitMargin, experience]);

  const rateData = [
    { name: 'Minimum', rate: minimumRate, color: '#EF4444' },
    { name: 'Recommended', rate: recommendedRate, color: '#14B8A6' },
    { name: 'Premium', rate: premiumRate, color: '#8B5CF6' }
  ];

  const breakdownData = [
    { name: 'Desired Salary', value: desiredSalary, color: '#3B82F6' },
    { name: 'Business Expenses', value: businessExpenses, color: '#F59E0B' },
    { name: 'Taxes', value: (desiredSalary + businessExpenses) * (taxRate / 100), color: '#EF4444' },
    { name: 'Profit', value: (desiredSalary + businessExpenses) * (profitMargin / 100), color: '#14B8A6' }
  ];

  const COLORS = ['#EF4444', '#14B8A6', '#8B5CF6'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "hourlyrate",
      data: { recommendedRate, monthlyIncome, experience, status },
      message: `Freelance rate calculation: ₹${recommendedRate.toFixed(0)}/hour recommended rate, ₹${monthlyIncome.toLocaleString()}/month potential income at ${experience} level. How can I optimize my freelance pricing?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Hourly Rate Estimator for Freelancers</h2>
          <p className="text-muted-foreground mt-2">
            Calculate your optimal freelance hourly rate based on costs and goals
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Financial Requirements</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="desiredSalary">Desired Annual Salary (₹)</Label>
              <Input
                id="desiredSalary"
                type="number"
                value={desiredSalary}
                onChange={(e) => setDesiredSalary(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="billableHours">Annual Billable Hours</Label>
              <Input
                id="billableHours"
                type="number"
                value={billableHours}
                onChange={(e) => setBillableHours(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="businessExpenses">Annual Business Expenses (₹)</Label>
              <Input
                id="businessExpenses"
                type="number"
                value={businessExpenses}
                onChange={(e) => setBusinessExpenses(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="profitMargin">Desired Profit Margin (%)</Label>
              <Input
                id="profitMargin"
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5-10 years)</SelectItem>
                  <SelectItem value="expert">Expert (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Rate Recommendations</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                ₹{recommendedRate.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Recommended Hourly Rate</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-red-400">₹{minimumRate.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">Minimum</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-purple-400">₹{premiumRate.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">Premium</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                ₹{monthlyIncome.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Potential Monthly Income</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Premium') ? 'bg-green-500/20 text-green-400' :
                status.includes('Senior') || status.includes('Experienced') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Intermediate') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Based on {billableHours} hours/year = {Math.round(billableHours/52)} hours/week
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Rate Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${value}`} />
            <Tooltip formatter={(value: number) => [`₹${value.toFixed(0)}/hour`, 'Rate']} />
            <Bar dataKey="rate" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default HourlyRateEstimator;
