
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, TrendingUp, DollarSign, Target, AlertTriangle } from "lucide-react";

interface DashboardOverviewProps {
  onOpenChat: (context?: any) => void;
}

const DashboardOverview = ({ onOpenChat }: DashboardOverviewProps) => {
  const quickStats = [
    {
      title: "Tools Available",
      value: "25+",
      subtitle: "Financial & Growth Tools",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Indian Market",
      value: "₹ Ready",
      subtitle: "All calculations in INR",
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      title: "Real-time Analytics",
      value: "Live",
      subtitle: "Instant calculations & insights",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      title: "AI Assistant",
      value: "SwiftCFO",
      subtitle: "Your business advisor",
      icon: MessageCircle,
      color: "text-purple-500"
    }
  ];

  const popularTools = [
    { name: "Break-even Calculator", usage: "High", status: "healthy" },
    { name: "ROI Calculator", usage: "High", status: "healthy" },
    { name: "Burn Rate Tracker", usage: "Medium", status: "warning" },
    { name: "Revenue Forecaster", usage: "High", status: "healthy" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">
          Welcome to GrowthBase
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive business toolkit designed 
          specifically for India's Gen Z founders and startup builders.
        </p>
        <Button 
          onClick={() => onOpenChat({ type: "general", message: "How can I help you build your startup today?" })}
          className="bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask SwiftCFO for Guidance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-effect p-6 text-center hover:bg-white/10 transition-colors">
              <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-lg font-semibold text-foreground">{stat.title}</div>
              <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
            </Card>
          );
        })}
      </div>

      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Popular Tools
        </h3>
        <div className="space-y-3">
          {popularTools.map((tool, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <div className="font-medium">{tool.name}</div>
                <div className="text-sm text-muted-foreground">Usage: {tool.usage}</div>
              </div>
              <Badge 
                variant={tool.status === "healthy" ? "default" : "destructive"}
                className={tool.status === "healthy" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}
              >
                {tool.status === "healthy" ? "✅ Active" : "⚠️ Monitor"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-effect p-6 border-l-4 border-l-primary">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-primary mt-1" />
          <div>
            <h4 className="font-semibold text-primary mb-2">Getting Started</h4>
            <p className="text-muted-foreground mb-4">
              Each tool provides real-time calculations with Indian market context. 
              All values are in ₹ (Indian Rupees) and formulas are tailored for the Indian startup ecosystem.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Real Formulas</Badge>
              <Badge variant="outline">Live Charts</Badge>
              <Badge variant="outline">AI Insights</Badge>
              <Badge variant="outline">₹ INR Ready</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;
