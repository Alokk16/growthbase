
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OKRTrackerProps {
  onOpenChat: (context: any) => void;
}

interface KeyResult {
  id: number;
  description: string;
  target: number;
  current: number;
  unit: string;
}

const OKRTracker = ({ onOpenChat }: OKRTrackerProps) => {
  const [objective, setObjective] = useState("Increase monthly revenue");
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: 1, description: "Monthly Revenue", target: 500000, current: 350000, unit: "₹" },
    { id: 2, description: "New Customers", target: 100, current: 65, unit: "" },
    { id: 3, description: "Customer Retention", target: 85, current: 78, unit: "%" }
  ]);
  
  const [overallProgress, setOverallProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [nextId, setNextId] = useState(4);

  useEffect(() => {
    if (keyResults.length === 0) {
      setOverallProgress(0);
      setStatus("No Key Results");
      return;
    }

    const totalProgress = keyResults.reduce((sum, kr) => {
      const progress = kr.target > 0 ? Math.min((kr.current / kr.target) * 100, 100) : 0;
      return sum + progress;
    }, 0);
    
    const avgProgress = totalProgress / keyResults.length;
    setOverallProgress(avgProgress);
    
    if (avgProgress >= 90) setStatus("Exceeding Goals 🚀");
    else if (avgProgress >= 75) setStatus("On Track 💚");
    else if (avgProgress >= 50) setStatus("Making Progress ✅");
    else if (avgProgress >= 25) setStatus("Behind Schedule ⚠️");
    else setStatus("Critical 🔴");
  }, [keyResults]);

  const addKeyResult = () => {
    setKeyResults([...keyResults, {
      id: nextId,
      description: "New Key Result",
      target: 100,
      current: 0,
      unit: ""
    }]);
    setNextId(nextId + 1);
  };

  const removeKeyResult = (id: number) => {
    setKeyResults(keyResults.filter(kr => kr.id !== id));
  };

  const updateKeyResult = (id: number, field: keyof KeyResult, value: string | number) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const chartData = keyResults.map(kr => ({
    name: kr.description.substring(0, 15),
    target: kr.target,
    current: kr.current,
    progress: kr.target > 0 ? (kr.current / kr.target) * 100 : 0
  }));

  const handleAskAlok = () => {
    onOpenChat({
      type: "okr",
      data: { objective, overallProgress, keyResults, status },
      message: `OKR tracking: "${objective}" at ${overallProgress.toFixed(1)}% overall progress. ${keyResults.length} key results tracked. How can I improve my goal achievement?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">OKR Tracker with Progress Meter</h2>
          <p className="text-muted-foreground mt-2">
            Track Objectives and Key Results with visual progress indicators
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask Alok
        </Button>
      </div>

      <Card className="glass-effect p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="objective">Objective</Label>
            <Input
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="mt-1 text-lg font-semibold"
              placeholder="What do you want to achieve?"
            />
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white/5">
            <div className="text-4xl font-bold text-primary mb-2">
              {overallProgress.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mb-4">Overall Progress</div>
            <Progress value={overallProgress} className="w-full h-3 mb-4" />
            <Badge className={`${
              status.includes('Exceeding') ? 'bg-green-500/20 text-green-400' :
              status.includes('On Track') || status.includes('Making') ? 'bg-blue-500/20 text-blue-400' :
              status.includes('Behind') ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {status}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Key Results</h3>
          <Button onClick={addKeyResult} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Key Result
          </Button>
        </div>
        
        <div className="space-y-4">
          {keyResults.map((kr) => {
            const progress = kr.target > 0 ? Math.min((kr.current / kr.target) * 100, 100) : 0;
            return (
              <div key={kr.id} className="p-4 rounded-lg bg-white/5 space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={kr.description}
                    onChange={(e) => updateKeyResult(kr.id, 'description', e.target.value)}
                    className="flex-1"
                    placeholder="Key Result Description"
                  />
                  <Button 
                    onClick={() => removeKeyResult(kr.id)} 
                    size="sm" 
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Current</Label>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={kr.current}
                        onChange={(e) => updateKeyResult(kr.id, 'current', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">{kr.unit}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Target</Label>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={kr.target}
                        onChange={(e) => updateKeyResult(kr.id, 'target', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">{kr.unit}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={kr.unit}
                      onChange={(e) => updateKeyResult(kr.id, 'unit', e.target.value)}
                      placeholder="₹, %, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress: {progress.toFixed(1)}%</span>
                    <span>{kr.current.toLocaleString()}{kr.unit} / {kr.target.toLocaleString()}{kr.unit}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {keyResults.length > 0 && (
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Progress Visualization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="current" fill="#14B8A6" name="Current" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#374151" name="Target" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default OKRTracker;
