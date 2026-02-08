import { useState } from "react";
import { StopCircle, Settings, TrendingUp, TrendingDown, Target, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RotateCcw, Sparkles, Send, ArrowLeft } from "lucide-react";
import { CandlestickChart } from "./candlestick-chart";
import { SyntaxHighlighter } from "./syntax-highlighter";

interface StrategyDetailProps {
  strategyId: string;
  currentTab?: "detail" | "editor";
  onTabChange?: (tab: "detail" | "editor") => void;
  onBackToDashboard?: () => void;
}

interface CodeVersion {
  id: number;
  version: string;
  timestamp: string;
  description: string;
  code: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const codeVersions: CodeVersion[] = [
  {
    id: 3,
    version: "v1.2",
    timestamp: "2026-02-08 14:20:15",
    description: "优化止损逻辑：采用ATR动态止损替代固定比例，提升风险调整后收益",
    code: `# Fear & Greed DCA Strategy v1.2
import ccxt
import pandas as pd
import pandas_ta as ta
from datetime import datetime

class FearGreedDCAStrategy:
    def __init__(self, exchange, symbol='BTC/USDT'):
        self.exchange = exchange
        self.symbol = symbol
        self.position_size = 0
        self.avg_entry_price = 0
        
    def calculate_atr(self, period=14):
        """计算ATR用于动态止损"""
        ohlcv = self.exchange.fetch_ohlcv(self.symbol, '4h', limit=period + 1)
        df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        atr = ta.atr(df['high'], df['low'], df['close'], length=period)
        return atr.iloc[-1]
    
    def check_exit_signal(self):
        """检查出场信号 - 使用ATR动态止损"""
        if self.position_size == 0:
            return False, None
            
        current_price = self.exchange.fetch_ticker(self.symbol)['last']
        atr = self.calculate_atr()
        
        # 动态止损: 入场价 - 2.0 * ATR
        stop_loss = self.avg_entry_price - (2.0 * atr)
        
        # 动态止盈: 入场价 + 4.0 * ATR (风险回报比 1:2)
        take_profit = self.avg_entry_price + (4.0 * atr)
        
        if current_price <= stop_loss:
            return True, "stop_loss"
        elif current_price >= take_profit:
            return True, "take_profit"
            
        return False, None`
  },
  {
    id: 2,
    version: "v1.1",
    timestamp: "2026-02-07 09:45:32",
    description: "增加风险控制模块：限制单次买入金额上限，避免过度集中",
    code: `# Fear & Greed DCA Strategy v1.1
import ccxt
import pandas as pd
import pandas_ta as ta

class FearGreedDCAStrategy:
    def __init__(self, exchange, symbol='BTC/USDT', max_position_pct=0.5):
        self.exchange = exchange
        self.symbol = symbol
        self.position_size = 0
        self.avg_entry_price = 0
        self.max_position_pct = max_position_pct
        
    def calculate_position_size(self, fear_index, available_capital):
        """根据恐慌指数计算仓位 + 风险上限"""
        if fear_index < 20:
            allocation = 0.05
        elif fear_index < 40:
            allocation = 0.03
        elif fear_index < 60:
            allocation = 0.01
        else:
            allocation = 0
        
        target_size = available_capital * allocation
        
        # 风险控制：确保总仓位不超过资金的50%
        current_position_value = self.position_size * self.exchange.fetch_ticker(self.symbol)['last']
        if (current_position_value + target_size) > (available_capital * self.max_position_pct):
            target_size = max(0, available_capital * self.max_position_pct - current_position_value)
            
        return target_size`
  },
  {
    id: 1,
    version: "v1.0",
    timestamp: "2026-02-05 16:30:20",
    description: "初始版本：基于恐慌贪婪指数的定投策略，固定止损2%",
    code: `# Fear & Greed DCA Strategy v1.0
import ccxt
import pandas as pd
import pandas_ta as ta

class FearGreedDCAStrategy:
    def __init__(self, exchange, symbol='BTC/USDT'):
        self.exchange = exchange
        self.symbol = symbol
        self.position_size = 0
        self.avg_entry_price = 0
        
    def check_exit_signal(self):
        """检查出场信号 - 固定2%止损"""
        if self.position_size == 0:
            return False, None
            
        current_price = self.exchange.fetch_ticker(self.symbol)['last']
        stop_loss = self.avg_entry_price * 0.98
        take_profit = self.avg_entry_price * 1.10
        
        if current_price <= stop_loss:
            return True, "stop_loss"
        elif current_price >= take_profit:
            return True, "take_profit"
        return False, None`
  }
];

const initialConversation: ChatMessage[] = [
  {
    role: "user",
    content: "我注意到最近策略的夏普比率从1.8降到了1.2，回测显示在高波动期间止损被频繁触发。我怀疑是固定2%的止损在不同市场环境下不够灵活。",
    timestamp: "2026-02-08 13:45:12"
  },
  {
    role: "assistant",
    content: "您的观察很准确。固定百分比止损确实存在局限性：\n\n1. **市场波动性变化**：在高波动期（如VIX>30），2%止损可能在正常价格波动中被触发，导致过早离场\n2. **数据支持**：我分析了最近30天的交易记录，发现：\n   - 19次止损中，有12次在触发后价格反弹至盈利区间\n   - 平均噪音幅度为2.8%，超过了止损阈值\n\n建议采用ATR（Average True Range）动态止损：\n- ATR能自适应市场波动\n- 止损距离 = 入场价 - (2.0 × ATR14)\n- 这样在低波动期收紧保护，高波动期给予空间",
    timestamp: "2026-02-08 13:47:35"
  },
  {
    role: "user",
    content: "ATR动态止损听起来合理。但我担心两个问题：\n1. ATR的计算周期应该用多少？14是标准参数，但对于4小时级别交易是否合适？\n2. 2.0倍ATR会不会太宽？在极端行情下可能导致亏损扩大。",
    timestamp: "2026-02-08 13:52:08"
  },
  {
    role: "assistant",
    content: "非常好的问题，让我们用数据说话：\n\n**关于ATR周期：**\n我对比了不同周期的表现（基于您的BTC 4H策略）：\n```\nATR10: 夏普 1.65, 胜率 68%, 最大回撤 -6.2%\nATR14: 夏普 1.82, 胜率 71%, 最大回撤 -4.8%  ← 推荐\nATR20: 夏普 1.71, 胜率 69%, 最大回撤 -5.1%\n```\nATR14在您的策略中表现最优，既不过度敏感也不滞后。\n\n**关于倍数设置：**\n您说得对，2.0倍需要结合风险收益比：\n- 止损: 2.0 × ATR\n- 止盈: 4.0 × ATR（保持1:2风险回报比）\n\n实测数据：\n- 平均单笔亏损: -1.8%\n- 平均单笔盈利: +4.2%\n- 盈亏比: 2.33（优于固定止损的1.85）\n\n如果您更保守，可以改为1.5×ATR止损 + 3.0×ATR止盈。",
    timestamp: "2026-02-08 13:56:42"
  },
  {
    role: "user",
    content: "数据很有说服力。我还想确认一下技术实现：\n1. ATR计算是用4小时K线还是日线？\n2. 代码中如何处理ATR在横盘震荡期过小的情况？\n3. 这个改动会影响现有的仓位管理逻辑吗？",
    timestamp: "2026-02-08 14:02:15"
  },
  {
    role: "assistant",
    content: "**1. 时间框架选择：**\n建议使用4小时K线计算ATR，与您的交易周期一致。这样止损距离会基于实际操作级别的波动，更贴近真实市场环境。\n\n**2. ATR过小的处理：**\n这是个关键问题。我会加入最小止损保护：\n```python\ndef calculate_dynamic_stop(self, entry_price, atr):\n    # 止损距离：取ATR的2倍 或 入场价的1.5%，哪个大用哪个\n    atr_stop_distance = 2.0 * atr\n    min_stop_distance = entry_price * 0.015  # 最小1.5%\n    stop_distance = max(atr_stop_distance, min_stop_distance)\n    return entry_price - stop_distance\n```\n\n**3. 与仓位管理的关系：**\n不会冲突。改动仅在`check_exit_signal()`方法中：\n- 仓位管理（基于恐慌指数）：决定**买多少**\n- 动态止损（基于ATR）：决定**何时卖**\n\n两者是独立模块，可以安全升级。需要我帮您生成完整的v1.2代码吗？",
    timestamp: "2026-02-08 14:08:30"
  },
  {
    role: "user",
    content: "太好了，麻烦帮我生成v1.2的完整代码。请确保：\n1. ATR使用4小时K线，周期14\n2. 止损2.0×ATR，止盈4.0×ATR\n3. 添加最小1.5%止损保护\n4. 保持原有的Fear&Greed仓位管理逻辑\n5. 在关键位置加上注释，方便后续维护",
    timestamp: "2026-02-08 14:12:18"
  },
  {
    role: "assistant",
    content: "完美！我已经为您生成了v1.2版本的策略代码，主要改进包括：\n\n✅ **核心升级：**\n1. 新增`calculate_atr()`方法，使用4H K线 + 14周期\n2. 重构`check_exit_signal()`，实现动态止损/止盈：\n   - 止损 = 入场价 - 2.0×ATR\n   - 止盈 = 入场价 + 4.0×ATR\n3. 内置最小止损保护（隐式通过ATR下限）\n\n✅ **保持兼容：**\n- Fear&Greed仓位分配逻辑不变\n- API调用接口不变\n- 数据结构不变\n\n✅ **代码质量：**\n- 添加详细的中文注释\n- 符合CCXT + Pandas-TA标准框架\n- 所有变量命名清晰易懂\n\n建议先在模拟盘测试2-3天，观察止损触发频率和盈亏比变化。如果表现稳定，可以切换到实盘。",
    timestamp: "2026-02-08 14:15:45"
  }
];

export function StrategyDetailWithEditor({ strategyId, currentTab = "detail", onTabChange, onBackToDashboard }: StrategyDetailProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "editor">(currentTab);
  const [isVersionsExpanded, setIsVersionsExpanded] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(codeVersions[0]);
  const [messages] = useState<ChatMessage[]>(initialConversation);
  const [newMessage, setNewMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const handleTabChange = (tab: "detail" | "editor") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
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

  const allLogs = [
    {
      timestamp: "2026-02-08 14:32:15.234",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 42150.00,
      amount: 0.05,
      value: 2107.50,
      fee: 1.58,
      orderId: "1827364912",
      status: "FILLED",
      trigger: "Fear&Greed=18 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-08 13:45:19.890",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 41200.00,
      amount: 0.03,
      value: 1236.00,
      fee: 0.93,
      orderId: "1827362145",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 180.50,
    },
    {
      timestamp: "2026-02-08 09:20:15.234",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 39850.00,
      amount: 0.04,
      value: 1594.00,
      fee: 1.20,
      orderId: "1827358901",
      status: "FILLED",
      trigger: "Fear&Greed=22 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-08 06:15:44.789",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 38900.00,
      amount: 0.06,
      value: 2334.00,
      fee: 1.75,
      orderId: "1827355678",
      status: "FILLED",
      trigger: "Stop-Loss (2.0×ATR)",
      pnl: -90.00,
    },
    {
      timestamp: "2026-02-08 02:15:45.456",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 40500.00,
      amount: 0.02,
      value: 810.00,
      fee: 0.61,
      orderId: "1827352341",
      status: "FILLED",
      trigger: "Fear&Greed=25 (Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-07 22:15:33.890",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 41800.00,
      amount: 0.05,
      value: 2090.00,
      fee: 1.57,
      orderId: "1827348912",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 220.00,
    },
    {
      timestamp: "2026-02-07 18:30:22.123",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 39250.00,
      amount: 0.055,
      value: 2158.75,
      fee: 1.62,
      orderId: "1827345678",
      status: "FILLED",
      trigger: "Fear&Greed=16 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-07 14:45:18.567",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 40950.00,
      amount: 0.04,
      value: 1638.00,
      fee: 1.23,
      orderId: "1827342156",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 156.80,
    },
    {
      timestamp: "2026-02-07 10:20:45.234",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 38750.00,
      amount: 0.03,
      value: 1162.50,
      fee: 0.87,
      orderId: "1827338901",
      status: "FILLED",
      trigger: "Fear&Greed=19 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-07 06:15:33.890",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 37900.00,
      amount: 0.025,
      value: 947.50,
      fee: 0.71,
      orderId: "1827335234",
      status: "FILLED",
      trigger: "Stop-Loss (2.0×ATR)",
      pnl: -52.30,
    },
    {
      timestamp: "2026-02-07 02:30:15.456",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 39100.00,
      amount: 0.045,
      value: 1759.50,
      fee: 1.32,
      orderId: "1827331567",
      status: "FILLED",
      trigger: "Fear&Greed=21 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-06 20:45:22.789",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 40650.00,
      amount: 0.035,
      value: 1422.75,
      fee: 1.07,
      orderId: "1827328345",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 142.50,
    },
    {
      timestamp: "2026-02-06 16:20:18.234",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 38450.00,
      amount: 0.06,
      value: 2307.00,
      fee: 1.73,
      orderId: "1827324901",
      status: "FILLED",
      trigger: "Fear&Greed=17 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-06 12:15:45.567",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 39800.00,
      amount: 0.05,
      value: 1990.00,
      fee: 1.49,
      orderId: "1827321234",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 195.40,
    },
    {
      timestamp: "2026-02-06 08:30:33.123",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 37850.00,
      amount: 0.055,
      value: 2081.75,
      fee: 1.56,
      orderId: "1827317890",
      status: "FILLED",
      trigger: "Fear&Greed=15 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-06 04:45:19.890",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 36950.00,
      amount: 0.04,
      value: 1478.00,
      fee: 1.11,
      orderId: "1827314567",
      status: "FILLED",
      trigger: "Stop-Loss (2.0×ATR)",
      pnl: -78.90,
    },
    {
      timestamp: "2026-02-06 00:20:15.456",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 38200.00,
      amount: 0.042,
      value: 1604.40,
      fee: 1.20,
      orderId: "1827311234",
      status: "FILLED",
      trigger: "Fear&Greed=20 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-05 20:15:33.789",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 39950.00,
      amount: 0.048,
      value: 1917.60,
      fee: 1.44,
      orderId: "1827307901",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 188.20,
    },
    {
      timestamp: "2026-02-05 16:30:22.234",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 37650.00,
      amount: 0.05,
      value: 1882.50,
      fee: 1.41,
      orderId: "1827304567",
      status: "FILLED",
      trigger: "Fear&Greed=18 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-05 12:45:18.567",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 39200.00,
      amount: 0.055,
      value: 2156.00,
      fee: 1.62,
      orderId: "1827301234",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 210.50,
    },
    {
      timestamp: "2026-02-05 08:20:45.123",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 36900.00,
      amount: 0.065,
      value: 2398.50,
      fee: 1.80,
      orderId: "1827297890",
      status: "FILLED",
      trigger: "Fear&Greed=14 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-05 04:15:33.890",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 38450.00,
      amount: 0.06,
      value: 2307.00,
      fee: 1.73,
      orderId: "1827294567",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 225.80,
    },
    {
      timestamp: "2026-02-05 00:30:19.456",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 37100.00,
      amount: 0.045,
      value: 1669.50,
      fee: 1.25,
      orderId: "1827291234",
      status: "FILLED",
      trigger: "Fear&Greed=16 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-04 20:45:22.789",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 36200.00,
      amount: 0.035,
      value: 1267.00,
      fee: 0.95,
      orderId: "1827287901",
      status: "FILLED",
      trigger: "Stop-Loss (2.0×ATR)",
      pnl: -65.20,
    },
    {
      timestamp: "2026-02-04 16:20:15.234",
      side: "BUY",
      symbol: "BTC/USDT",
      price: 37450.00,
      amount: 0.053,
      value: 1984.85,
      fee: 1.49,
      orderId: "1827284567",
      status: "FILLED",
      trigger: "Fear&Greed=19 (Extreme Fear)",
      pnl: null,
    },
    {
      timestamp: "2026-02-04 12:15:33.567",
      side: "SELL",
      symbol: "BTC/USDT",
      price: 39100.00,
      amount: 0.047,
      value: 1837.70,
      fee: 1.38,
      orderId: "1827281234",
      status: "FILLED",
      trigger: "Take-Profit (4.0×ATR)",
      pnl: 178.50,
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

  if (activeTab === "editor") {
    return (
      <div className="h-full flex overflow-hidden">
        {/* Center: AI Chat */}
        <div className="w-[45%] border-r border-[#1f1f23] flex flex-col bg-black">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === "user" ? "order-1" : ""}`}>
                  <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "assistant"
                      ? "bg-[#0a0a0a] border border-[#1f1f23] text-white"
                      : "bg-[#3b82f6] text-white"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.timestamp && (
                    <div className={`text-[11px] text-[#71717a] mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                      {msg.timestamp}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] font-semibold text-white">U</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-[#1f1f23] p-4 bg-[#0a0a0a]">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="继续与 AI 讨论策略优化..."
                className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#71717a] focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
              <button
                onClick={handleSendMessage}
                className="px-5 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="w-[55%] flex flex-col bg-black">
          {/* Code Header */}
          <div className="border-b border-[#1f1f23] p-4 bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[15px] font-semibold text-white tracking-tight">策略代码</h3>
                <p className="text-[12px] text-[#71717a] mt-0.5 font-mono">fear_greed_dca_strategy.py</p>
              </div>
              <div className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
                <span className="text-[12px] text-[#10b981] font-medium">{currentVersion.version}</span>
              </div>
            </div>

            {/* Version Dropdown */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
              <button
                onClick={() => setIsVersionsExpanded(!isVersionsExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#27272a]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-[13px] text-white font-medium">{currentVersion.version} - {currentVersion.timestamp}</div>
                    <div className="text-[12px] text-[#71717a] mt-0.5">{currentVersion.description}</div>
                  </div>
                </div>
                {isVersionsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#71717a]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#71717a]" />
                )}
              </button>

              {isVersionsExpanded && (
                <div className="border-t border-[#27272a]">
                  {codeVersions.map((version) => (
                    <div
                      key={version.id}
                      className={`px-4 py-3 flex items-center justify-between hover:bg-[#27272a]/30 transition-colors border-t border-[#27272a]/50 ${
                        version.id === currentVersion.id ? "bg-[#3b82f6]/5" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] text-white font-medium">{version.version}</span>
                          <span className="text-[11px] text-[#71717a]">{version.timestamp}</span>
                        </div>
                        <div className="text-[12px] text-[#a1a1aa]">{version.description}</div>
                      </div>
                      {version.id !== currentVersion.id && (
                        <button
                          className="ml-4 px-3 py-1.5 bg-[#3b82f6]/20 hover:bg-[#3b82f6]/30 text-[#3b82f6] border border-[#3b82f6]/30 rounded-lg transition-colors flex items-center gap-1.5 text-[12px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          恢复
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <SyntaxHighlighter language="python" code={currentVersion.code} />
          </div>
        </div>
      </div>
    );
  }

  // Detail view (original content)
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
              onClick={() => handleTabChange("editor")}
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

      {/* Section 3: 策略执行 Logs */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl text-white mb-1">策略执行 Logs</h3>
          <p className="text-sm text-[#a1a1aa]">Strategy Execution Logs</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg overflow-hidden">
          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-[#27272a]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">时间戳</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">方向</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">交易对</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">价格</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">数量</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">总金额</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">手续费</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">盈亏</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">触发原因</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {currentLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-[#18181b] transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-[#71717a] whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        log.side === "BUY" 
                          ? "bg-[#10b981]/10 text-[#10b981]" 
                          : "bg-[#ef4444]/10 text-[#ef4444]"
                      }`}>
                        {log.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white font-mono">{log.symbol}</td>
                    <td className="px-4 py-3 text-xs text-white font-mono text-right">${log.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-xs text-white font-mono text-right">{log.amount.toFixed(3)}</td>
                    <td className="px-4 py-3 text-xs text-white font-mono text-right">${log.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-xs text-[#a1a1aa] font-mono text-right">${log.fee.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs font-mono text-right">
                      {log.pnl !== null ? (
                        <span className={log.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>
                          {log.pnl >= 0 ? "+" : ""}${log.pnl.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[#52525b]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#a1a1aa]">{log.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-black border-t border-[#27272a] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#a1a1aa]">
                显示 {(currentPage - 1) * logsPerPage + 1} - {Math.min(currentPage * logsPerPage, allLogs.length)} / 共 {allLogs.length} 条
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed text-white border border-[#27272a] rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      page === currentPage
                        ? "bg-[#3b82f6] text-white"
                        : "bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed text-white border border-[#27272a] rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}