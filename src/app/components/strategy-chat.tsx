import { Send, Sparkles, TrendingUp, Activity, Shield, Code2, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { SyntaxHighlighter } from "./syntax-highlighter";

interface LogicModule {
  id: string;
  type: string;
  icon: "trend" | "trigger" | "risk";
  title: string;
  content: string;
  status: "active" | "inactive";
}

interface Signal {
  id: string;
  icon: string;
  condition: string;
  status: "pending" | "active" | "inactive";
}

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
      content: "逻辑已闭环。策略 Wyckoff_Spring_Algo_v1 已生成：\n\n• Phase A/B: 识别箱体。\n\n• Phase C: 捕捉带量假跌破 (Spring)。\n\n• Entry: 确认二次测试 (Test) + K线形态确认。\n\n完整脚本代码已生成在右侧，请查阅。",
    },
  ]);
  
  const [strategyBluePrint, setStrategyBluePrint] = useState<{
    title: string;
    modules: LogicModule[];
    simulation: string;
    hasStrategy: boolean;
  }>({
    title: "Draft: Wyckoff_Spring_Algo_v1",
    modules: [
      {
        id: "1",
        type: "时间限制",
        icon: "trend",
        title: "Time Constraint",
        content: "10:00-11:00 (NY Time)",
        status: "active",
      },
      {
        id: "2",
        type: "信号触发",
        icon: "trigger",
        title: "Liquidity Sweep + Displacement",
        content: "Detect Sweep Liquidity + Displacement (High Energy Bar)",
        status: "active",
      },
      {
        id: "3",
        type: "风控管理",
        icon: "risk",
        title: "Dynamic Risk",
        content: "Dynamic SL Calculation, Min Reward/Risk = 2.0",
        status: "active",
      },
      {
        id: "4",
        type: "退出策略",
        icon: "risk",
        title: "Exit Strategy",
        content: "Target Opposing Liquidity Pool",
        status: "active",
      },
      {
        id: "5",
        type: "过滤器",
        icon: "risk",
        title: "News Filter",
        content: "Filter Red Folder News",
        status: "active",
      },
    ],
    simulation: "推演：若当前 ETH 在 10:00-11:00 (NY Time) 出现流动性掠夺 (Liquidity Sweep) 后的反转模型，策略将开空，止损设为摆动高点上方，盈亏比至少 1:2。",
    hasStrategy: true,
  });

  const handleSend = () => {
    if (!message.trim() || isThinking) return;

    // 检测关键词
    const lowerMessage = message.toLowerCase();
    const isOptimizeRequest = lowerMessage.includes("优化代码") || lowerMessage.includes("更新代码");

    if (isOptimizeRequest) {
      // 添加用户消息
      const newMessages = [
        ...messages,
        { role: "user" as const, content: message },
      ];
      setMessages(newMessages);
      setMessage("");
      setIsThinking(true);

      // 模拟AI思考过程 (2秒)
      setTimeout(() => {
        setIsThinking(false);
        
        // 添加AI回复
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "我已经对策略代码进行了优化：\n\n✓ 增加了缓存机制，避免重复计算交易区间\n✓ 优化了成交量计算逻辑，使用滑动窗口提升性能\n✓ 添加了更严格的风险控制，最小盈亏比从2.0提升至3.0\n✓ 改进了K线形态识别算法，减少假信号\n\n代码优化已完成。",
          },
        ]);
      }, 2000);
    } else {
      // 普通消息处理
      const newMessages = [
        ...messages,
        { role: "user" as const, content: message },
      ];

      setMessages(newMessages);
      setMessage("");
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel: Chat Interface (60%) */}
      <div className="w-[60%] flex flex-col border-r border-[#1f1f23]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
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
                className={`max-w-lg rounded-2xl px-4 py-3 ${
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
          
          {/* 思考状态 */}
          {isThinking && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="max-w-lg rounded-2xl px-4 py-3 bg-[#0a0a0a] text-white border border-[#1f1f23]">
                <p className="text-[14px] text-[#71717a] leading-relaxed tracking-tight">正在分析代码并进行优化...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1f1f23] px-6 py-5 bg-black">
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
        </div>
      </div>

      {/* Right Panel: Quant IDE Blueprint (40%) */}
      <div className="w-[40%] flex flex-col bg-black">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* File Header */}
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

          {/* Full Script View with Line Numbers */}
          <div className="bg-[#0d1117] border border-[#1f1f23] rounded-xl overflow-hidden">
            <div className="flex">
              {/* Line Numbers */}
              <div className="bg-[#0a0a0a] border-r border-[#1f1f23] px-3 py-4 font-mono text-[10px] text-[#5c6370] select-none">
                {Array.from({ length: 55 }, (_, i) => (
                  <div key={i} className="leading-5 text-right">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Content */}
              <div className="flex-1 px-4 py-4 overflow-x-auto font-mono text-[11px] leading-5">
                {/* Header Comment Block */}
                <div className="text-[#5c6370]"># ==========================================================</div>
                <div className="text-[#5c6370]"># STRATEGY: Wyckoff Accumulation (Phase C - Spring)</div>
                <div className="text-[#5c6370]"># TYPE:     Pure Price Action / Smart Money Concepts</div>
                <div className="text-[#5c6370]"># TIMEFRAME: 4H / 1D</div>
                <div className="text-[#5c6370]"># ==========================================================</div>
                <div className="h-3"></div>

                {/* Class Definition */}
                <div>
                  <span className="text-[#c678dd]">class</span>
                  <span className="text-[#e5c07b]"> Wyckoff_Spring_Strategy</span>
                  <span className="text-[#abb2bf]">:</span>
                </div>
                <div className="h-3"></div>

                {/* Main Method */}
                <div className="ml-4">
                  <span className="text-[#c678dd]">def</span>
                  <span className="text-[#61afef]"> on_market_update</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#e06c75]">candles</span>
                  <span className="text-[#abb2bf]">):</span>
                </div>
                <div className="h-3"></div>

                {/* Step 1 */}
                <div className="ml-8 text-[#5c6370]"># [Step 1] 定义交易区间 (The Trading Range)</div>
                <div className="ml-8 text-[#5c6370]"># ------------------------------------------------------</div>
                <div className="ml-8 text-[#5c6370]"># 识别过去 50 根 K 线的最高价(Resistance)和最低价(Support)</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">highest_high</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#61afef]">max</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">candles</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">high</span>
                  <span className="text-[#abb2bf]">[</span>
                  <span className="text-[#56b6c2]">-</span>
                  <span className="text-[#d19a66]">50</span>
                  <span className="text-[#abb2bf]">:])</span>
                </div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">lowest_low</span>
                  <span className="text-[#56b6c2]">   = </span>
                  <span className="text-[#61afef]">min</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">candles</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">low</span>
                  <span className="text-[#abb2bf]">[</span>
                  <span className="text-[#56b6c2]">-</span>
                  <span className="text-[#d19a66]">50</span>
                  <span className="text-[#abb2bf]">:])</span>
                </div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">trading_range_height</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">highest_high</span>
                  <span className="text-[#56b6c2]"> - </span>
                  <span className="text-[#e06c75]">lowest_low</span>
                </div>
                <div className="h-3"></div>

                {/* Step 2 */}
                <div className="ml-8 text-[#5c6370]"># [Step 2] 识别 Phase C: 弹簧效应 (The Spring)</div>
                <div className="ml-8 text-[#5c6370]"># ------------------------------------------------------</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">current</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">candles</span>
                  <span className="text-[#abb2bf]">[</span>
                  <span className="text-[#56b6c2]">-</span>
                  <span className="text-[#d19a66]">1</span>
                  <span className="text-[#abb2bf]">]</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8 text-[#5c6370]"># A. 价格行为：刺破支撑位 (Liquidity Sweep)</div>
                <div className="ml-8 text-[#5c6370]"># 最低价跌破了支撑，但收盘价收回了支撑之上</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">is_sweep</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">current</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">low</span>
                  <span className="text-[#56b6c2]"> &lt; </span>
                  <span className="text-[#e06c75]">lowest_low</span>
                  <span className="text-[#abb2bf]">)</span>
                  <span className="text-[#c678dd]"> and </span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">current</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">close</span>
                  <span className="text-[#56b6c2]"> &gt; </span>
                  <span className="text-[#e06c75]">lowest_low</span>
                  <span className="text-[#abb2bf]">)</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8 text-[#5c6370]"># B. 量能行为：恐慌抛售 (Selling Climax)</div>
                <div className="ml-8 text-[#5c6370]"># 成交量必须是过去 20 根均量的 2 倍以上，证明有主力承接</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">avg_vol</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#61afef]">average</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">candles</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">volume</span>
                  <span className="text-[#abb2bf]">[</span>
                  <span className="text-[#56b6c2]">-</span>
                  <span className="text-[#d19a66]">20</span>
                  <span className="text-[#abb2bf]">:])</span>
                </div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">is_climactic</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">current</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">volume</span>
                  <span className="text-[#56b6c2]"> &gt; </span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">avg_vol</span>
                  <span className="text-[#56b6c2]"> * </span>
                  <span className="text-[#d19a66]">2.0</span>
                  <span className="text-[#abb2bf]">)</span>
                </div>
                <div className="h-3"></div>

                {/* Step 3 */}
                <div className="ml-8 text-[#5c6370]"># [Step 3] 确认二次测试 (The Test) - 入场信号</div>
                <div className="ml-8 text-[#5c6370]"># ------------------------------------------------------</div>
                <div className="ml-8 text-[#5c6370]"># 检查是否处于"Spring"发生后的 1-3 根 K 线内</div>
                <div className="ml-8">
                  <span className="text-[#c678dd]">if</span>
                  <span className="text-[#e06c75]"> self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#61afef]">spring_detected_recently</span>
                  <span className="text-[#abb2bf]">()</span>
                  <span className="text-[#c678dd]"> and not </span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">in_position</span>
                  <span className="text-[#abb2bf]">:</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-12 text-[#5c6370]"># 必须出现明确的看涨信号 (Bullish Engulfing or Pinbar)</div>
                <div className="ml-12 text-[#5c6370]"># 且低点不再创新低 (Higher Low)</div>
                <div className="ml-12">
                  <span className="text-[#e06c75]">is_bullish_pattern</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e5c07b]">Pattern</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#61afef]">recognize</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">current</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#98c379]">"BULL_ENGULFING"</span>
                  <span className="text-[#abb2bf]">)</span>
                </div>
                <div className="ml-12">
                  <span className="text-[#e06c75]">is_successful_test</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">current</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">low</span>
                  <span className="text-[#56b6c2]"> &gt; </span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">spring_low</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-12">
                  <span className="text-[#c678dd]">if</span>
                  <span className="text-[#e06c75]"> is_bullish_pattern</span>
                  <span className="text-[#c678dd]"> and </span>
                  <span className="text-[#e06c75]">is_successful_test</span>
                  <span className="text-[#abb2bf]">:</span>
                </div>
                <div className="ml-16">
                  <span className="text-[#c678dd]">return</span>
                  <span className="text-[#e06c75]"> self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#61afef]">execute_entry</span>
                  <span className="text-[#abb2bf]">()</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8">
                  <span className="text-[#c678dd]">return</span>
                  <span className="text-[#c678dd]"> None</span>
                </div>
                <div className="h-3"></div>

                {/* Step 4 */}
                <div className="ml-4">
                  <span className="text-[#c678dd]">def</span>
                  <span className="text-[#61afef]"> execute_entry</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">):</span>
                </div>
                <div className="ml-8 text-[#5c6370]"># [Step 4] 执行与风控 (Execution & Risk)</div>
                <div className="ml-8 text-[#5c6370]"># ------------------------------------------------------</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">entry_price</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">current_price</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8 text-[#5c6370]"># 止损：放在 Spring 最低点下方 0.5% (防止狩猎)</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">stop_loss</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">spring_low</span>
                  <span className="text-[#56b6c2]"> * </span>
                  <span className="text-[#d19a66]">0.995</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8 text-[#5c6370]"># 止盈：目标为箱体上沿 (Resistance)</div>
                <div className="ml-8">
                  <span className="text-[#e06c75]">take_profit</span>
                  <span className="text-[#56b6c2]"> = </span>
                  <span className="text-[#e06c75]">self</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#e06c75]">trading_range_high</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8 text-[#5c6370]"># 盈亏比过滤：如果 RR &lt; 3.0 则放弃交易</div>
                <div className="ml-8">
                  <span className="text-[#c678dd]">if</span>
                  <span className="text-[#61afef]"> risk_reward_ratio</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">entry_price</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#e06c75]">stop_loss</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#e06c75]">take_profit</span>
                  <span className="text-[#abb2bf]">)</span>
                  <span className="text-[#56b6c2]"> &lt; </span>
                  <span className="text-[#d19a66]">3.0</span>
                  <span className="text-[#abb2bf]">:</span>
                </div>
                <div className="ml-12">
                  <span className="text-[#c678dd]">return</span>
                  <span className="text-[#98c379]"> "SIGNAL_IGNORED_POOR_RR"</span>
                </div>
                <div className="h-3"></div>

                <div className="ml-8">
                  <span className="text-[#c678dd]">return</span>
                  <span className="text-[#e5c07b]"> Order</span>
                  <span className="text-[#abb2bf]">.</span>
                  <span className="text-[#61afef]">Limit</span>
                  <span className="text-[#abb2bf]">(</span>
                  <span className="text-[#e06c75]">dir</span>
                  <span className="text-[#56b6c2]">=</span>
                  <span className="text-[#98c379]">"BUY"</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#e06c75]">price</span>
                  <span className="text-[#56b6c2]">=</span>
                  <span className="text-[#e06c75]">entry_price</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#e06c75]">sl</span>
                  <span className="text-[#56b6c2]">=</span>
                  <span className="text-[#e06c75]">stop_loss</span>
                  <span className="text-[#abb2bf]">, </span>
                  <span className="text-[#e06c75]">tp</span>
                  <span className="text-[#56b6c2]">=</span>
                  <span className="text-[#e06c75]">take_profit</span>
                  <span className="text-[#abb2bf]">)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        {strategyBluePrint.hasStrategy && (
          <div className="border-t border-[#1f1f23] px-6 py-5 bg-black">
            <button
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white px-5 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 tracking-tight"
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