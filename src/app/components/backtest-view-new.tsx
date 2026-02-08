import { useState, useEffect } from "react";
import { ArrowLeft, Play, RotateCcw, Download, Send, Upload, ChevronDown, ChevronUp, Loader2, TrendingUp, TrendingDown, Target, Code2, Sparkles, Rocket } from "lucide-react";
import { CandlestickChart } from "./candlestick-chart";
import { CustomBacktestChat } from "./custom-backtest-chat";
import { TradeLogs } from "./trade-logs";
import { SyntaxHighlighter } from "./syntax-highlighter";
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
  strategyType?: "spot" | "futures"; // 从 step1 传入的策略类型
  onNavigateToDeploy?: () => void; // 导航到部署页面的回调
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

// 策略代码示例
const strategyCode = `# Wyckoff Spring Strategy v1.0

def detect_accumulation_range(bars, period=50):
    """识别吸筹区间"""
    highs = [bar.high for bar in bars[-period:]]
    lows = [bar.low for bar in bars[-period:]]
    
    resistance = max(highs)
    support = min(lows)
    range_size = resistance - support
    
    return {
        'support': support,
        'resistance': resistance,
        'range': range_size
    }

def detect_spring(bar, prev_bars, accumulation):
    """检测弹簧(Spring)信号"""
    support = accumulation['support']
    avg_volume = sum([b.volume for b in prev_bars]) / len(prev_bars)
    
    # 条件1: 价格跌破支撑位
    spring_low = bar.low < support
    
    # 条件2: 收盘价收回区间内
    close_above = bar.close > support
    
    # 条件3: 成交量放大 (2倍以上)
    volume_climax = bar.volume > avg_volume * 2.0
    
    return spring_low and close_above and volume_climax

def wait_for_test(bars, spring_bar, accumulation):
    """等待二次测试"""
    support = accumulation['support']
    
    for bar in bars:
        # 回调至支撑位附近
        near_support = abs(bar.low - support) / support < 0.02
        
        # K线形态确认: 看涨吞没或Pinbar
        bullish_engulfing = (
            bar.close > bar.open and
            bar.close > bars[-1].close and
            bar.open < bars[-1].open
        )
        
        pinbar = (
            (bar.high - bar.close) < (bar.close - bar.low) * 0.3 and
            (bar.close - bar.low) > (bar.high - bar.low) * 0.6
        )
        
        if near_support and (bullish_engulfing or pinbar):
            return True
    
    return False

# 主策略逻辑
def strategy_logic(bars):
    accumulation = detect_accumulation_range(bars)
    
    if detect_spring(bars[-1], bars[-20:], accumulation):
        if wait_for_test(bars[-5:], bars[-1], accumulation):
            # 入场信号
            entry_price = bars[-1].close
            stop_loss = bars[-1].low * 0.98
            take_profit = accumulation['resistance']
            
            return {
                'action': 'BUY',
                'entry': entry_price,
                'stop_loss': stop_loss,
                'take_profit': take_profit
            }
    
    return None`;

export function BacktestViewNew({ strategyType = "spot", onNavigateToDeploy }: BacktestViewNewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [strategyModified, setStrategyModified] = useState(false); // 追踪策略是否被修改
  
  const [params, setParams] = useState<BacktestParams>({
    dataSource: "Binance Spot",
    tradingPair: "ETH/USDT",
    initialCapital: "10,000",
    timeframe: "1h",
    startDate: "2024-01-01",
    endDate: "2024-01-30",
  });
  
  const [originalParams, setOriginalParams] = useState(params);
  
  // 检测参数是否有变化或策略是否被修改
  const hasParamsChanged = JSON.stringify(params) !== JSON.stringify(originalParams);
  const canRunBacktest = hasParamsChanged || strategyModified;
  
  // 初始加载（模拟回测）
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setOriginalParams(params);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 数据源选项（根据策略类型禁用期货/现货）
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
      setStrategyModified(false); // 重置策略修改标记
    }, 3000);
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || isThinking) return;
    
    // 检测关键词
    const lowerMessage = message.toLowerCase();
    const isOptimizeRequest = lowerMessage.includes("优化代码") || lowerMessage.includes("更新代码");

    if (isOptimizeRequest) {
      // 添加用户消息
      setChatMessages([...chatMessages, { role: "user", content: message }]);
      setMessage("");
      setIsThinking(true);

      // 模拟AI思考过程 (2秒)
      setTimeout(() => {
        setIsThinking(false);
        
        // 添加AI回复
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "我已经对策略代码进行了优化：\\n\\n✓ 增加了缓存机制，避免重复计算交易区间\\n✓ 优化了成交量计算逻辑，使用滑动窗口提升性能\\n✓ 添加了更严格的风险控制，最小盈亏比从2.0提升至3.0\\n✓ 改进了K线形态识别算法，减少假信号\\n\\n代码优化已完成。",
          },
        ]);
        
        // 标记策略已修改
        setStrategyModified(true);
      }, 2000);
    } else {
      // 普通消息处理
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
        <div className="h-[73px] px-6 border-b border-[#1f1f23] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCustomMode(false)}
              className="flex items-center gap-2 px-4 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#0a0a0a] rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-[15px] font-medium tracking-tight">返回标准回测</span>
            </button>
          </div>
        </div>
        
        {/* 左右分屏布局 */}
        <div className="flex-1 flex min-h-0">
          {/* 左侧对话区域 60% */}
          <div className="w-[60%] border-r border-[#1f1f23] h-full">
            <CustomBacktestChat />
          </div>
          
          {/* 右侧策略代码 40% */}
          <div className="w-[40%] flex flex-col h-full bg-black">
            <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
              {/* File Header - 与step1一致 */}
              <div className="mb-4 bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-[#10b981]" />
                    <span className="text-white font-mono text-[13px] tracking-tight">Wyckoff_Spring_Strategy.py</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                    <span className="text-[#10b981] text-[11px] font-mono font-medium tracking-tight">Ready</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#71717a] font-mono space-y-0.5">
                  <div>Type: Pure Price Action / Smart Money</div>
                  <div>Timeframe: 4H / 1D</div>
                </div>
              </div>
              
              {/* 代码编辑器 */}
              <SyntaxHighlighter language="python" code={strategyCode} />
            </div>
            
            {/* 底部部署按钮 */}
            <div className="border-t border-[#1f1f23] px-6 py-5 flex-shrink-0">
              <button className="w-full py-3.5 rounded-xl text-[15px] font-medium bg-gradient-to-r from-[#10b981] to-[#059669] hover:shadow-lg hover:shadow-green-500/20 text-white transition-all flex items-center justify-center gap-2.5">
                <Rocket className="w-5 h-5" />
                回测模拟完整，部署策略至模拟盘
              </button>
            </div>
          </div>
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
        {/* 策略代码展示 - 可滚动 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* File Header - 与step1一致 */}
          <div className="mb-4 bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-white font-mono text-[13px] tracking-tight">Wyckoff_Spring_Strategy.py</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                <span className="text-[#10b981] text-[11px] font-mono font-medium tracking-tight">Ready</span>
              </div>
            </div>
            <div className="text-[11px] text-[#71717a] font-mono space-y-0.5">
              <div>Type: Pure Price Action / Smart Money</div>
              <div>Timeframe: 4H / 1D</div>
            </div>
          </div>
          
          {/* 对话消息 */}
          {chatMessages.length > 0 && (
            <div className="mb-4 space-y-3">
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
              
              {/* 思考状态 */}
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
          
          {/* 代码编辑器 */}
          <SyntaxHighlighter language="python" code={strategyCode} />
        </div>
        
        {/* 底部对话框 + 发起回测按钮 */}
        <div className="border-t border-[#1f1f23] px-6 py-5 space-y-3">
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