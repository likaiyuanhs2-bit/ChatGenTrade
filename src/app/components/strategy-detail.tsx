import { useState } from "react";
import { StopCircle, Settings, TrendingUp, TrendingDown, Target, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RotateCcw, Sparkles, Send } from "lucide-react";
import { CandlestickChart } from "./candlestick-chart";
import { SyntaxHighlighter } from "./syntax-highlighter";

interface StrategyDetailProps {
  strategyId: string;
  currentTab?: "detail" | "editor";
  onTabChange?: (tab: "detail" | "editor") => void;
}

export function StrategyDetail({ strategyId, currentTab = "detail", onTabChange }: StrategyDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"detail" | "editor">(currentTab);
  const logsPerPage = 10;

  const handleTabChange = (tab: "detail" | "editor") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Mock data
  const strategy = {
    name: "BTC 恐慌定投策略",
    status: "running",
    equity: 4520,
    pnl: 450,
    position: 0.1,
    exchange: "Binance 模拟盘",
  };

  // Generate candlestick data for chart
  const generateCandlestickData = () => {
    const data = [];
    let basePrice = 2100;
    const startDate = new Date("2026-01-01");

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const time = date.toISOString().split("T")[0];

      const open = basePrice + (Math.random() - 0.5) * 50;
      const close = open + (Math.random() - 0.5) * 100;
      const high = Math.max(open, close) + Math.random() * 30;
      const low = Math.min(open, close) - Math.random() * 30;

      data.push({
        time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });

      basePrice = close;
    }

    return data;
  };

  const candlestickData = generateCandlestickData();

  // Trade signals
  const tradeSignals = [
    { time: candlestickData[3].time, type: "buy" as const, price: candlestickData[3].close },
    { time: candlestickData[7].time, type: "sell" as const, price: candlestickData[7].close },
    { time: candlestickData[12].time, type: "buy" as const, price: candlestickData[12].close },
    { time: candlestickData[16].time, type: "sell" as const, price: candlestickData[16].close },
    { time: candlestickData[21].time, type: "buy" as const, price: candlestickData[21].close },
    { time: candlestickData[27].time, type: "sell" as const, price: candlestickData[27].close },
  ];

  // Mock execution logs - 专业交易日志格式
  const allLogs = [
    {
      timestamp: "2026-02-08 14:32:15.234",
      level: "INFO",
      module: "OrderExecutor",
      message: "Order filled: BUY 0.05 BTC @ $42,150.00",
      details: "OrderID: 1827364912, Fee: 0.075%, Slippage: 0.02%",
    },
    {
      timestamp: "2026-02-08 14:32:14.892",
      level: "INFO",
      module: "SignalDetector",
      message: "Spring signal detected at support $41,800",
      details: "Volume spike: 2.3x average, Price bounce: +0.8%",
    },
    {
      timestamp: "2026-02-08 14:32:12.456",
      level: "DEBUG",
      module: "MarketDataFeed",
      message: "Candle closed: 4H timeframe",
      details: "Open: $41,820, High: $42,180, Low: $41,750, Close: $42,150",
    },
    {
      timestamp: "2026-02-08 10:15:43.128",
      level: "INFO",
      module: "OrderExecutor",
      message: "Order filled: BUY 0.03 BTC @ $41,280.00",
      details: "OrderID: 1827298471, Fee: 0.075%, Slippage: 0.01%",
    },
    {
      timestamp: "2026-02-08 10:15:41.764",
      level: "INFO",
      module: "SignalDetector",
      message: "Fear & Greed Index triggered: 15 (Extreme Fear)",
      details: "Threshold: < 20, Current: 15, Previous: 22",
    },
    {
      timestamp: "2026-02-08 06:00:02.891",
      level: "INFO",
      module: "RiskManager",
      message: "Daily risk check passed",
      details: "Exposure: 28%, Max allowed: 50%, Available: $3,240",
    },
    {
      timestamp: "2026-02-07 18:45:23.567",
      level: "WARN",
      module: "OrderExecutor",
      message: "Order partially filled: BUY 0.02/0.05 BTC",
      details: "OrderID: 1826947382, Remaining: 0.03 BTC, Timeout: 30s",
    },
    {
      timestamp: "2026-02-07 16:30:18.234",
      level: "INFO",
      module: "OrderExecutor",
      message: "Order filled: SELL 0.08 BTC @ $43,920.00",
      details: "OrderID: 1826892156, Fee: 0.075%, Profit: +$384.50",
    },
    {
      timestamp: "2026-02-07 16:30:16.892",
      level: "INFO",
      module: "SignalDetector",
      message: "Take profit target reached: $43,920",
      details: "Entry: $39,120, Target: $43,920, Gain: +12.3%",
    },
    {
      timestamp: "2026-02-07 12:22:09.456",
      level: "DEBUG",
      module: "TechnicalAnalysis",
      message: "RSI oversold condition cleared",
      details: "RSI(14): 45.2, Previous: 28.4, Trend: Recovering",
    },
    {
      timestamp: "2026-02-07 09:18:34.128",
      level: "INFO",
      module: "StrategyEngine",
      message: "Accumulation zone detected",
      details: "Support: $39,100, Resistance: $44,200, Range: 5,100",
    },
    {
      timestamp: "2026-02-07 06:00:01.764",
      level: "INFO",
      module: "SystemMonitor",
      message: "Strategy health check: OK",
      details: "Uptime: 127h, Trades: 18, Win rate: 72%, PnL: +$450",
    },
    {
      timestamp: "2026-02-06 22:14:52.891",
      level: "ERROR",
      module: "OrderExecutor",
      message: "Order rejected: Insufficient margin",
      details: "Required: $2,100, Available: $1,840, Shortfall: $260",
    },
    {
      timestamp: "2026-02-06 18:35:27.567",
      level: "INFO",
      module: "OrderExecutor",
      message: "Order filled: BUY 0.04 BTC @ $40,520.00",
      details: "OrderID: 1826145928, Fee: 0.075%, Slippage: 0.03%",
    },
    {
      timestamp: "2026-02-06 14:20:11.234",
      level: "DEBUG",
      module: "MarketDataFeed",
      message: "WebSocket reconnected",
      details: "Endpoint: wss://stream.binance.com, Latency: 28ms",
    },
    {
      timestamp: "2026-02-06 10:45:38.912",
      level: "INFO",
      module: "OrderExecutor",
      message: "Order filled: BUY 0.06 BTC @ $39,840.00",
      details: "OrderID: 1825987234, Fee: 0.075%, Slippage: 0.01%",
    },
    {
      timestamp: "2026-02-06 08:30:22.456",
      level: "INFO",
      module: "SignalDetector",
      message: "Support level holding at $39,500",
      details: "Test count: 3, Volume: Strong, Confidence: 87%",
    },
    {
      timestamp: "2026-02-05 22:18:45.789",
      level: "WARN",
      module: "RiskManager",
      message: "Position size exceeds recommendation",
      details: "Current: 0.42 BTC (35%), Recommended: 0.35 BTC (30%)",
    },
    {
      timestamp: "2026-02-05 18:20:11.234",
      level: "INFO",
      module: "OrderExecutor",
      message: "Order filled: SELL 0.05 BTC @ $44,280.00",
      details: "OrderID: 1825634829, Fee: 0.075%, Profit: +$312.80",
    },
    {
      timestamp: "2026-02-05 14:35:49.567",
      level: "DEBUG",
      module: "TechnicalAnalysis",
      message: "MACD bullish crossover detected",
      details: "MACD: 124.5, Signal: 118.2, Histogram: +6.3",
    },
  ];

  const totalPages = Math.ceil(allLogs.length / logsPerPage);
  const currentLogs = allLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-[#ef4444]";
      case "WARN":
        return "text-[#f59e0b]";
      case "INFO":
        return "text-[#10b981]";
      case "DEBUG":
        return "text-[#3b82f6]";
      default:
        return "text-[#a1a1aa]";
    }
  };

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      {/* Section 1: Strategy Status & Funds */}
      <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
        <div className="flex items-start justify-between">
          {/* Left Side: Strategy Info & Funds */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl text-white">{strategy.name}</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-[#10b981] rounded-full animate-ping"></div>
                </div>
                <span className="text-sm text-[#10b981]">运行中 (Running)</span>
              </div>
            </div>

            {/* Fund Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black border border-[#27272a] rounded-lg p-4">
                <div className="text-sm text-[#a1a1aa] mb-1">当前策略权益</div>
                <div className="text-2xl text-white mb-1">${strategy.equity.toLocaleString()}</div>
                <div className="text-xs text-[#a1a1aa]">{strategy.exchange}</div>
              </div>

              <div className="bg-black border border-[#27272a] rounded-lg p-4">
                <div className="text-sm text-[#a1a1aa] mb-1">净盈亏</div>
                <div className="text-2xl text-[#10b981] mb-1">+${strategy.pnl.toLocaleString()}</div>
                <div className="text-xs text-[#10b981]">+{((strategy.pnl / (strategy.equity - strategy.pnl)) * 100).toFixed(2)}%</div>
              </div>

              <div className="bg-black border border-[#27272a] rounded-lg p-4">
                <div className="text-sm text-[#a1a1aa] mb-1">当前持仓</div>
                <div className="text-2xl text-white mb-1">{strategy.position} BTC</div>
                <div className="text-xs text-[#a1a1aa]">≈ ${(strategy.position * 42000).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Right Side: Control Buttons */}
          <div className="flex flex-col gap-3 ml-6">
            <button className="px-4 py-2 bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] border border-[#ef4444]/30 rounded-lg transition-colors flex items-center gap-2">
              <StopCircle className="w-4 h-4" />
              停止
            </button>
            <button
              className="px-4 py-2 bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#2563eb] border border-[#2563eb]/30 rounded-lg transition-colors flex items-center gap-2"
              onClick={onTabChange}
            >
              <Settings className="w-4 h-4" />
              修改策略
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: 策略执行监控 */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl text-white mb-1">策略执行监控</h3>
          <p className="text-sm text-[#a1a1aa]">Strategy Execution Monitor</p>
        </div>

        {/* Chart Image */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg overflow-hidden mb-6 h-[400px]">
          <CandlestickChart 
            data={candlestickData}
            signals={tradeSignals}
            symbol="ETH/USDT"
            timeframe="4H"
          />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* 总回报率 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#a1a1aa] text-sm">总回报率</span>
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
            </div>
            <div className="text-5xl text-[#10b981] mb-2">+15.4%</div>
            <div className="text-sm text-[#a1a1aa]">净收益: +$1,540</div>
          </div>

          {/* 最大回撤 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#a1a1aa] text-sm">最大回撤</span>
              <TrendingDown className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div className="text-5xl text-[#ef4444] mb-2">-4.2%</div>
            <div className="text-sm text-[#a1a1aa]">最大损失: -$420</div>
          </div>

          {/* 胜率 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#a1a1aa] text-sm">胜率</span>
              <Target className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div className="text-5xl text-white mb-2">65%</div>
            <div className="text-sm text-[#a1a1aa]">13胜 / 20笔交易</div>
          </div>
        </div>
      </div>

      {/* Section 3: 策略执行日志 */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl text-white mb-1">策略执行日志</h3>
          <p className="text-sm text-[#a1a1aa]">Strategy Execution Logs</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg overflow-hidden">
          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-[#27272a] bg-black">
                  <th className="px-4 py-3 text-left text-[#a1a1aa] font-medium">TIMESTAMP</th>
                  <th className="px-4 py-3 text-left text-[#a1a1aa] font-medium">LEVEL</th>
                  <th className="px-4 py-3 text-left text-[#a1a1aa] font-medium">MODULE</th>
                  <th className="px-4 py-3 text-left text-[#a1a1aa] font-medium">MESSAGE</th>
                  <th className="px-4 py-3 text-left text-[#a1a1aa] font-medium">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#27272a] hover:bg-[#27272a]/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-[#71717a]">{log.timestamp}</td>
                    <td className={`px-4 py-3 font-semibold ${getLogLevelColor(log.level)}`}>
                      {log.level}
                    </td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{log.module}</td>
                    <td className="px-4 py-3 text-white">{log.message}</td>
                    <td className="px-4 py-3 text-[#71717a]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-[#27272a] bg-black px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-[#a1a1aa]">
              显示 {(currentPage - 1) * logsPerPage + 1} - {Math.min(currentPage * logsPerPage, allLogs.length)} / 共 {allLogs.length} 条日志
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? "bg-[#18181b] text-[#52525b] cursor-not-allowed"
                    : "bg-[#27272a] text-white hover:bg-[#3b82f6]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? "bg-[#3b82f6] text-white"
                        : "bg-[#27272a] text-[#a1a1aa] hover:bg-[#3b82f6]/20"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "bg-[#18181b] text-[#52525b] cursor-not-allowed"
                    : "bg-[#27272a] text-white hover:bg-[#3b82f6]"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}