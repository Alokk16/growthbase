
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ReferralGrowthProjectorProps {
  onOpenChat: (context: any) => void;
}

const ReferralGrowthProjector = ({ onOpenChat }: ReferralGrowthProjectorProps) => {
  const [initialCustomers, setInitialCustomers] = useState(100);
  const [referralRate, setReferralRate] = useState(15);
  const [conversionRate, setConversionRate] = useState(25);
  const [avgReferralsPerCustomer, setAvgReferralsPerCustomer] = useState(3);
  const [months, setMonths] = useState(12);
  
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [referralCustomers, setReferralCustomers] = useState(0);
  const [viralCoefficient, setViralCoefficient] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const viral = (referralRate / 100) * (conversionRate / 100) * avgReferralsPerCustomer;
    setViralCoefficient(viral);
    
    // Calculate growth over time using viral coefficient
    let customers = initialCustomers;
    let referrals = 0;
    
    for (let i = 0; i < months; i++) {
      const newReferrals = customers * viral;
      referrals += newReferrals;
      customers += newReferrals;
    }
    
    setTotalCustomers(customers);
    setReferralCustomers(referrals);
    
    const growth = initialCustomers > 0 ? ((customers - initialCustomers) / initialCustomers) * 100 : 0;
    setGrowthRate(growth);
    
    if (viral > 1) setStatus("Viral Growth 🚀");
    else if (viral > 0.5) setStatus("Strong Referrals 💚");
    else if (viral > 0.25) setStatus("Good Program ✅");
    else if (viral > 0.1) setStatus("Needs Work ⚠️");
    else setStatus("Low Impact 🔴");
  }, [initialCustomers, referralRate, conversionRate, avgReferralsPerCustomer, months]);

  const projectionData = Array.from({ length: months }, (_, i) => {
    let customers = initialCustomers;
    for (let j = 0; j <= i; j++) {
      customers += customers * viralCoefficient;
    }
    return {
      month: `M${i + 1}`,
      customers: Math.round(customers),
      referralCustomers: Math.round(customers - initialCustomers)
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "referral",
      data: { viralCoefficient, growthRate, totalCustomers, status },
      message: `Referral program: ${viralCoefficient.toFixed(2)} viral coefficient, ${growthRate.toFixed(0)}% growth to ${Math.round(totalCustomers)} customers in ${months} months. How can I improve my referral program?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Referral Growth Projection Tool</h2>
          <p className="text-muted-foreground mt-2">
            Model viral growth potential of your referral program
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Referral Parameters</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="initialCustomers">Initial Customers</Label>
              <Input
                id="initialCustomers"
                type="number"
                value={initialCustomers}
                onChange={(e) => setInitialCustomers(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="referralRate">Referral Rate (%)</Label>
              <Input
                id="referralRate"
                type="number"
                value={referralRate}
                onChange={(e) => setReferralRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="conversionRate">Referral Conversion Rate (%)</Label>
              <Input
                id="conversionRate"
                type="number"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="avgReferralsPerCustomer">Avg Referrals per Customer</Label>
              <Input
                id="avgReferralsPerCustomer"
                type="number"
                value={avgReferralsPerCustomer}
                onChange={(e) => setAvgReferralsPerCustomer(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="months">Projection Period (Months)</Label>
              <Input
                id="months"
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="mt-1"
                min="1"
                max="36"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Growth Metrics</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {viralCoefficient.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Viral Coefficient</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(totalCustomers).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Customers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                {Math.round(referralCustomers).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">From Referrals</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-purple-400">
                {growthRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Total Growth</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Viral') ? 'bg-green-500/20 text-green-400' :
                status.includes('Strong') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Needs Work') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Viral coefficient &gt; 1 = exponential growth
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Customer Growth Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Customers']} />
            <Area type="monotone" dataKey="customers" stackId="1" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="referralCustomers" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ReferralGrowthProjector;
