import { TrendingUp, TrendingDown, Target, Settings } from "lucide-react";
import { CandlestickChart } from "./candlestick-chart";

// Generate realistic candlestick data
const generateCandlestickData = () => {
  const data = [];
  let basePrice = 2500; // ETH price
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

// Trade signals
const tradeSignals = [
  { time: "2024-01-04", type: "buy" as const, price: candlestickData[3].close },
  { time: "2024-01-08", type: "sell" as const, price: candlestickData[7].close },
  { time: "2024-01-13", type: "buy" as const, price: candlestickData[12].close },
  { time: "2024-01-17", type: "sell" as const, price: candlestickData[16].close },
  { time: "2024-01-22", type: "buy" as const, price: candlestickData[21].close },
  { time: "2024-01-28", type: "sell" as const, price: candlestickData[27].close },
];

export function BacktestView() {
  return (
    <div className="p-8">
      {/* Top Bar: Backtest Parameters */}
      <div className="mb-6">
        <h3 className="text-xl text-white mb-4">回测配置</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">数据源</label>
            <select className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb]">
              <option>Binance Spot</option>
              <option>OKX Spot</option>
              <option>Bybit Spot</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">交易对</label>
            <select className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb]">
              <option>ETH/USDT</option>
              <option>BTC/USDT</option>
              <option>SOL/USDT</option>
              <option>BNB/USDT</option>
              <option>XRP/USDT</option>
              <option>ADA/USDT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">初始测试本金</label>
            <input
              type="text"
              defaultValue="10,000 USDT"
              className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb]"
            />
            <p className="text-xs text-[#a1a1aa] mt-1">仅用于模拟计算</p>
          </div>
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">回测区间</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                defaultValue="2024-01-01"
                className="flex-1 bg-[#1a1a1a] text-white px-3 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb] text-sm"
              />
              <span className="text-[#a1a1aa]">-</span>
              <input
                type="date"
                defaultValue="2024-01-30"
                className="flex-1 bg-[#1a1a1a] text-white px-3 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-[500px] bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg text-white">BTC/USDT 价格走势</h3>
            <p className="text-sm text-[#a1a1aa]">回测期间价格变化与交易信号</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
              <span className="text-sm text-[#a1a1aa]">买入信号</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
              <span className="text-sm text-[#a1a1aa]">卖出信号</span>
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <CandlestickChart
            data={candlestickData}
            signals={tradeSignals}
            symbol="ETH/USDT"
            timeframe="D"
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#a1a1aa]">总回报率</span>
            <TrendingUp className="w-5 h-5 text-[#10b981]" />
          </div>
          <div className="text-3xl text-[#10b981] mb-1">+15.4%</div>
          <div className="text-sm text-[#a1a1aa]">净收益: +$1,540</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#a1a1aa]">最大回撤</span>
            <TrendingDown className="w-5 h-5 text-[#ef4444]" />
          </div>
          <div className="text-3xl text-[#ef4444] mb-1">-4.2%</div>
          <div className="text-sm text-[#a1a1aa]">最大损失: -$420</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#a1a1aa]">胜率</span>
            <Target className="w-5 h-5 text-[#2563eb]" />
          </div>
          <div className="text-3xl text-white mb-1">65%</div>
          <div className="text-sm text-[#a1a1aa]">13胜 / 20笔交易</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-[#27272a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors flex items-center gap-2">
          <Settings className="w-5 h-5" />
          优化策略
        </button>
        <button className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          去部署
        </button>
      </div>
    </div>
  );
}