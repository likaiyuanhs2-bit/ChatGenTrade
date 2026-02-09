import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { StepHeader } from "./components/step-header";
import { StrategyChat } from "./components/strategy-chat";
import { StrategyDashboard } from "./components/strategy-dashboard";
import { Settings } from "./components/settings";
import { BacktestViewNew } from "./components/backtest-view-new";
import { StrategyDetailWithEditor } from "./components/strategy-detail-with-editor";
import { DeployStrategy } from "./components/deploy-strategy";


export default function App() {
  const [activePage, setActivePage] = useState("chat");
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [strategyType, setStrategyType] = useState<"spot" | "futures">("spot");
  const [strategyTab, setStrategyTab] = useState<"detail" | "editor">("detail");

  const handleViewStrategy = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    setStrategyTab("detail"); // Reset to detail tab when viewing strategy
    setActivePage("strategy-detail");
  };

  const handleStepClick = (stepId: string) => {
    setActivePage(stepId);
  };

  // Determine sidebar active state
  const getSidebarActivePage = () => {
    if (activePage === "backtest") {
      return "chat"; // Keep chat tab highlighted when in backtest
    }
    if (activePage === "strategy-detail" || activePage === "strategy-edit") {
      return "dashboard"; // Keep dashboard tab highlighted when viewing strategy detail or editing
    }
    return activePage;
  };

  const getPageContent = () => {
    switch (activePage) {
      case "chat":
        return {
          useStepHeader: true,
          steps: [
            { id: "chat", label: "策略对话", status: "current" as const },
            { id: "backtest", label: "回测配置", status: "upcoming" as const },
            { id: "deploy", label: "策略部署", status: "upcoming" as const },
          ],
          component: <StrategyChat onNavigateToBacktest={() => setActivePage("backtest")} />,
        };
      case "dashboard":
        return {
          useStepHeader: false,
          title: "策略仪表盘",
          breadcrumbs: [{ label: "仪表盘" }],
          component: <StrategyDashboard onViewStrategy={handleViewStrategy} />,
        };
      case "settings":
        return {
          useStepHeader: false,
          title: "设置",
          breadcrumbs: [{ label: "设置" }, { label: "API 管理" }],
          component: <Settings />,
        };
      case "backtest":
        return {
          useStepHeader: true,
          steps: [
            { id: "chat", label: "策略对话", status: "completed" as const },
            { id: "backtest", label: "回测配置", status: "current" as const },
            { id: "deploy", label: "策略部署", status: "upcoming" as const },
          ],
          component: <BacktestViewNew strategyType={strategyType} onNavigateToDeploy={() => setActivePage("deploy")} />,
        };
      case "strategy-detail":
        return {
          useStepHeader: false,
          title: strategyTab === "editor" ? "策略编辑器" : "策略详情",
          breadcrumbs: strategyTab === "editor" 
            ? [{ label: "仪表盘" }, { label: `策略 #${selectedStrategyId}` }, { label: "策略编辑器" }]
            : [{ label: "仪表盘" }, { label: `策略 #${selectedStrategyId}` }],
          showBackButton: true,
          onBack: strategyTab === "editor" 
            ? () => setStrategyTab("detail") // 在编辑器视图，返回到详情视图
            : () => setActivePage("dashboard"), // 在详情视图，返回到仪表盘
          component: <StrategyDetailWithEditor 
            strategyId={selectedStrategyId || ""} 
            currentTab={strategyTab} 
            onTabChange={setStrategyTab}
            onBackToDashboard={() => setActivePage("dashboard")}
          />,
        };
      case "deploy":
        return {
          useStepHeader: true,
          steps: [
            { id: "chat", label: "策略对话", status: "completed" as const },
            { id: "backtest", label: "回测配置", status: "completed" as const },
            { id: "deploy", label: "策略部署", status: "current" as const },
          ],
          component: <DeployStrategy onNavigateToDashboard={() => setActivePage("dashboard")} />,
        };
      default:
        return {
          useStepHeader: false,
          title: "策略仪表盘",
          breadcrumbs: [{ label: "仪表盘" }],
          component: <StrategyDashboard onViewStrategy={handleViewStrategy} />,
        };
    }
  };

  const pageContent = getPageContent();

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage={getSidebarActivePage()} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {!pageContent.hideHeader && (
          pageContent.useStepHeader ? (
            <StepHeader steps={pageContent.steps!} onStepClick={handleStepClick} />
          ) : (
            <Header 
              title={pageContent.title!} 
              breadcrumbs={pageContent.breadcrumbs}
              showBackButton={pageContent.showBackButton}
              onBack={pageContent.onBack}
            />
          )
        )}
        <main className="flex-1 overflow-hidden bg-black">
          {pageContent.component}
        </main>
      </div>
    </div>
  );
}
