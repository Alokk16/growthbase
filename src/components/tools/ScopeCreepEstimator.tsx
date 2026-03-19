
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ScopeCreepEstimatorProps {
  onOpenChat: (context: any) => void;
}

const ScopeCreepEstimator = ({ onOpenChat }: ScopeCreepEstimatorProps) => {
  const [originalBudget, setOriginalBudget] = useState(500000);
  const [originalTimeline, setOriginalTimeline] = useState(12); // weeks
  const [additionalFeatures, setAdditionalFeatures] = useState(8);
  const [avgFeatureCost, setAvgFeatureCost] = useState(25000);
  const [avgFeatureTime, setAvgFeatureTime] = useState(1.5); // weeks
  const [hourlyRate, setHourlyRate] = useState(2000);
  
  const [additionalCost, setAdditionalCost] = useState(0);
  const [additionalTime, setAdditionalTime] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [scopeCreepPercent, setScopeCreepPercent] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const addCost = additionalFeatures * avgFeatureCost;
    const addTime = additionalFeatures * avgFeatureTime;
    const totCost = originalBudget + addCost;
    const totTime = originalTimeline + addTime;
    const creepPercent = originalBudget > 0 ? (addCost / originalBudget) * 100 : 0;
    
    setAdditionalCost(addCost);
    setAdditionalTime(addTime);
    setTotalCost(totCost);
    setTotalTime(totTime);
    setScopeCreepPercent(creepPercent);
    
    if (creepPercent > 50) setStatus("Critical Creep 🔴");
    else if (creepPercent > 30) setStatus("High Creep ⚠️");
    else if (creepPercent > 15) setStatus("Moderate Creep 📊");
    else if (creepPercent > 5) setStatus("Minor Creep ✅");
    else setStatus("No Creep 💚");
  }, [originalBudget, originalTimeline, additionalFeatures, avgFeatureCost, avgFeatureTime, hourlyRate]);

  const comparisonData = [
    { name: 'Original', budget: originalBudget, timeline: originalTimeline },
    { name: 'With Creep', budget: totalCost, timeline: totalTime }
  ];

  const impactData = [
    { week: 1, original: originalBudget / originalTimeline, withCreep: originalBudget / originalTimeline },
    { week: Math.floor(originalTimeline / 2), original: originalBudget / 2, withCreep: originalBudget / 2 },
    { week: originalTimeline, original: originalBudget, withCreep: originalBudget },
    { week: totalTime, original: originalBudget, withCreep: totalCost }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "scopecreep",
      data: { scopeCreepPercent, additionalCost, additionalTime, status },
      message: `Scope creep analysis: ${scopeCreepPercent.toFixed(1)}% budget increase, ₹${additionalCost.toLocaleString()} extra cost, ${additionalTime} weeks delay. How can I manage scope creep better?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Scope Creep Cost Estimator</h2>
          <p className="text-muted-foreground mt-2">
            Calculate the real cost impact of project scope changes
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Project Parameters</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="originalBudget">Original Budget (₹)</Label>
              <Input
                id="originalBudget"
                type="number"
                value={originalBudget}
                onChange={(e) => setOriginalBudget(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="originalTimeline">Original Timeline (weeks)</Label>
              <Input
                id="originalTimeline"
                type="number"
                value={originalTimeline}
                onChange={(e) => setOriginalTimeline(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="additionalFeatures">Additional Features Requested</Label>
              <Input
                id="additionalFeatures"
                type="number"
                value={additionalFeatures}
                onChange={(e) => setAdditionalFeatures(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="avgFeatureCost">Average Cost per Feature (₹)</Label>
              <Input
                id="avgFeatureCost"
                type="number"
                value={avgFeatureCost}
                onChange={(e) => setAvgFeatureCost(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="avgFeatureTime">Average Time per Feature (weeks)</Label>
              <Input
                id="avgFeatureTime"
                type="number"
                value={avgFeatureTime}
                onChange={(e) => setAvgFeatureTime(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Your Hourly Rate (₹)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Scope Creep Impact</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-red-400">
                {scopeCreepPercent.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Budget Increase</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-orange-400">
                ₹{additionalCost.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Additional Cost</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-xl font-bold text-blue-400">
                {additionalTime} weeks
              </div>
              <div className="text-sm text-muted-foreground">Additional Time</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary">
                ₹{totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Project Cost</div>
            </div>
            <div className="text-center">
              <Badge className={`${
                status.includes('Critical') ? 'bg-red-500/20 text-red-400' :
                status.includes('High') ? 'bg-orange-500/20 text-orange-400' :
                status.includes('Moderate') ? 'bg-yellow-500/20 text-yellow-400' :
                status.includes('Minor') ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Original vs Final Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Budget']} />
            <Bar dataKey="budget" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ScopeCreepEstimator;
