import { Send, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { StrategyCodeBadge } from "./strategy-code-modal";

interface StrategyChatProps {
  onNavigateToBacktest: () => void;
}

export function StrategyChat({ onNavigateToBacktest }: StrategyChatProps) {
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "user",
      content: "我要一个纯 K 线的威科夫（Wyckoff）吸筹策略，专门做 Phase C 的'弹簧 (Spring)'交易。不要任何 MACD 或 RSI 指标。",
    },
    {
      role: "assistant",
      content: "收到。目标锁定 Wyckoff Accumulation - Phase C (Spring)。\n\n首先我们需要定义'震荡区间 (Trading Range)'。我是以 最近 50 根 K 线的最高/最低点 作为自动识别边界，还是您有特定的结构定义？",
    },
    {
      role: "user",
      content: "自动识别最近的盘整区 (Consolidation)。\n\n核心触发条件：\n\n• 价格快速跌破区间下沿（Support），造成流动性掠夺。\n\n• 收盘价必须收回到区间内部（拒绝下跌）。\n\n• 此时成交量必须显著放大（恐慌抛售被吸收）。",
    },
    {
      role: "assistant",
      content: "明白了。这是标准的 '假跌破 + 巨量收回' (Shakeout) 模型。\n\n已构建逻辑：\n\n• Action: Sweep Liquidity below Support.\n\n• Close: Must close > Support Level.\n\n• Volume: Current Vol > Avg_Vol * 2.0 (Climactic Action).\n\n请确认入场时机：是收盘直接进，还是等'二次测试 (Test)'？",
    },
    {
      role: "user",
      content: "等二次测试。当价格回调测试支撑位不破，且形成'看涨吞没'或'Pinbar'时挂单进场。止损放在最低点下方。",
    },
    {
      role: "assistant",
      content: "逻辑已闭环。策略 Wyckoff_Spring_Algo_v1 已生成：\n\n• Phase A/B: 识别箱体。\n\n• Phase C: 捕捉带量假跌破 (Spring)。\n\n• Entry: 确认二次测试 (Test) + K线形态确认。\n\n点击上方策略文件可查阅完整 CCXT + Pandas-TA 代码。",
    },
  ]);

  const [hasStrategy] = useState(true);

  const handleSend = () => {
    if (!message.trim() || isThinking) return;

    const lowerMessage = message.toLowerCase();
    const isOptimizeRequest = lowerMessage.includes("优化代码") || lowerMessage.includes("更新代码");

    if (isOptimizeRequest) {
      const newMessages = [
        ...messages,
        { role: "user" as const, content: message },
      ];
      setMessages(newMessages);
      setMessage("");
      setIsThinking(true);

      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "我已经对策略代码进行了优化：\n\n✓ 增加了缓存机制，避免重复计算交易区间\n✓ 优化了成交量计算逻辑，使用滑动窗口提升性能\n✓ 添加了更严格的风险控制，最小盈亏比从2.0提升至3.0\n✓ 改进了K线形态识别算法，减少假信号\n\n代码优化已完成。",
          },
        ]);
      }, 2000);
    } else {
      const newMessages = [
        ...messages,
        { role: "user" as const, content: message },
      ];
      setMessages(newMessages);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/10"
                  : "bg-[#0a0a0a] text-white border border-[#1f1f23]"
              }`}
            >
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed tracking-tight">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                <span className="text-[13px] font-semibold text-white">U</span>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="max-w-2xl rounded-2xl px-4 py-3 bg-[#0a0a0a] text-white border border-[#1f1f23]">
              <p className="text-[14px] text-[#71717a] leading-relaxed tracking-tight">正在分析代码并进行优化...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area + Strategy Badge + Confirm Button */}
      <div className="border-t border-[#1f1f23] px-6 py-5 bg-black flex-shrink-0 space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="描述你想要的交易策略..."
            className="flex-1 bg-[#0a0a0a] text-white px-4 py-3 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] placeholder-[#71717a] text-[14px] tracking-tight transition-all duration-200"
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium"
          >
            <Send className="w-4 h-4" />
            发送
          </button>
        </div>

        {hasStrategy && (
          <div className="flex gap-3 items-end">
            <div className="w-[60%] min-w-0">
              <StrategyCodeBadge />
            </div>
            <button
              className="w-[40%] bg-[#10b981] hover:bg-[#059669] text-white py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 tracking-tight text-[14px]"
              onClick={onNavigateToBacktest}
            >
              确认策略并配置回测
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
