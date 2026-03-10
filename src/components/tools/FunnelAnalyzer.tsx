
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FunnelAnalyzerProps {
  onOpenChat: (context: any) => void;
}

const FunnelAnalyzer = ({ onOpenChat }: FunnelAnalyzerProps) => {
  const [awareness, setAwareness] = useState(10000);
  const [interest, setInterest] = useState(5000);
  const [consideration, setConsideration] = useState(2000);
  const [intent, setIntent] = useState(800);
  const [purchase, setPurchase] = useState(200);
  
  const [dropoffs, setDropoffs] = useState<any[]>([]);
  const [worstStage, setWorstStage] = useState("");
  const [overallConversion, setOverallConversion] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stages = [
      { name: 'Awareness to Interest', from: awareness, to: interest },
      { name: 'Interest to Consideration', from: interest, to: consideration },
      { name: 'Consideration to Intent', from: consideration, to: intent },
      { name: 'Intent to Purchase', from: intent, to: purchase }
    ];
    
    const calculatedDropoffs = stages.map(stage => ({
      ...stage,
      dropoff: stage.from > 0 ? ((stage.from - stage.to) / stage.from) * 100 : 0,
      conversion: stage.from > 0 ? (stage.to / stage.from) * 100 : 0
    }));
    
    setDropoffs(calculatedDropoffs);
    
    const worst = calculatedDropoffs.reduce((prev, current) => 
      prev.dropoff > current.dropoff ? prev : current
    );
    setWorstStage(worst.name);
    
    const overall = awareness > 0 ? (purchase / awareness) * 100 : 0;
    setOverallConversion(overall);
    
    if (overall > 5) setStatus("Excellent 🚀");
    else if (overall > 3) setStatus("Very Good 💚");
    else if (overall > 2) setStatus("Good ✅");
    else if (overall > 1) setStatus("Needs Work ⚠️");
    else setStatus("Critical 🔴");
  }, [awareness, interest, consideration, intent, purchase]);

  const funnelData = [
    { name: 'Awareness', value: awareness, percentage: 100 },
    { name: 'Interest', value: interest, percentage: awareness > 0 ? (interest / awareness) * 100 : 0 },
    { name: 'Consideration', value: consideration, percentage: awareness > 0 ? (consideration / awareness) * 100 : 0 },
    { name: 'Intent', value: intent, percentage: awareness > 0 ? (intent / awareness) * 100 : 0 },
    { name: 'Purchase', value: purchase, percentage: awareness > 0 ? (purchase / awareness) * 100 : 0 }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "funnel",
      data: { overallConversion, worstStage, dropoffs, status },
      message: `Funnel analysis: ${overallConversion.toFixed(1)}% overall conversion, worst drop-off at "${worstStage}". How can I optimize my funnel?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Funnel Drop-off Analyzer</h2>
          <p className="text-muted-foreground mt-2">
            Identify bottlenecks in your customer acquisition funnel
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Funnel Stages</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="awareness">Awareness</Label>
              <Input
                id="awareness"
                type="number"
                value={awareness}
                onChange={(e) => setAwareness(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="interest">Interest</Label>
              <Input
                id="interest"
                type="number"
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="consideration">Consideration</Label>
              <Input
                id="consideration"
                type="number"
                value={consideration}
                onChange={(e) => setConsideration(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="intent">Intent</Label>
              <Input
                id="intent"
                type="number"
                value={intent}
                onChange={(e) => setIntent(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="purchase">Purchase</Label>
              <Input
                id="purchase"
                type="number"
                value={purchase}
                onChange={(e) => setPurchase(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Drop-off Analysis</h3>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <div className="text-3xl font-bold text-primary">
                {overallConversion.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Conversion</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border-l-4 border-l-red-400">
              <div className="text-lg font-bold text-red-400">Worst Stage</div>
              <div className="text-sm text-muted-foreground">{worstStage}</div>
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
            <div className="space-y-2">
              {dropoffs.map((stage, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate">{stage.name}</span>
                  <span className={`font-medium ${stage.dropoff > 70 ? 'text-red-400' : stage.dropoff > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {stage.dropoff.toFixed(1)}% drop
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Funnel Visualization</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#94A3B8" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={12} />
            <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Count']} />
            <Bar dataKey="value" fill="#14B8A6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default FunnelAnalyzer;
