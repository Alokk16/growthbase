
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart } from 'recharts';

interface ConversionTrackerProps {
  onOpenChat: (context: any) => void;
}

const ConversionTracker = ({ onOpenChat }: ConversionTrackerProps) => {
  const [totalLeads, setTotalLeads] = useState(1000);
  const [qualifiedLeads, setQualifiedLeads] = useState(400);
  const [opportunities, setOpportunities] = useState(150);
  const [customers, setCustomers] = useState(60);
  const [avgDealValue, setAvgDealValue] = useState(25000);
  
  const [leadQualificationRate, setLeadQualificationRate] = useState(0);
  const [opportunityRate, setOpportunityRate] = useState(0);
  const [closingRate, setClosingRate] = useState(0);
  const [overallConversion, setOverallConversion] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const qualRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    const oppRate = qualifiedLeads > 0 ? (opportunities / qualifiedLeads) * 100 : 0;
    const closeRate = opportunities > 0 ? (customers / opportunities) * 100 : 0;
    const overallRate = totalLeads > 0 ? (customers / totalLeads) * 100 : 0;
    const revenue = customers * avgDealValue;
    
    setLeadQualificationRate(qualRate);
    setOpportunityRate(oppRate);
    setClosingRate(closeRate);
    setOverallConversion(overallRate);
    setTotalRevenue(revenue);
    
    if (overallRate > 8) setStatus("Excellent 🚀");
    else if (overallRate > 5) setStatus("Very Good 💚");
    else if (overallRate > 3) setStatus("Good ✅");
    else if (overallRate > 1) setStatus("Needs Work ⚠️");
    else setStatus("Critical 🔴");
  }, [totalLeads, qualifiedLeads, opportunities, customers, avgDealValue]);

  const funnelData = [
    { name: 'Total Leads', value: totalLeads, rate: 100 },
    { name: 'Qualified Leads', value: qualifiedLeads, rate: leadQualificationRate },
    { name: 'Opportunities', value: opportunities, rate: opportunityRate },
    { name: 'Customers', value: customers, rate: closingRate }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "conversion",
      data: { overallConversion, closingRate, totalRevenue, status },
      message: `Lead conversion funnel: ${overallConversion.toFixed(1)}% overall, ${closingRate.toFixed(1)}% closing rate, ₹${totalRevenue.toLocaleString()} revenue from ${customers} customers. How can I improve conversions?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Lead-to-Customer Conversion Tracker</h2>
          <p className="text-muted-foreground mt-2">
            Track and optimize your sales funnel conversion rates
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Funnel Inputs</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalLeads">Total Leads</Label>
              <Input
                id="totalLeads"
                type="number"
                value={totalLeads}
                onChange={(e) => setTotalLeads(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="qualifiedLeads">Qualified Leads</Label>
              <Input
                id="qualifiedLeads"
                type="number"
                value={qualifiedLeads}
                onChange={(e) => setQualifiedLeads(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="opportunities">Opportunities</Label>
              <Input
                id="opportunities"
                type="number"
                value={opportunities}
                onChange={(e) => setOpportunities(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customers">Customers Won</Label>
              <Input
                id="customers"
                type="number"
                value={customers}
                onChange={(e) => setCustomers(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="avgDealValue">Average Deal Value (₹)</Label>
              <Input
                id="avgDealValue"
                type="number"
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Conversion Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-blue-400">{leadQualificationRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Lead Qual.</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-green-400">{opportunityRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Opp. Rate</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-orange-400">{closingRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Closing Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {overallConversion.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Conversion</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Very Good') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Needs Work') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {funnelData.map((stage, index) => (
            <div key={stage.name} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium">{stage.name}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                <div 
                  className="bg-primary h-6 rounded-full transition-all duration-300"
                  style={{ width: `${(stage.value / totalLeads) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {stage.value} ({stage.rate.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ConversionTracker;
