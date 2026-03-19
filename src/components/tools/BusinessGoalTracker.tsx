
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface BusinessGoalTrackerProps {
  onOpenChat: (context: any) => void;
}

const BusinessGoalTracker = ({ onOpenChat }: BusinessGoalTrackerProps) => {
  const [userTarget, setUserTarget] = useState(10000);
  const [currentUsers, setCurrentUsers] = useState(6500);
  const [salesTarget, setSalesTarget] = useState(2000000);
  const [currentSales, setCurrentSales] = useState(1200000);
  const [revenueTarget, setRevenueTarget] = useState(5000000);
  const [currentRevenue, setCurrentRevenue] = useState(3200000);
  const [timeframe, setTimeframe] = useState(12);
  
  const [userProgress, setUserProgress] = useState(0);
  const [salesProgress, setSalesProgress] = useState(0);
  const [revenueProgress, setRevenueProgress] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const userProg = userTarget > 0 ? Math.min((currentUsers / userTarget) * 100, 100) : 0;
    const salesProg = salesTarget > 0 ? Math.min((currentSales / salesTarget) * 100, 100) : 0;
    const revenueProg = revenueTarget > 0 ? Math.min((currentRevenue / revenueTarget) * 100, 100) : 0;
    const overall = (userProg + salesProg + revenueProg) / 3;
    
    setUserProgress(userProg);
    setSalesProgress(salesProg);
    setRevenueProgress(revenueProg);
    setOverallScore(overall);
    
    if (overall >= 90) setStatus("Exceptional 🚀");
    else if (overall >= 75) setStatus("Excellent 💚");
    else if (overall >= 60) setStatus("Good Progress ✅");
    else if (overall >= 40) setStatus("On Track ⚠️");
    else setStatus("Needs Focus 🔴");
  }, [userTarget, currentUsers, salesTarget, currentSales, revenueTarget, currentRevenue]);

  const progressData = [
    { name: 'Users', current: currentUsers, target: userTarget, progress: userProgress },
    { name: 'Sales', current: currentSales, target: salesTarget, progress: salesProgress },
    { name: 'Revenue', current: currentRevenue, target: revenueTarget, progress: revenueProgress }
  ];

  const timelineData = Array.from({ length: Math.min(timeframe, 12) }, (_, i) => {
    const month = i + 1;
    const monthlyUserGrowth = (userTarget - currentUsers) / timeframe;
    const monthlySalesGrowth = (salesTarget - currentSales) / timeframe;
    const monthlyRevenueGrowth = (revenueTarget - currentRevenue) / timeframe;
    
    return {
      month: `M${month}`,
      users: Math.max(0, currentUsers + (monthlyUserGrowth * month)),
      sales: Math.max(0, currentSales + (monthlySalesGrowth * month)),
      revenue: Math.max(0, currentRevenue + (monthlyRevenueGrowth * month))
    };
  });

  const handleAskAlok = () => {
    onOpenChat({
      type: "businessgoals",
      data: { overallScore, userProgress, salesProgress, revenueProgress, status },
      message: `Business goals analysis: ${overallScore.toFixed(1)}% overall progress - Users: ${userProgress.toFixed(1)}%, Sales: ${salesProgress.toFixed(1)}%, Revenue: ${revenueProgress.toFixed(1)}%. Status: ${status}. How can I accelerate my business growth?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Business Goal Tracker</h2>
          <p className="text-muted-foreground mt-2">
            Track users, sales, and revenue targets with progress visualization
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Goal Setting</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentUsers">Current Users</Label>
                <Input
                  id="currentUsers"
                  type="number"
                  value={currentUsers}
                  onChange={(e) => setCurrentUsers(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="userTarget">User Target</Label>
                <Input
                  id="userTarget"
                  type="number"
                  value={userTarget}
                  onChange={(e) => setUserTarget(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentSales">Current Sales (₹)</Label>
                <Input
                  id="currentSales"
                  type="number"
                  value={currentSales}
                  onChange={(e) => setCurrentSales(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="salesTarget">Sales Target (₹)</Label>
                <Input
                  id="salesTarget"
                  type="number"
                  value={salesTarget}
                  onChange={(e) => setSalesTarget(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentRevenue">Current Revenue (₹)</Label>
                <Input
                  id="currentRevenue"
                  type="number"
                  value={currentRevenue}
                  onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="revenueTarget">Revenue Target (₹)</Label>
                <Input
                  id="revenueTarget"
                  type="number"
                  value={revenueTarget}
                  onChange={(e) => setRevenueTarget(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="timeframe">Timeframe (months)</Label>
              <Input
                id="timeframe"
                type="number"
                value={timeframe}
                onChange={(e) => setTimeframe(Math.max(1, Math.min(24, Number(e.target.value))))}
                className="mt-1"
                min="1"
                max="24"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Progress Overview</h3>
          <div className="space-y-4">
            <div className="text-center p-6 rounded-lg bg-white/5">
              <div className="text-4xl font-bold text-primary mb-2">
                {overallScore.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mb-4">Overall Progress</div>
              <Badge className={`${
                status.includes('Exceptional') ? 'bg-green-500/20 text-green-400' :
                status.includes('Excellent') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('On Track') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Users Progress</span>
                <span className="text-sm text-primary">{userProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(userProgress, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sales Progress</span>
                <span className="text-sm text-primary">{salesProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(salesProgress, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Revenue Progress</span>
                <span className="text-sm text-primary">{revenueProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Current vs Target</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === 'current') return [value.toLocaleString(), 'Current'];
                if (name === 'target') return [value.toLocaleString(), 'Target'];
                return [value.toLocaleString(), name];
              }} />
              <Bar dataKey="current" fill="#14B8A6" />
              <Bar dataKey="target" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Goal Achievement Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === 'users') return [value.toFixed(0), 'Users'];
                return [`₹${value.toLocaleString()}`, name === 'sales' ? 'Sales' : 'Revenue'];
              }} />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="sales" stroke="#14B8A6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default BusinessGoalTracker;
