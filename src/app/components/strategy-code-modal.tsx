import { useState } from "react";
import { X, Code2, Copy, Check } from "lucide-react";

const strategyCode = `import ccxt
import pandas as pd
import pandas_ta as ta
from datetime import datetime

# ==========================================================
# STRATEGY: Wyckoff Accumulation (Phase C - Spring)
# TYPE:     Pure Price Action / Smart Money Concepts
# FRAMEWORK: CCXT + Pandas-TA
# TIMEFRAME: 4H / 1D
# ==========================================================

class WyckoffSpringStrategy:
    """
    Wyckoff 吸筹模型 - Phase C (Spring) 自动化交易策略
    使用 CCXT 统一接口 + Pandas-TA 技术指标库
    """

    def __init__(self, exchange_id='binance', symbol='ETH/USDT', timeframe='4h'):
        self.exchange = getattr(ccxt, exchange_id)({
            'enableRateLimit': True,
            'options': {'defaultType': 'spot'}
        })
        self.symbol = symbol
        self.timeframe = timeframe
        self.lookback = 50
        self.volume_multiplier = 2.0
        self.spring_detected = False
        self.spring_low = None
        self.in_position = False

    def fetch_ohlcv(self, limit=200):
        """获取K线数据并转为 DataFrame"""
        ohlcv = self.exchange.fetch_ohlcv(
            self.symbol, self.timeframe, limit=limit
        )
        df = pd.DataFrame(
            ohlcv,
            columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
        )
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df.set_index('timestamp', inplace=True)
        return df

    # ----------------------------------------------------------
    # [Step 1] 定义交易区间 (The Trading Range)
    # ----------------------------------------------------------
    def detect_accumulation_range(self, df):
        """识别过去 N 根 K 线的盘整区间"""
        recent = df.tail(self.lookback)
        resistance = recent['high'].max()
        support = recent['low'].min()
        return {
            'resistance': resistance,
            'support': support,
            'range': resistance - support
        }

    # ----------------------------------------------------------
    # [Step 2] 识别 Phase C: 弹簧效应 (The Spring)
    # ----------------------------------------------------------
    def detect_spring(self, df, accumulation):
        """
        检测 Spring 信号:
        A. 最低价跌破支撑 (Liquidity Sweep)
        B. 收盘价收回支撑之上 (Rejection)
        C. 成交量 > 均量 * 2.0 (Climactic Action)
        """
        current = df.iloc[-1]
        support = accumulation['support']

        # A. 价格行为: 刺破支撑位
        is_sweep = current['low'] < support

        # B. 收盘收回区间内
        is_rejection = current['close'] > support

        # C. 量能行为: 恐慌抛售 (Selling Climax)
        avg_vol = df['volume'].tail(20).mean()
        is_climactic = current['volume'] > (avg_vol * self.volume_multiplier)

        if is_sweep and is_rejection and is_climactic:
            self.spring_detected = True
            self.spring_low = current['low']
            return True
        return False

    # ----------------------------------------------------------
    # [Step 3] 确认二次测试 (The Test) - 入场信号
    # ----------------------------------------------------------
    def confirm_test_entry(self, df, accumulation):
        """
        等待二次测试确认:
        - 回调至支撑位附近但不破 Spring 低点
        - 出现看涨吞没 (Bullish Engulfing) 或 Pinbar
        """
        if not self.spring_detected or self.in_position:
            return None

        current = df.iloc[-1]
        prev = df.iloc[-2]
        support = accumulation['support']

        # 价格回调至支撑附近
        near_support = abs(current['low'] - support) / support < 0.02

        # Higher Low: 不再创新低
        higher_low = current['low'] > self.spring_low

        # K线形态: 看涨吞没
        bullish_engulfing = (
            current['close'] > current['open'] and
            current['close'] > prev['close'] and
            current['open'] < prev['open']
        )

        # K线形态: Pinbar (长下影线)
        body = abs(current['close'] - current['open'])
        lower_wick = min(current['open'], current['close']) - current['low']
        upper_wick = current['high'] - max(current['open'], current['close'])
        pinbar = lower_wick > body * 2 and upper_wick < body * 0.5

        if near_support and higher_low and (bullish_engulfing or pinbar):
            return self._execute_entry(current, accumulation)

        return None

    # ----------------------------------------------------------
    # [Step 4] 执行与风控 (Execution & Risk Management)
    # ----------------------------------------------------------
    def _execute_entry(self, current, accumulation):
        """计算入场、止损、止盈并下单"""
        entry_price = current['close']

        # 止损: Spring 最低点下方 0.5%
        stop_loss = self.spring_low * 0.995

        # 止盈: 箱体上沿 (Resistance)
        take_profit = accumulation['resistance']

        # 盈亏比过滤: RR < 3.0 则放弃
        risk = entry_price - stop_loss
        reward = take_profit - entry_price
        if risk <= 0 or (reward / risk) < 3.0:
            return {'action': 'SKIP', 'reason': 'Poor R:R ratio'}

        # 通过 CCXT 下单
        order = self.exchange.create_order(
            symbol=self.symbol,
            type='limit',
            side='buy',
            amount=self._calculate_position_size(entry_price, stop_loss),
            price=entry_price,
            params={'stopLoss': stop_loss, 'takeProfit': take_profit}
        )

        self.in_position = True
        return {
            'action': 'BUY',
            'entry': entry_price,
            'stop_loss': stop_loss,
            'take_profit': take_profit,
            'rr_ratio': round(reward / risk, 2),
            'order_id': order['id']
        }

    def _calculate_position_size(self, entry, stop_loss, risk_pct=0.02):
        """Kelly 仓位管理: 单笔风险不超过总资金的 2%"""
        balance = self.exchange.fetch_balance()
        equity = balance['total']['USDT']
        risk_amount = equity * risk_pct
        position_size = risk_amount / (entry - stop_loss)
        return round(position_size, 6)

    # ----------------------------------------------------------
    # 主循环
    # ----------------------------------------------------------
    def run(self):
        """策略主循环"""
        df = self.fetch_ohlcv()
        accumulation = self.detect_accumulation_range(df)

        if not self.spring_detected:
            spring = self.detect_spring(df, accumulation)
            if spring:
                print(f"[SPRING] Detected at {df.index[-1]}")
        else:
            signal = self.confirm_test_entry(df, accumulation)
            if signal and signal['action'] == 'BUY':
                print(f"[ENTRY] {signal}")


# 启动策略
if __name__ == '__main__':
    strategy = WyckoffSpringStrategy(
        exchange_id='binance',
        symbol='ETH/USDT',
        timeframe='4h'
    )
    strategy.run()`;

interface StrategyCodeBadgeProps {
  strategyName?: string;
  fileName?: string;
}

export function StrategyCodeBadge({
  strategyName = "Wyckoff_Spring_Strategy",
  fileName = "Wyckoff_Spring_Strategy.py",
}: StrategyCodeBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(strategyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Compact Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between bg-[#0a0a0a] border border-[#1f1f23] hover:border-[#3b82f6]/50 rounded-xl px-4 py-3 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-[#10b981]" />
          <span className="text-white font-mono text-[13px] tracking-tight">
            {fileName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#71717a] group-hover:text-[#3b82f6] transition-colors">
            查看策略逻辑
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
            <span className="text-[#10b981] text-[11px] font-mono font-medium tracking-tight">
              Ready
            </span>
          </div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-[720px] max-h-[85vh] bg-[#0a0a0a] border border-[#1f1f23] rounded-2xl flex flex-col shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f23]">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-[#10b981]" />
                <div>
                  <h3 className="text-white font-mono text-[14px] tracking-tight">
                    {strategyName}
                  </h3>
                  <p className="text-[11px] text-[#71717a] font-mono mt-0.5">
                    CCXT + Pandas-TA | 4H / 1D | Pure Price Action
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-all text-[12px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#10b981]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-[#27272a] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-[#71717a] hover:text-white" />
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex">
                {/* Line Numbers */}
                <div className="bg-[#050505] border-r border-[#1f1f23] px-3 py-4 font-mono text-[11px] text-[#3f3f46] select-none flex-shrink-0">
                  {strategyCode.split("\n").map((_, i) => (
                    <div key={i} className="leading-5 text-right">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code */}
                <pre className="flex-1 px-4 py-4 overflow-x-auto">
                  <code className="text-[12px] font-mono leading-5 text-[#e5e7eb] whitespace-pre">
                    {strategyCode}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
