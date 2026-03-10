
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface BundleRevenueOptimizerProps {
  onOpenChat: (context: any) => void;
}

const BundleRevenueOptimizer = ({ onOpenChat }: BundleRevenueOptimizerProps) => {
  const [product1Price, setProduct1Price] = useState(500);
  const [product2Price, setProduct2Price] = useState(800);
  const [product3Price, setProduct3Price] = useState(1200);
  const [bundlePrice, setBundlePrice] = useState(2000);
  const [bundleAdoptionRate, setBundleAdoptionRate] = useState(35);
  const [totalCustomers, setTotalCustomers] = useState(1000);
  
  const [individualRevenue, setIndividualRevenue] = useState(0);
  const [bundleRevenue, setBundleRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bundleDiscount, setBundleDiscount] = useState(0);
  const [revenueUplift, setRevenueUplift] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const individualTotal = product1Price + product2Price + product3Price;
    const discount = individualTotal > 0 ? ((individualTotal - bundlePrice) / individualTotal) * 100 : 0;
    
    const bundleCustomers = totalCustomers * (bundleAdoptionRate / 100);
    const individualCustomers = totalCustomers - bundleCustomers;
    
    // Assume individual customers buy average of 1.5 products
    const avgIndividualSpend = (product1Price + product2Price + product3Price) / 3 * 1.5;
    const indRevenue = individualCustomers * avgIndividualSpend;
    const bunRevenue = bundleCustomers * bundlePrice;
    const totRevenue = indRevenue + bunRevenue;
    
    // Compare with all individual sales
    const allIndividualRevenue = totalCustomers * avgIndividualSpend;
    const uplift = allIndividualRevenue > 0 ? ((totRevenue - allIndividualRevenue) / allIndividualRevenue) * 100 : 0;
    
    setBundleDiscount(discount);
    setIndividualRevenue(indRevenue);
    setBundleRevenue(bunRevenue);
    setTotalRevenue(totRevenue);
    setRevenueUplift(uplift);
    
    if (uplift > 30) setStatus("Excellent Bundle 🚀");
    else if (uplift > 20) setStatus("Strong Bundle 💚");
    else if (uplift > 10) setStatus("Good Bundle ✅");
    else if (uplift > 0) setStatus("Slight Benefit ⚠️");
    else setStatus("Bundle Hurts Revenue 🔴");
  }, [product1Price, product2Price, product3Price, bundlePrice, bundleAdoptionRate, totalCustomers]);

  const revenueData = [
    { name: 'Individual Sales', value: individualRevenue, fill: '#3B82F6' },
    { name: 'Bundle Sales', value: bundleRevenue, fill: '#14B8A6' }
  ];

  const comparisonData = [
    { name: 'Product 1', individual: product1Price, bundle: bundlePrice / 3 },
    { name: 'Product 2', individual: product2Price, bundle: bundlePrice / 3 },
    { name: 'Product 3', individual: product3Price, bundle: bundlePrice / 3 }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "bundle",
      data: { bundleDiscount, revenueUplift, totalRevenue, status },
      message: `Bundle strategy: ${bundleDiscount.toFixed(1)}% discount, ${revenueUplift.toFixed(1)}% revenue uplift, total revenue ₹${totalRevenue.toLocaleString()}. How can I optimize my bundling strategy?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Bundle vs A-la-Carte Revenue Optimizer</h2>
          <p className="text-muted-foreground mt-2">
            Compare revenue impact of bundled vs individual product pricing
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Pricing Strategy</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product1Price">Product 1 Price (₹)</Label>
              <Input
                id="product1Price"
                type="number"
                value={product1Price}
                onChange={(e) => setProduct1Price(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="product2Price">Product 2 Price (₹)</Label>
              <Input
                id="product2Price"
                type="number"
                value={product2Price}
                onChange={(e) => setProduct2Price(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="product3Price">Product 3 Price (₹)</Label>
              <Input
                id="product3Price"
                type="number"
                value={product3Price}
                onChange={(e) => setProduct3Price(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bundlePrice">Bundle Price (₹)</Label>
              <Input
                id="bundlePrice"
                type="number"
                value={bundlePrice}
                onChange={(e) => setBundlePrice(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bundleAdoptionRate">Bundle Adoption Rate (%)</Label>
              <Input
                id="bundleAdoptionRate"
                type="number"
                value={bundleAdoptionRate}
                onChange={(e) => setBundleAdoptionRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="totalCustomers">Total Customers</Label>
              <Input
                id="totalCustomers"
                type="number"
                value={totalCustomers}
                onChange={(e) => setTotalCustomers(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-orange-400">
                {bundleDiscount.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Bundle Discount</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-blue-400">₹{individualRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Individual</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-green-400">₹{bundleRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Bundle</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className={`text-2xl font-bold ${revenueUplift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {revenueUplift > 0 ? '+' : ''}{revenueUplift.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Revenue Uplift</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Excellent') ? 'bg-green-500/20 text-green-400' :
                status.includes('Strong') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Slight') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={revenueData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default BundleRevenueOptimizer;
