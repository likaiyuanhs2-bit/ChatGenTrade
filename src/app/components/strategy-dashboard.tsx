import { TrendingUp, Activity, Trash2 } from "lucide-react";

interface Strategy {
  id: string;
  name: string;
  pair: string;
  status: "running" | "stopped";
  pnl: number;
  pnlPercent: number;
  winRate: number;
  trades: number;
}

interface StrategyDashboardProps {
  onViewStrategy: (strategyId: string) => void;
}

export function StrategyDashboard({ onViewStrategy }: StrategyDashboardProps) {
  const strategies: Strategy[] = [
    {
      id: "001",
      name: "RSI 超买超卖策略",
      pair: "BTC/USDT",
      status: "running",
      pnl: 1247.82,
      pnlPercent: 12.48,
      winRate: 68.5,
      trades: 42,
    },
    {
      id: "002",
      name: "MACD 趋势跟随",
      pair: "ETH/USDT",
      status: "running",
      pnl: -156.34,
      pnlPercent: -2.34,
      winRate: 45.2,
      trades: 28,
    },
    {
      id: "003",
      name: "布林带突破",
      pair: "BNB/USDT",
      status: "stopped",
      pnl: 892.15,
      pnlPercent: 8.92,
      winRate: 71.3,
      trades: 35,
    },
  ];

  return (
    <div className="p-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#a1a1aa]">活跃策略</span>
            <Activity className="w-5 h-5 text-[#2563eb]" />
          </div>
          <div className="text-3xl text-white">2</div>
          <div className="text-sm text-[#a1a1aa] mt-1">共 3 个策略</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#a1a1aa]">总盈亏</span>
            <TrendingUp className="w-5 h-5 text-[#10b981]" />
          </div>
          <div className="text-3xl text-[#10b981]">+$1,983.63</div>
          <div className="text-sm text-[#10b981] mt-1">+6.35%</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#a1a1aa]">总交易次数</span>
            <Activity className="w-5 h-5 text-[#2563eb]" />
          </div>
          <div className="text-3xl text-white">105</div>
          <div className="text-sm text-[#a1a1aa] mt-1">近 7 天</div>
        </div>
      </div>

      {/* Strategies Table */}
      <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272a]">
          <h3 className="text-lg text-white">策略列表</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27272a]">
                <th className="px-6 py-4 text-left text-sm text-[#a1a1aa]">策略名称</th>
                <th className="px-6 py-4 text-left text-sm text-[#a1a1aa]">交易对</th>
                <th className="px-6 py-4 text-left text-sm text-[#a1a1aa]">状态</th>
                <th className="px-6 py-4 text-right text-sm text-[#a1a1aa]">盈亏</th>
                <th className="px-6 py-4 text-right text-sm text-[#a1a1aa]">胜率</th>
                <th className="px-6 py-4 text-right text-sm text-[#a1a1aa]">交易次数</th>
                <th className="px-6 py-4 text-right text-sm text-[#a1a1aa]">操作</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr 
                  key={strategy.id} 
                  className="border-b border-[#27272a] hover:bg-[#27272a]/30 cursor-pointer transition-colors"
                  onClick={() => onViewStrategy(strategy.id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-white">{strategy.name}</div>
                    <div className="text-sm text-[#a1a1aa]">#{strategy.id}</div>
                  </td>
                  <td className="px-6 py-4 text-white">{strategy.pair}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        strategy.status === "running"
                          ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
                          : "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${strategy.status === "running" ? "bg-[#10b981]" : "bg-[#ef4444]"}`}></div>
                      {strategy.status === "running" ? "运行中" : "已停止"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={strategy.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>
                      {strategy.pnl >= 0 ? "+" : ""}${strategy.pnl.toFixed(2)}
                    </div>
                    <div className={`text-sm ${strategy.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {strategy.pnlPercent >= 0 ? "+" : ""}{strategy.pnlPercent}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-white">{strategy.winRate}%</td>
                  <td className="px-6 py-4 text-right text-white">{strategy.trades}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-2 rounded-lg bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete strategy logic here
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}