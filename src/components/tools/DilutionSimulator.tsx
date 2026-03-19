
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DilutionSimulatorProps {
  onOpenChat: (context: any) => void;
}

const DilutionSimulator = ({ onOpenChat }: DilutionSimulatorProps) => {
  const [preMoneyValuation, setPreMoneyValuation] = useState(10000000);
  const [fundingAmount, setFundingAmount] = useState(2000000);
  const [founderShares, setFounderShares] = useState(80);
  const [employeePool, setEmployeePool] = useState(15);
  
  const [postMoneyValuation, setPostMoneyValuation] = useState(0);
  const [investorEquity, setInvestorEquity] = useState(0);
  const [dilutedFounderEquity, setDilutedFounderEquity] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const postMoney = preMoneyValuation + fundingAmount;
    const investorPercentage = (fundingAmount / postMoney) * 100;
    const remainingEquity = 100 - investorPercentage;
    const dilutedFounder = (founderShares / 100) * remainingEquity;
    const dilutedEmployee = (employeePool / 100) * remainingEquity;
    
    setPostMoneyValuation(postMoney);
    setInvestorEquity(investorPercentage);
    setDilutedFounderEquity(dilutedFounder);
    
    if (dilutedFounder > 60) setStatus("Strong Control 💪");
    else if (dilutedFounder > 40) setStatus("Good Position ✅");
    else if (dilutedFounder > 25) setStatus("Moderate Control ⚠️");
    else setStatus("High Dilution 🔴");
  }, [preMoneyValuation, fundingAmount, founderShares, employeePool]);

  const pieData = [
    { name: 'Founder', value: dilutedFounderEquity, color: '#14B8A6' },
    { name: 'Investor', value: investorEquity, color: '#3B82F6' },
    { name: 'Employee Pool', value: (employeePool / 100) * (100 - investorEquity), color: '#F59E0B' },
    { name: 'Available', value: Math.max(0, 100 - dilutedFounderEquity - investorEquity - (employeePool / 100) * (100 - investorEquity)), color: '#8B5CF6' }
  ];

  const COLORS = ['#14B8A6', '#3B82F6', '#F59E0B', '#8B5CF6'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "dilution",
      data: { preMoneyValuation, fundingAmount, investorEquity, dilutedFounderEquity, status },
      message: `Raising ₹${fundingAmount.toLocaleString()} at ₹${preMoneyValuation.toLocaleString()} pre-money. Investor gets ${investorEquity.toFixed(1)}%, I keep ${dilutedFounderEquity.toFixed(1)}%. Fair deal?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Funding Dilution Simulator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate equity dilution from funding rounds
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Funding Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="preMoneyValuation">Pre-Money Valuation (₹)</Label>
              <Input
                id="preMoneyValuation"
                type="number"
                value={preMoneyValuation}
                onChange={(e) => setPreMoneyValuation(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fundingAmount">Funding Amount (₹)</Label>
              <Input
                id="fundingAmount"
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="founderShares">Current Founder Equity (%)</Label>
              <Input
                id="founderShares"
                type="number"
                value={founderShares}
                onChange={(e) => setFounderShares(Number(e.target.value))}
                className="mt-1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="employeePool">Employee Pool (%)</Label>
              <Input
                id="employeePool"
                type="number"
                value={employeePool}
                onChange={(e) => setEmployeePool(Number(e.target.value))}
                className="mt-1"
                max="50"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Dilution Results</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-blue-400">
                ₹{postMoneyValuation.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Post-Money Valuation</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {dilutedFounderEquity.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Your New Equity</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-green-400">
                {investorEquity.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Investor Equity</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Strong') ? 'bg-green-500/20 text-green-400' :
                status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Moderate') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Equity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Equity']} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DilutionSimulator;
