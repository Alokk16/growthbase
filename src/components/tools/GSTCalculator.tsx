
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface GSTCalculatorProps {
  onOpenChat: (context: any) => void;
}

const GSTCalculator = ({ onOpenChat }: GSTCalculatorProps) => {
  const [baseAmount, setBaseAmount] = useState(100000);
  const [gstRate, setGstRate] = useState("18");
  const [businessType, setBusinessType] = useState("regular");
  const [turnover, setTurnover] = useState(5000000);
  
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [annualGSTLiability, setAnnualGSTLiability] = useState(0);
  const [eligibleForComposition, setEligibleForComposition] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const rate = parseFloat(gstRate);
    const gst = (baseAmount * rate) / 100;
    const total = baseAmount + gst;
    
    // For intra-state transactions
    const cgstAmount = gst / 2;
    const sgstAmount = gst / 2;
    // For inter-state transactions
    const igstAmount = gst;
    
    const annualGST = (turnover * rate) / 100;
    const compositionEligible = turnover <= 15000000; // 1.5 Cr limit for composition scheme
    
    setGstAmount(gst);
    setTotalAmount(total);
    setCgst(cgstAmount);
    setSgst(sgstAmount);
    setIgst(igstAmount);
    setAnnualGSTLiability(annualGST);
    setEligibleForComposition(compositionEligible);
    
    if (annualGST > 200000) setStatus("High GST Liability ⚠️");
    else if (annualGST > 100000) setStatus("Moderate GST 📊");
    else if (annualGST > 50000) setStatus("Low GST ✅");
    else setStatus("Minimal GST 💚");
  }, [baseAmount, gstRate, turnover]);

  const pieData = [
    { name: 'Base Amount', value: baseAmount, color: '#3B82F6' },
    { name: 'GST', value: gstAmount, color: '#EF4444' }
  ];

  const gstBreakdown = [
    { name: 'CGST (Intra-state)', value: cgst, color: '#14B8A6' },
    { name: 'SGST (Intra-state)', value: sgst, color: '#F59E0B' },
    { name: 'IGST (Inter-state)', value: igst, color: '#8B5CF6' }
  ];

  const monthlyProjection = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    gstLiability: annualGSTLiability / 12,
    baseRevenue: (turnover / 12),
    totalWithGST: (turnover / 12) + (annualGSTLiability / 12)
  }));

  const COLORS = ['#3B82F6', '#EF4444'];

  const handleAskAlok = () => {
    onOpenChat({
      type: "gst",
      data: { gstAmount, annualGSTLiability, eligibleForComposition, status },
      message: `GST calculation: ₹${gstAmount.toLocaleString()} GST on ₹${baseAmount.toLocaleString()} at ${gstRate}% rate. Annual GST liability: ₹${annualGSTLiability.toLocaleString()}. ${eligibleForComposition ? 'Eligible' : 'Not eligible'} for composition scheme. How can I optimize my GST planning?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">GST Impact Calculator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate GST impact for Indian businesses with compliance insights
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="baseAmount">Base Amount (₹)</Label>
              <Input
                id="baseAmount"
                type="number"
                value={baseAmount}
                onChange={(e) => setBaseAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gstRate">GST Rate</Label>
              <Select value={gstRate} onValueChange={setGstRate}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="5">5% (Essential goods)</SelectItem>
                  <SelectItem value="12">12% (Standard goods)</SelectItem>
                  <SelectItem value="18">18% (Standard services)</SelectItem>
                  <SelectItem value="28">28% (Luxury goods)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular GST</SelectItem>
                  <SelectItem value="composition">Composition Scheme</SelectItem>
                  <SelectItem value="exempt">Tax Exempt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="turnover">Annual Turnover (₹)</Label>
              <Input
                id="turnover"
                type="number"
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">GST Calculation</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-red-400">
                ₹{gstAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">GST Amount ({gstRate}%)</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary">
                ₹{totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-green-400">₹{cgst.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">CGST</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-yellow-400">₹{sgst.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">SGST</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-purple-400">
                ₹{annualGSTLiability.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Annual GST Liability</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('High') ? 'bg-red-500/20 text-red-400' :
                status.includes('Moderate') ? 'bg-yellow-500/20 text-yellow-400' :
                status.includes('Low') ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Amount Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Compliance Info</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${eligibleForComposition ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <div className="font-semibold mb-2">
                {eligibleForComposition ? '✅ Composition Scheme Eligible' : '❌ Not Eligible for Composition'}
              </div>
              <div className="text-sm text-muted-foreground">
                {eligibleForComposition 
                  ? 'Turnover under ₹1.5 Cr. Consider composition scheme for simplified compliance.'
                  : 'Turnover exceeds ₹1.5 Cr. Must follow regular GST compliance.'
                }
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Key GST Limits (FY 2024-25):</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div>• GST Registration: ₹40 lakhs (₹10 lakhs for NE states)</div>
                <div>• Composition Scheme: ₹1.5 crores turnover limit</div>
                <div>• E-invoice: ₹5 crores turnover</div>
                <div>• Quarterly Filing: ₹5 crores turnover (QRMP)</div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <div className="font-semibold text-blue-400 mb-1">Monthly GST Liability</div>
              <div className="text-lg font-bold">₹{(annualGSTLiability / 12).toLocaleString()}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GSTCalculator;
