
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DecisionMatrixProps {
  onOpenChat: (context: any) => void;
}

interface Option {
  id: number;
  name: string;
  cost: number;
  quality: number;
  time: number;
  risk: number;
  score: number;
}

const DecisionMatrix = ({ onOpenChat }: DecisionMatrixProps) => {
  const [options, setOptions] = useState<Option[]>([
    { id: 1, name: "Option A", cost: 7, quality: 8, time: 6, risk: 4, score: 0 },
    { id: 2, name: "Option B", cost: 9, quality: 6, time: 8, risk: 6, score: 0 },
    { id: 3, name: "Option C", cost: 5, quality: 9, time: 4, risk: 8, score: 0 }
  ]);
  const [costWeight, setCostWeight] = useState(25);
  const [qualityWeight, setQualityWeight] = useState(35);
  const [timeWeight, setTimeWeight] = useState(25);
  const [riskWeight, setRiskWeight] = useState(15);
  const [nextId, setNextId] = useState(4);
  
  const [bestOption, setBestOption] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const totalWeight = costWeight + qualityWeight + timeWeight + riskWeight;
    if (totalWeight === 0) return;

    const updatedOptions = options.map(option => {
      // Cost is inverted (lower cost = higher score)
      const normalizedCost = (10 - option.cost) / 10;
      const normalizedQuality = option.quality / 10;
      const normalizedTime = option.time / 10;
      // Risk is inverted (lower risk = higher score)  
      const normalizedRisk = (10 - option.risk) / 10;
      
      const score = (
        (normalizedCost * costWeight) +
        (normalizedQuality * qualityWeight) +
        (normalizedTime * timeWeight) +
        (normalizedRisk * riskWeight)
      ) / totalWeight * 100;
      
      return { ...option, score };
    });

    setOptions(updatedOptions);
    
    const best = updatedOptions.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    setBestOption(best.name);
    
    if (best.score > 80) setStatus("Clear Winner 🚀");
    else if (best.score > 70) setStatus("Strong Choice 💚");
    else if (best.score > 60) setStatus("Good Option ✅");
    else if (best.score > 50) setStatus("Acceptable ⚠️");
    else setStatus("Reconsider Options 🔴");
  }, [costWeight, qualityWeight, timeWeight, riskWeight, options.length]);

  const addOption = () => {
    const newOption: Option = {
      id: nextId,
      name: `Option ${String.fromCharCode(65 + options.length)}`,
      cost: 5,
      quality: 5,
      time: 5,
      risk: 5,
      score: 0
    };
    setOptions([...options, newOption]);
    setNextId(nextId + 1);
  };

  const removeOption = (id: number) => {
    setOptions(options.filter(opt => opt.id !== id));
  };

  const updateOption = (id: number, field: keyof Option, value: string | number) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
  };

  const chartData = options.map(option => ({
    name: option.name,
    score: option.score,
    cost: 10 - option.cost, // Inverted for display
    quality: option.quality,
    time: option.time,
    risk: 10 - option.risk // Inverted for display
  }));

  const radarData = [
    { criteria: 'Cost', ...options.reduce((acc, opt) => ({ ...acc, [opt.name]: 10 - opt.cost }), {}) },
    { criteria: 'Quality', ...options.reduce((acc, opt) => ({ ...acc, [opt.name]: opt.quality }), {}) },
    { criteria: 'Time', ...options.reduce((acc, opt) => ({ ...acc, [opt.name]: opt.time }), {}) },
    { criteria: 'Risk', ...options.reduce((acc, opt) => ({ ...acc, [opt.name]: 10 - opt.risk }), {}) }
  ];

  const handleAskAlok = () => {
    onOpenChat({
      type: "decision",
      data: { bestOption, options, status },
      message: `Decision matrix analysis: "${bestOption}" is the recommended choice with ${options.find(o => o.name === bestOption)?.score.toFixed(1)}% score. Analyzed ${options.length} options across cost, quality, time, and risk. What factors should I consider further?`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Cost vs Quality Decision Matrix</h2>
          <p className="text-muted-foreground mt-2">
            Make data-driven decisions by comparing options across multiple criteria
          </p>
        </div>
        <Button onClick={handleAskAlok} className="bg-primary hover:bg-primary/90">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Criteria Weights (%)</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="costWeight">Cost Importance</Label>
              <Input
                id="costWeight"
                type="number"
                value={costWeight}
                onChange={(e) => setCostWeight(Number(e.target.value))}
                className="mt-1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="qualityWeight">Quality Importance</Label>
              <Input
                id="qualityWeight"
                type="number"
                value={qualityWeight}
                onChange={(e) => setQualityWeight(Number(e.target.value))}
                className="mt-1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="timeWeight">Time Importance</Label>
              <Input
                id="timeWeight"
                type="number"
                value={timeWeight}
                onChange={(e) => setTimeWeight(Number(e.target.value))}
                className="mt-1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="riskWeight">Risk Importance</Label>
              <Input
                id="riskWeight"
                type="number"
                value={riskWeight}
                onChange={(e) => setRiskWeight(Number(e.target.value))}
                className="mt-1"
                min="0"
                max="100"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total Weight: {costWeight + qualityWeight + timeWeight + riskWeight}%
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-4">Recommendation</h3>
          <div className="space-y-4">
            <div className="text-center p-6 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-primary mb-2">
                {bestOption}
              </div>
              <div className="text-sm text-muted-foreground mb-4">Best Option</div>
              <div className="text-xl font-bold text-green-400 mb-4">
                {options.find(o => o.name === bestOption)?.score.toFixed(1)}% Score
              </div>
              <Badge className={`${
                status.includes('Clear') ? 'bg-green-500/20 text-green-400' :
                status.includes('Strong') || status.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                status.includes('Acceptable') ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">All Options Ranked:</h4>
              {options
                .sort((a, b) => b.score - a.score)
                .map((option, index) => (
                <div key={option.id} className="flex justify-between items-center p-2 rounded bg-white/5">
                  <span className="font-medium">#{index + 1} {option.name}</span>
                  <span className="text-primary">{option.score.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-effect p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Options to Compare</h3>
          <Button onClick={addOption} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
        
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="p-4 rounded-lg bg-white/5 space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={option.name}
                  onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                  className="flex-1"
                  placeholder="Option Name"
                />
                <div className="text-sm font-bold text-primary px-3 py-2 rounded bg-white/10">
                  {option.score.toFixed(1)}%
                </div>
                <Button 
                  onClick={() => removeOption(option.id)} 
                  size="sm" 
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Cost (1-10)</Label>
                  <Input
                    type="number"
                    value={option.cost}
                    onChange={(e) => updateOption(option.id, 'cost', Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                  <div className="text-xs text-muted-foreground">Higher = More Expensive</div>
                </div>
                <div>
                  <Label>Quality (1-10)</Label>
                  <Input
                    type="number"
                    value={option.quality}
                    onChange={(e) => updateOption(option.id, 'quality', Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                  <div className="text-xs text-muted-foreground">Higher = Better Quality</div>
                </div>
                <div>
                  <Label>Time (1-10)</Label>
                  <Input
                    type="number"
                    value={option.time}
                    onChange={(e) => updateOption(option.id, 'time', Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                  <div className="text-xs text-muted-foreground">Higher = Faster Delivery</div>
                </div>
                <div>
                  <Label>Risk (1-10)</Label>
                  <Input
                    type="number"
                    value={option.risk}
                    onChange={(e) => updateOption(option.id, 'risk', Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                  <div className="text-xs text-muted-foreground">Higher = More Risky</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4">Decision Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip />
            <Bar dataKey="score" fill="#14B8A6" name="Overall Score" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DecisionMatrix;
