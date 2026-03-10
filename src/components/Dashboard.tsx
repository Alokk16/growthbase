import DashboardOverview from "./tools/DashboardOverview";
import BreakevenCalculator from "./tools/BreakevenCalculator";
import ROICalculator from "./tools/ROICalculator";
import BurnRateTracker from "./tools/BurnRateTracker";
import RevenueForecaster from "./tools/RevenueForecaster";
import RunwayEstimator from "./tools/RunwayEstimator";
import ProfitEstimator from "./tools/ProfitEstimator";
import CashFlowVisualizer from "./tools/CashFlowVisualizer";
import DilutionSimulator from "./tools/DilutionSimulator";
import CLTVCalculator from "./tools/CLTVCalculator";
import UnitEconomicsVisualizer from "./tools/UnitEconomicsVisualizer";
import WorkingCapitalEstimator from "./tools/WorkingCapitalEstimator";
import PricingStrategyPlanner from "./tools/PricingStrategyPlanner";
import AdSpendROIEstimator from "./tools/AdSpendROIEstimator";
import ConversionTracker from "./tools/ConversionTracker";
import SaaSMRREstimator from "./tools/SaaSMRREstimator";
import FunnelAnalyzer from "./tools/FunnelAnalyzer";
import ReferralGrowthProjector from "./tools/ReferralGrowthProjector";
import BundleRevenueOptimizer from "./tools/BundleRevenueOptimizer";
import HourlyRateEstimator from "./tools/HourlyRateEstimator";
import ScopeCreepEstimator from "./tools/ScopeCreepEstimator";
import ValueBasedPricingPlanner from "./tools/ValueBasedPricingPlanner";
import OKRTracker from "./tools/OKRTracker";
import BusinessGoalTracker from "./tools/BusinessGoalTracker";
import DecisionMatrix from "./tools/DecisionMatrix";
import GSTCalculator from "./tools/GSTCalculator";

interface DashboardProps {
  selectedTool: string;
  onOpenChat: (context?: any) => void;
}

const Dashboard = ({ selectedTool, onOpenChat }: DashboardProps) => {
  const renderTool = () => {
    switch (selectedTool) {
      case "dashboard":
        return <DashboardOverview onOpenChat={onOpenChat} />;
      case "breakeven":
        return <BreakevenCalculator onOpenChat={onOpenChat} />;
      case "roi":
        return <ROICalculator onOpenChat={onOpenChat} />;
      case "burnrate":
        return <BurnRateTracker onOpenChat={onOpenChat} />;
      case "revenue":
        return <RevenueForecaster onOpenChat={onOpenChat} />;
      case "runway":
        return <RunwayEstimator onOpenChat={onOpenChat} />;
      case "profit":
        return <ProfitEstimator onOpenChat={onOpenChat} />;
      case "cashflow":
        return <CashFlowVisualizer onOpenChat={onOpenChat} />;
      case "dilution":
        return <DilutionSimulator onOpenChat={onOpenChat} />;
      case "cltv":
        return <CLTVCalculator onOpenChat={onOpenChat} />;
      case "uniteconomics":
        return <UnitEconomicsVisualizer onOpenChat={onOpenChat} />;
      case "workingcapital":
        return <WorkingCapitalEstimator onOpenChat={onOpenChat} />;
      case "pricing":
        return <PricingStrategyPlanner onOpenChat={onOpenChat} />;
      case "adspend":
        return <AdSpendROIEstimator onOpenChat={onOpenChat} />;
      case "conversion":
        return <ConversionTracker onOpenChat={onOpenChat} />;
      case "saas":
        return <SaaSMRREstimator onOpenChat={onOpenChat} />;
      case "funnel":
        return <FunnelAnalyzer onOpenChat={onOpenChat} />;
      case "referral":
        return <ReferralGrowthProjector onOpenChat={onOpenChat} />;
      case "bundle":
        return <BundleRevenueOptimizer onOpenChat={onOpenChat} />;
      case "hourlyrate":
        return <HourlyRateEstimator onOpenChat={onOpenChat} />;
      case "scopecreep":
        return <ScopeCreepEstimator onOpenChat={onOpenChat} />;
      case "valuepricing":
        return <ValueBasedPricingPlanner onOpenChat={onOpenChat} />;
      case "okr":
        return <OKRTracker onOpenChat={onOpenChat} />;
      case "businessgoals":
        return <BusinessGoalTracker onOpenChat={onOpenChat} />;
      case "decision":
        return <DecisionMatrix onOpenChat={onOpenChat} />;
      case "gst":
        return <GSTCalculator onOpenChat={onOpenChat} />;
      default:
        return (
          <div className="glass-effect rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Tool Coming Soon</h2>
            <p className="text-muted-foreground">
              This tool is currently being developed. Stay tuned!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      {renderTool()}
    </div>
  );
};

export default Dashboard;
