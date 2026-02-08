import { useState, useRef, useEffect } from "react";
import { Send, Code2, Sparkles, Loader2, CheckCircle2, Rocket, BarChart3, ExternalLink, AlertCircle } from "lucide-react";
import { SyntaxHighlighter } from "./syntax-highlighter";

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

interface Message {
  type: "ai" | "user";
  content: string;
  component?: "config" | "testing" | "testResult" | "deploying" | "success";
}

interface DeployConfig {
  exchange: string;
  market: string;
  pair: string;
  apiKey: string;
  apiSecret: string;
}

// 交易所API申请链接映射
const getApiKeyUrl = (exchange: string, market: string): string => {
  const urls: Record<string, Record<string, string>> = {
    Binance: {
      "现货": "https://testnet.binance.vision/",
      "永续合约": "https://testnet.binancefuture.com/",
      "交割合约": "https://testnet.binancefuture.com/",
      "全仓杠杆": "https://testnet.binance.vision/",
    },
    OKX: {
      "现货": "https://www.okx.com/demo-trading",
      "永续合约": "https://www.okx.com/demo-trading",
      "交割合约": "https://www.okx.com/demo-trading",
      "全仓杠杆": "https://www.okx.com/demo-trading",
    },
    Bybit: {
      "现货": "https://testnet.bybit.com/",
      "永续合约": "https://testnet.bybit.com/",
      "交割合约": "https://testnet.bybit.com/",
      "全仓杠杆": "https://testnet.bybit.com/",
    },
  };

  return urls[exchange]?.[market] || "https://testnet.binance.vision/";
};

interface DeployStrategyProps {
  onNavigateToDashboard?: () => void;
}

export function DeployStrategy({ onNavigateToDashboard }: DeployStrategyProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      content: "太棒了！回测结果显示您的策略表现优异。现在让我们将策略部署到模拟盘进行实盘运行。",
    },
    {
      type: "ai",
      content: "请配置模拟盘部署参数：",
      component: "config",
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [config, setConfig] = useState<DeployConfig>({
    exchange: "Binance",
    market: "现货",
    pair: "ETH/USDT",
    apiKey: "",
    apiSecret: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canDeploy = config.apiKey.trim() !== "" && config.apiSecret.trim() !== "";
  const apiKeyUrl = getApiKeyUrl(config.exchange, config.market);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 监听消息变化，自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDeploy = () => {
    // 添加测试消息
    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        content: "正在测试 API 连通性并验证策略代码...",
        component: "testing",
      },
    ]);

    // 3秒后显示测试结果
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.component !== "testing"),
        {
          type: "ai",
          content: "连通性测试成功",
          component: "testResult",
        },
      ]);
    }, 3000);
  };

  const handleStartStrategy = () => {
    // 添加部署消息
    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        content: "正在启动策略并连接到模拟盘...",
        component: "deploying",
      },
    ]);

    // 3秒后显示成功消息
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.component !== "deploying"),
        {
          type: "ai",
          content: "策略已成功部署并运行",
          component: "success",
        },
      ]);
    }, 3000);
  };

  const handleCustomDeploy = () => {
    // 第1轮：AI询问
    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        content: "好的！我注意到您想使用其他方式部署。请告诉我您想部署到哪个交易所？或者您有什么特殊需求？",
      },
    ]);

    // 第2轮：用户回复（延迟1秒）
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: "我想部署到 Gate.io 模拟盘",
        },
      ]);
    }, 1000);

    // 第3轮：AI确认并询问市场
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "明白了！您想部署到 Gate.io 模拟盘。这个交易所暂时不在系统的默认选项中，但我可以帮您适配。请问您想部署到哪个市场？（现货/永续合约）",
        },
      ]);
    }, 2500);

    // 第4轮：用户选择市场
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: "永续合约",
        },
      ]);
    }, 4000);

    // 第5轮：AI开始升级代码
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "好的！我正在为您升级代码，添加 Gate.io 交易所适配器...",
        },
      ]);
    }, 5000);

    // 第6轮：代码升级中（loading）
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "正在升级中...",
          component: "deploying",
        },
      ]);
    }, 6500);

    // 第7轮：升级完成
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.component !== "deploying"),
        {
          type: "ai",
          content: "✅ 代码升级完成！已成功添加 Gate.io 交易所支持，并配置了永续合约适配器。现在请提供您的交易对和模拟盘 API 凭证。",
        },
      ]);
    }, 9500);

    // 第8轮：用户提供交易对
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: "BTC/USDT",
        },
      ]);
    }, 10500);

    // 第9轮：AI请求API凭证 + 安全提示
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "好的，交易对已设置为 BTC/USDT。接下来请提供您的 Gate.io 模拟盘 API Key 和 API Secret。",
        },
        {
          type: "ai",
          content: "🔒 安全提示：您的 API Key 和 Secret 仅保存于策略脚本的 .env 配置文件中，采用 AES-256 加密存储，不会被上传或泄露到任何第三方服务器。请确保使用模拟盘 API，切勿使用实盘密钥。",
        },
      ]);
    }, 11500);

    // 第10轮：用户提供API Key
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: "gateio_test_api_key_xxxxxxxxxxxxxxxxxxxxxx",
        },
      ]);
    }, 13500);

    // 第11轮：AI确认收到并请求Secret
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "✓ 收到 API Key。请继续提供 API Secret。",
        },
      ]);
    }, 14500);

    // 第12轮：用户提供API Secret
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: "gateio_test_secret_yyyyyyyyyyyyyyyyyyyyyyyy",
        },
      ]);
    }, 15500);

    // 第13轮：开始连通性测试
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "✓ 收到 API Secret。正在测试 Gate.io API 连通性并验证策略代码...",
          component: "testing",
        },
      ]);
    }, 16500);

    // 第14轮：测试成功（标准格式）
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.component !== "testing"),
        {
          type: "ai",
          content: "连通性测试成功",
          component: "testResult",
        },
      ]);
      // 更新config以显示Gate.io信息
      setConfig({
        exchange: "Gate.io",
        market: "永续合约",
        pair: "BTC/USDT",
        apiKey: "gateio_test_api_key",
        apiSecret: "gateio_test_secret",
      });
    }, 20000);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userInput,
      },
    ]);

    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex bg-black">
      {/* 中间对话区域 60% */}
      <div className="w-[60%] flex flex-col border-r border-[#1f1f23]">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.type === "ai" ? (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0">
                    {message.component === "testing" || message.component === "deploying" ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : message.component === "testResult" || message.component === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-2xl px-5 py-4">
                      <p className="text-white text-[14px] leading-relaxed mb-4">{message.content}</p>

                      {/* 配置表单组件 */}
                      {message.component === "config" && (
                        <div className="space-y-4 mt-4">
                          {/* 交易所选择 */}
                          <div>
                            <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">
                              交易所模拟盘
                            </label>
                            <select
                              value={config.exchange}
                              onChange={(e) => setConfig({ ...config, exchange: e.target.value })}
                              className="w-full bg-black text-white px-4 py-3 rounded-xl border border-[#27272a] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all"
                            >
                              <option>Binance</option>
                              <option>OKX</option>
                              <option>Bybit</option>
                              <option>Coinbase</option>
                              <option>Kraken</option>
                            </select>
                          </div>

                          {/* 市场类型选择 */}
                          <div>
                            <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">
                              模拟盘市场
                            </label>
                            <select
                              value={config.market}
                              onChange={(e) => setConfig({ ...config, market: e.target.value })}
                              className="w-full bg-black text-white px-4 py-3 rounded-xl border border-[#27272a] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all"
                            >
                              <option>现货</option>
                              <option>永续合约</option>
                              <option>交割合约</option>
                              <option>全仓杠杆</option>
                            </select>
                          </div>

                          {/* 交易对选择 */}
                          <div>
                            <label className="block text-[13px] text-[#71717a] mb-2 tracking-tight">
                              交易对
                            </label>
                            <select
                              value={config.pair}
                              onChange={(e) => setConfig({ ...config, pair: e.target.value })}
                              className="w-full bg-black text-white px-4 py-3 rounded-xl border border-[#27272a] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all"
                            >
                              <option>ETH/USDT</option>
                              <option>BTC/USDT</option>
                              <option>SOL/USDT</option>
                              <option>BNB/USDT</option>
                              <option>XRP/USDT</option>
                              <option>ADA/USDT</option>
                            </select>
                          </div>

                          {/* API Key 输入 */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-[13px] text-[#71717a] tracking-tight">
                                API Key
                              </label>
                              <a
                                href={apiKeyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-[#3b82f6] hover:text-[#2563eb] transition-colors flex items-center gap-1"
                              >
                                跳转至官网申请API
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <input
                              type="password"
                              value={config.apiKey}
                              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                              placeholder="输入模拟盘 API Key"
                              className="w-full bg-black text-white px-4 py-3 rounded-xl border border-[#27272a] focus:outline-none focus:border-[#3b82f6] placeholder-[#52525b] text-[14px] transition-all"
                            />
                          </div>

                          {/* API Secret 输入 */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-[13px] text-[#71717a] tracking-tight">
                                API Secret
                              </label>
                              <a
                                href={apiKeyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-[#3b82f6] hover:text-[#2563eb] transition-colors flex items-center gap-1"
                              >
                                跳转至官网申请API
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <input
                              type="password"
                              value={config.apiSecret}
                              onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                              placeholder="输入模拟盘 API Secret"
                              className="w-full bg-black text-white px-4 py-3 rounded-xl border border-[#27272a] focus:outline-none focus:border-[#3b82f6] placeholder-[#52525b] text-[14px] transition-all"
                            />
                          </div>

                          {/* 安全提示 */}
                          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-3 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0 mt-0.5" />
                            <p className="text-[12px] text-[#ef4444]/90 leading-relaxed">
                              请确保使用<strong>模拟盘 API</strong>，切勿使用实盘 API 密钥
                            </p>
                          </div>

                          {/* 确认部署按钮 */}
                          <button
                            onClick={handleDeploy}
                            disabled={!canDeploy}
                            className={`w-full py-3.5 rounded-xl text-[15px] font-medium transition-all flex items-center justify-center gap-2.5 ${
                              canDeploy
                                ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-lg hover:shadow-blue-500/20 text-white"
                                : "bg-[#18181b] text-[#52525b] cursor-not-allowed"
                            }`}
                          >
                            <Rocket className="w-5 h-5" />
                            确认部署
                          </button>

                          {/* 其他方式部署按钮 */}
                          <button
                            onClick={handleCustomDeploy}
                            className="w-full py-3 rounded-xl text-[14px] font-medium bg-transparent border border-[#27272a] hover:border-[#3b82f6] text-[#a1a1aa] hover:text-white transition-all"
                          >
                            我想通过其他方式部署模拟盘
                          </button>
                        </div>
                      )}

                      {/* 测试结果组件 */}
                      {message.component === "testResult" && (
                        <div className="space-y-4 mt-4">
                          <div className="bg-black rounded-lg p-4 font-mono text-[12px] space-y-1">
                            <div className="text-[#10b981]">✓ API 连接成功</div>
                            <div className="text-[#71717a]">  Exchange: {config.exchange} Testnet</div>
                            <div className="text-[#71717a]">  Market: {config.market}</div>
                            <div className="text-[#71717a]">  Symbol: {config.pair}</div>
                            <div className="text-[#71717a]">  Balance: 10000.00 USDT (模拟)</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ CCXT 框架初始化成功</div>
                            <div className="text-[#71717a]">  Version: ccxt v4.2.7</div>
                            <div className="text-[#71717a]">  Rate Limit: 1200ms</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ Pandas-TA 技术指标库加载</div>
                            <div className="text-[#71717a]">  Version: pandas-ta v0.3.14b</div>
                            <div className="text-[#71717a]">  Indicators: 130+ available</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ 策略代码语法验证通过</div>
                            <div className="text-[#71717a]">  Strategy: Wyckoff_Spring_Strategy</div>
                            <div className="text-[#71717a]">  Functions: 4 defined</div>
                            <div className="text-[#71717a]">  No syntax errors detected</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ 小额挂撤单测试</div>
                            <div className="text-[#71717a]">  订单类型: LIMIT_BUY</div>
                            <div className="text-[#71717a]">  数量: 0.001 {config.pair.split('/')[0]}</div>
                            <div className="text-[#71717a]">  价格: $2,750.00 (当前价-3%)</div>
                            <div className="text-[#71717a]">  订单ID: #TEST_85721943</div>
                            <div className="text-[#10b981] mt-1">  状态: 已下单 → 已撤销 ✓</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ 小额挂单成交测试</div>
                            <div className="text-[#71717a]">  订单类型: LIMIT_BUY</div>
                            <div className="text-[#71717a]">  数量: 0.001 {config.pair.split('/')[0]}</div>
                            <div className="text-[#71717a]">  价格: $2,848.00 (市价+0.1%)</div>
                            <div className="text-[#71717a]">  订单ID: #TEST_85721988</div>
                            <div className="text-[#10b981] mt-1">  状态: 已下单 → 已成交 ✓</div>
                            <div className="text-[#71717a] mt-1">  成交均价: $2,847.95</div>
                            <div className="text-[#71717a]">  手续费: 0.00000285 {config.pair.split('/')[0]} (Maker)</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#3b82f6]">⚡ 系统就绪，等待启动指令</div>
                          </div>

                          <p className="text-[#a1a1aa] text-[13px] leading-relaxed">
                            所有系统检查已通过，策略已准备好在模拟盘运行。是否立即启动交易策略？
                          </p>

                          <button
                            onClick={handleStartStrategy}
                            className="w-full py-3.5 rounded-xl text-[15px] font-medium bg-gradient-to-r from-[#10b981] to-[#059669] hover:shadow-lg hover:shadow-green-500/20 text-white transition-all flex items-center justify-center gap-2.5"
                          >
                            <Rocket className="w-5 h-5" />
                            启动交易策略
                          </button>
                        </div>
                      )}

                      {/* 部署成功组件 */}
                      {message.component === "success" && (
                        <div className="space-y-4 mt-4">
                          <div className="bg-black rounded-lg p-4 font-mono text-[12px] space-y-1">
                            <div className="text-[#10b981]">✓ 策略进程启动成功</div>
                            <div className="text-[#71717a]">  Process ID: 18472</div>
                            <div className="text-[#71717a]">  Status: Running</div>
                            <div className="text-[#71717a]">  Started: {new Date().toLocaleString("zh-CN")}</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ WebSocket 实时数据流已建立</div>
                            <div className="text-[#71717a]">  {config.exchange} WSS Connected</div>
                            <div className="text-[#71717a]">  Stream: {config.pair}@kline_4h</div>
                            <div className="text-[#71717a]">  Latency: 28ms</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ 历史数据加载完成</div>
                            <div className="text-[#71717a]">  Timeframe: 4H</div>
                            <div className="text-[#71717a]">  Bars loaded: 500 candles</div>
                            <div className="text-[#71717a]">  Data range: 83 days</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#10b981]">✓ 技术指标计算引擎运行中</div>
                            <div className="text-[#71717a]">  Pandas-TA initialized</div>
                            <div className="text-[#71717a]">  Indicators: Volume Profile, SR Levels</div>
                            <div className="text-white mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            <div className="text-[#3b82f6]">⚡ 策略监控中，等待交易信号...</div>
                            <div className="text-[#71717a]">  Current Price: $2,847.32</div>
                            <div className="text-[#71717a]">  Position: None (waiting for Spring signal)</div>
                          </div>

                          <div className="bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/30 rounded-xl p-4">
                            <p className="text-[#10b981] text-[14px] leading-relaxed">
                              🎉 恭喜！您的策略已成功接入 {config.exchange} {config.market}模拟盘，正在实时监控{" "}
                              {config.pair} 交易对，等待符合条件的交易信号。
                            </p>
                          </div>

                          <button
                            onClick={() => (onNavigateToDashboard ? onNavigateToDashboard() : (window.location.href = "#dashboard"))}
                            className="w-full py-3.5 rounded-xl text-[15px] font-medium bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:shadow-lg hover:shadow-blue-500/20 text-white transition-all flex items-center justify-center gap-2.5"
                          >
                            <BarChart3 className="w-5 h-5" />
                            前往仪表盘，查看您的交易策略
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#2563eb] rounded-2xl px-5 py-3 max-w-[80%]">
                    <p className="text-white text-[14px] leading-relaxed">{message.content}</p>
                  </div>
                  <div className="w-8 h-8 bg-[#27272a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[12px] font-medium">U</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <div className="border-t border-[#1f1f23] p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-[#0a0a0a] border border-[#27272a] rounded-xl focus-within:border-[#3b82f6] transition-colors">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="输入消息..."
                rows={1}
                className="w-full bg-transparent text-white px-4 py-3 resize-none focus:outline-none placeholder-[#52525b] text-[14px]"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim()}
              className={`p-3 rounded-xl transition-all ${
                userInput.trim()
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  : "bg-[#18181b] text-[#52525b] cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 右侧策略代码 40% */}
      <div className="w-[40%] flex flex-col bg-black">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* File Header */}
          <div className="mb-4 bg-[#0a0a0a] border border-[#1f1f23] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-white font-mono text-[13px] tracking-tight">
                  Wyckoff_Spring_Strategy.py
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    messages.some((m) => m.component === "success") ? "bg-[#10b981]" : "bg-[#3b82f6]"
                  }`}
                ></div>
                <span
                  className={`text-[11px] font-mono font-medium tracking-tight ${
                    messages.some((m) => m.component === "success") ? "text-[#10b981]" : "text-[#3b82f6]"
                  }`}
                >
                  {messages.some((m) => m.component === "success") ? "Running" : "Ready"}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-[#71717a] font-mono space-y-0.5">
              <div>Type: Pure Price Action / Smart Money</div>
              <div>Timeframe: 4H / 1D</div>
              {messages.some((m) => m.component === "success") && (
                <div className="text-[#10b981] mt-1">
                  ● Live on {config.exchange} {config.market} - {config.pair}
                </div>
              )}
            </div>
          </div>

          {/* 代码编辑器 */}
          <SyntaxHighlighter language="python" code={strategyCode} />
        </div>
      </div>
    </div>
  );
}