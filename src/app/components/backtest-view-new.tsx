import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Upload, Loader2, TrendingUp, TrendingDown, Target, Sparkles, Rocket, Send } from "lucide-react";
import { CandlestickChart } from "./candlestick-chart";
import { CustomBacktestChat } from "./custom-backtest-chat";
import { TradeLogs } from "./trade-logs";
import { StrategyCodeBadge } from "./strategy-code-modal";
import { motion } from "motion/react";

interface BacktestParams {
  dataSource: string;
  tradingPair: string;
  initialCapital: string;
  timeframe: string;
  startDate: string;
  endDate: string;
}

interface BacktestViewNewProps {
  strategyType?: "spot" | "futures";
  onNavigateToDeploy?: () => void;
}

// 生成K线数据
const generateCandlestickData = () => {
  const data = [];
  let basePrice = 2500;
  const startDate = new Date("2024-01-01");

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

const tradeSignals = [
  { time: "2024-01-04", type: "buy" as const, price: candlestickData[3].close },
  { time: "2024-01-08", type: "sell" as const, price: candlestickData[7].close },
  { time: "2024-01-13", type: "buy" as const, price: candlestickData[12].close },
  { time: "2024-01-17", type: "sell" as const, price: candlestickData[16].close },
  { time: "2024-01-22", type: "buy" as const, price: candlestickData[21].close },
  { time: "2024-01-28", type: "sell" as const, price: candlestickData[27].close },
];

export function BacktestViewNew({ strategyType = "spot", onNavigateToDeploy }: BacktestViewNewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [strategyModified, setStrategyModified] = useState(false);
  
  const [params, setParams] = useState<BacktestParams>({
    dataSource: "Binance Spot",
    tradingPair: "ETH/USDT",
    initialCapital: "10,000",
    timeframe: "1h",
    startDate: "2024-01-01",
    endDate: "2024-01-30",
  });
  
  const [originalParams, setOriginalParams] = useState(params);
  
  const hasParamsChanged = JSON.stringify(params) !== JSON.stringify(originalParams);
  const canRunBacktest = hasParamsChanged || strategyModified;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setOriginalParams(params);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const dataSourceOptions = [
    { value: "Binance Spot", label: "Binance Spot", disabled: strategyType === "futures" },
    { value: "OKX Spot", label: "OKX Spot", disabled: strategyType === "futures" },
    { value: "Bybit Spot", label: "Bybit Spot", disabled: strategyType === "futures" },
    { value: "Binance Futures", label: "Binance Futures", disabled: strategyType === "spot" },
    { value: "OKX Futures", label: "OKX Futures", disabled: strategyType === "spot" },
    { value: "Bybit Futures", label: "Bybit Futures", disabled: strategyType === "spot" },
  ];
  
  const handleRunBacktest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOriginalParams(params);
      setStrategyModified(false);
    }, 3000);
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || isThinking) return;
    
    const lowerMessage = message.toLowerCase();
    const isOptimizeRequest = lowerMessage.includes("优化代码") || lowerMessage.includes("更新代码");

    if (isOptimizeRequest) {
      setChatMessages([...chatMessages, { role: "user", content: message }]);
      setMessage("");
      setIsThinking(true);

      setTimeout(() => {
        setIsThinking(false);
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "我已经对策略代码进行了优化：\n\n✓ 增加了缓存机制，避免重复计算交易区间\n✓ 优化了成交量计算逻辑，使用滑动窗口提升性能\n✓ 添加了更严格的风险控制，最小盈亏比从2.0提升至3.0\n✓ 改进了K线形态识别算法，减少假信号\n\n代码优化已完成。",
          },
        ]);
        setStrategyModified(true);
      }, 2000);
    } else {
      setChatMessages([...chatMessages, 
        { role: "user", content: message },
        { role: "assistant", content: "好的，我会根据您的建议来调整策略。" }
      ]);
      setMessage("");
    }
  };
  
  // 自定义回测模式
  if (isCustomMode) {
    return (
      <div className="h-full flex flex-col bg-black">
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <button
            onClick={() => setIsCustomMode(false)}
            className="flex items-center gap-2 px-4 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#0a0a0a] rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[15px] font-medium tracking-tight">返回标准回测</span>
          </button>
        </div>

        {/* Strategy Code Badge */}
        <div className="px-6 pb-3">
          <StrategyCodeBadge />
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 min-h-0 border-t border-[#1f1f23]">
          <CustomBacktestChat />
        </div>
      </div>
    );
  }
  
  // 标准回测模式
  return (
    <div className="h-full flex bg-black">
      {/* 左侧主区域 60% - 可滚动 */}
      <div className="w-[60%] overflow-y-auto border-r border-[#1f1f23]">
        <div className="p-6 space-y-6">
          {/* 回测参数配置 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-semibold text-white tracking-tight">回测配置</h3>
              <button
                onClick={() => setIsCustomMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-xl transition-all text-[14px] font-medium"
              >
                <Upload className="w-4 h-4" />
                自定义回测
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div>
                <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">数据源</label>
                <select
                  value={params.dataSource}
                  onChange={(e) => setParams({ ...params, dataSource: e.target.value })}
                  className="w-full bg-[#0a0a0a] text-white px-4 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all"
                >
                  {dataSourceOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={option.disabled ? "text-[#52525b]" : ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">交易对</label>
                <select
                  value={params.tradingPair}
                  onChange={(e) => setParams({ ...params, tradingPair: e.target.value })}
                  className="w-full bg-[#0a0a0a] text-white px-4 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all"
                >
                  <option>ETH/USDT</option>
                  <option>BTC/USDT</option>
                  <option>SOL/USDT</option>
                  <option>BNB/USDT</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">初始本金</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={params.initialCapital}
                      onChange={(e) => setParams({ ...params, initialCapital: e.target.value })}
                      className="w-full bg-[#0a0a0a] text-white px-4 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#71717a]">USDT</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">K线粒度</label>
                  <select
                    value={params.timeframe}
                    onChange={(e) => setParams({ ...params, timeframe: e.target.value })}
                    className="w-full bg-[#0a0a0a] text-white px-4 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all"
                  >
                    <option value="1m">1m</option>
                    <option value="5m">5m</option>
                    <option value="15m">15m</option>
                    <option value="30m">30m</option>
                    <option value="1h">1h</option>
                    <option value="4h">4h</option>
                    <option value="1d">1d</option>
                    <option value="1w">1w</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">回测区间</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={params.startDate}
                    onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                    className="flex-1 bg-[#0a0a0a] text-white px-3 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[13px] transition-all"
                  />
                  <span className="text-[#71717a]">-</span>
                  <input
                    type="date"
                    value={params.endDate}
                    onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                    className="flex-1 bg-[#0a0a0a] text-white px-3 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[13px] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* K线图区域 */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] rounded-xl z-10 border border-[#1f1f23]">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-[#3b82f6] animate-spin mx-auto mb-3" />
                  <p className="text-[15px] text-[#a1a1aa]">正在生成回测结果...</p>
                </div>
              </div>
            )}
            
            <div className={`bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-5 ${isLoading ? 'opacity-0' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">ETH/USDT 价格走势</h3>
                  <p className="text-[13px] text-[#71717a] mt-0.5">回测期间价格变化与交易信号</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full"></div>
                    <span className="text-[13px] text-[#71717a]">买入</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#ef4444] rounded-full"></div>
                    <span className="text-[13px] text-[#71717a]">卖出</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[320px] w-full overflow-hidden">
                <CandlestickChart
                  data={candlestickData}
                  signals={tradeSignals}
                  symbol="ETH/USDT"
                  timeframe="D"
                />
              </div>
            </div>
          </div>
          
          {/* 回测结果指标 */}
          {isLoading ? (
            <div className="h-[140px] bg-[#0a0a0a] border border-[#1f1f23] rounded-xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#71717a] tracking-tight">总回报率</span>
                  <TrendingUp className="w-4 h-4 text-[#10b981]" />
                </div>
                <div className="text-[28px] font-semibold text-[#10b981] mb-1">+15.4%</div>
                <div className="text-[13px] text-[#71717a]">净收益: +$1,540</div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#71717a] tracking-tight">最大回撤</span>
                  <TrendingDown className="w-4 h-4 text-[#ef4444]" />
                </div>
                <div className="text-[28px] font-semibold text-[#ef4444] mb-1">-4.2%</div>
                <div className="text-[13px] text-[#71717a]">最大损失: -$420</div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#71717a] tracking-tight">胜率</span>
                  <Target className="w-4 h-4 text-[#3b82f6]" />
                </div>
                <div className="text-[28px] font-semibold text-white mb-1">65%</div>
                <div className="text-[13px] text-[#71717a]">13胜 / 20笔交易</div>
              </div>
            </div>
          )}
          
          {/* 交易记录日志 */}
          {isLoading ? (
            <div className="h-[600px] bg-[#0a0a0a] border border-[#1f1f23] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin mx-auto mb-2" />
                <p className="text-[14px] text-[#71717a]">加载交易记录...</p>
              </div>
            </div>
          ) : (
            <TradeLogs />
          )}
        </div>
      </div>
      
      {/* 右侧策略对话区域 40% */}
      <div className="w-[40%] flex flex-col bg-black">
        {/* Strategy Code Badge - Top */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <StrategyCodeBadge />
        </div>

        {/* 对话消息 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {chatMessages.length > 0 && (
            <div className="space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-[#0a0a0a] border border-[#1f1f23] text-white"
                      : "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[13px] font-semibold text-white">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isThinking && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed bg-[#0a0a0a] border border-[#1f1f23] text-[#71717a]">
                    正在分析代码并进行优化...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 底部对话框 + 回测/部署按钮 */}
        <div className="border-t border-[#1f1f23] px-6 py-5 space-y-3 flex-shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="通过对话修改策略代码..."
              className="flex-1 bg-[#0a0a0a] text-white px-4 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[14px] placeholder-[#52525b] transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-4 py-3 bg-[#18181b] hover:bg-[#27272a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* 重新回测按钮 */}
          <button
            onClick={handleRunBacktest}
            disabled={!canRunBacktest || isLoading}
            className={`w-full py-3.5 rounded-xl text-[15px] font-medium transition-all flex items-center justify-center gap-2.5 ${
              canRunBacktest && !isLoading
                ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-lg hover:shadow-blue-500/20 text-white"
                : "bg-[#18181b] text-[#52525b] cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                回测中...
              </>
            ) : (
              <>
                {canRunBacktest ? (
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                      rotate: [0, 0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
                参数/策略发生变更，重新回测
              </>
            )}
          </button>
          
          {!canRunBacktest && !isLoading && (
            <p className="text-[11px] text-[#71717a] text-center">
              修改回测参数或策略代码后可重新发起回测
            </p>
          )}
          
          {/* 部署至虚拟盘按钮 */}
          {!isLoading && (
            <button
              onClick={onNavigateToDeploy}
              className="w-full py-3.5 rounded-xl text-[15px] font-medium bg-gradient-to-r from-[#10b981] to-[#059669] hover:shadow-lg hover:shadow-green-500/20 text-white transition-all flex items-center justify-center gap-2.5"
            >
              <Rocket className="w-5 h-5" />
              回测模拟完整，部署策略至模拟盘
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
