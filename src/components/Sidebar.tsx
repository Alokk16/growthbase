
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target,
  BarChart,
  PieChart,
  LineChart,
  Gauge,
  Menu
} from "lucide-react";

const toolCategories = [
  {
    title: "📊 Finance & Cash Flow",
    tools: [
      { id: "breakeven", name: "Break-even Calculator", icon: Calculator },
      { id: "roi", name: "ROI Calculator", icon: TrendingUp },
      { id: "burnrate", name: "Burn Rate Tracker", icon: DollarSign },
      { id: "runway", name: "Runway Estimator", icon: Target },
      { id: "profit", name: "Monthly Profit Estimator", icon: BarChart },
      { id: "cashflow", name: "Cash Flow Visualizer", icon: LineChart },
      { id: "dilution", name: "Funding Dilution Simulator", icon: PieChart },
      { id: "cltv", name: "CLTV Calculator", icon: Gauge },
      { id: "uniteconomics", name: "Unit Economics Visualizer", icon: BarChart },
      { id: "workingcapital", name: "Working Capital Estimator", icon: Calculator }
    ]
  },
  {
    title: "📈 Growth & Revenue",
    tools: [
      { id: "revenue", name: "Revenue Forecast Simulator", icon: TrendingUp },
      { id: "pricing", name: "Pricing Strategy Planner", icon: DollarSign },
      { id: "adspend", name: "Ad Spend ROI Estimator", icon: Target },
      { id: "conversion", name: "Lead-to-Customer Conversion", icon: BarChart },
      { id: "saas", name: "SaaS MRR / ARR Estimator", icon: LineChart },
      { id: "funnel", name: "Funnel Drop-off Analyzer", icon: PieChart },
      { id: "referral", name: "Referral Growth Projection", icon: TrendingUp },
      { id: "bundle", name: "Bundle vs A-la-Carte Optimizer", icon: Calculator }
    ]
  },
  {
    title: "🧠 Freelance & Ops",
    tools: [
      { id: "hourlyrate", name: "Hourly Rate Estimator", icon: DollarSign },
      { id: "scopecreep", name: "Scope Creep Cost Estimator", icon: Target },
      { id: "valuepricing", name: "Value-Based Pricing Planner", icon: Calculator }
    ]
  },
  {
    title: "🎯 Strategy & Execution",
    tools: [
      { id: "okr", name: "OKR Tracker", icon: Target },
      { id: "businessgoals", name: "Business Goal Tracker", icon: BarChart },
      { id: "decision", name: "Cost vs Quality Decision Matrix", icon: PieChart },
      { id: "gst", name: "GST Impact Calculator", icon: Calculator }
    ]
  }
];

interface SidebarProps {
  selectedTool: string;
  onSelectTool: (tool: string) => void;
}

const Sidebar = ({ selectedTool, onSelectTool }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        <Button
          variant={selectedTool === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start text-sm"
          onClick={() => {
            onSelectTool("dashboard");
            setIsOpen(false);
          }}
        >
          <BarChart className="h-4 w-4 mr-2" />
          Dashboard Overview
        </Button>
        
        {toolCategories.map((category) => (
          <div key={category.title} className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground px-2 py-1">
              {category.title}
            </h3>
            <div className="space-y-0.5">
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    className="w-full justify-start text-xs h-8 px-2"
                    onClick={() => {
                      onSelectTool(tool.id);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="h-3 w-3 mr-2" />
                    <span className="truncate">{tool.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50 md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-card border-border">
            <div className="h-full bg-card/50 backdrop-blur-sm">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-border bg-card/30 backdrop-blur-sm">
        <div className="h-[calc(100vh-5rem)]">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
