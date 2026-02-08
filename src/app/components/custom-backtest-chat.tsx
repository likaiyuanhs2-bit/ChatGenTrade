import { useState, useRef, useEffect } from "react";
import { Send, Upload, BarChart3, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Activity, Clock, Target, Rocket } from "lucide-react";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  type?: "text" | "file-upload" | "analysis" | "cleaning" | "backtest-confirm" | "backtest-result";
  fileInfo?: {
    name: string;
    size: string;
    rows: number;
  };
  analysisResult?: {
    columns: string[];
    dataType: string;
    timeRange: string;
    issues: string[];
  };
  cleaningSteps?: string[];
  backtestResult?: {
    // 整体绩效
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    maxDrawdownDuration: string;
    volatility: number;
    
    // 交易统计
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    avgHoldingPeriod: string;
    
    // 时间分析
    backtestPeriod: string;
    startDate: string;
    endDate: string;
    tradingDays: number;
    
    // 风险指标
    calmarRatio: number;
    recoveryFactor: number;
    
    // 详细交易
    trades: Array<{
      entryDate: string;
      exitDate: string;
      type: "多头" | "空头";
      entryPrice: number;
      exitPrice: number;
      quantity: number;
      pnl: number;
      pnlPercent: number;
      holdingDays: number;
      reason: string;
    }>;
  };
}

export function CustomBacktestChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "您好！我是您的回测助手。请告诉我您想要上传什么类型的回测数据？\n\n我可以帮您处理：\n• 交易所K线数据（CSV/JSON）\n• 自定义价格数据\n• 历史交易记录\n• Tick级别数据\n\n请描述您的数据类型，或直接上传文件让我分析。",
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConfirmBacktest = () => {
    setIsProcessing(true);
    
    // 用户确认消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "确认回测",
      type: "text",
    };
    setMessages((prev) => [...prev, userMessage]);

    // 模拟回测执行
    setTimeout(() => {
      const backtestMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 WYCKOFF SPRING 策略回测报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【回测概况】
策略名称：Wyckoff Accumulation - Spring Setup
回测周期：2024-01-01 至 2024-12-31 (365天)
初始资金：$10,000 USD
标的资产：BTC/USD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 核心绩效指标
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

总收益率                +34.67%
年化收益率              +36.89%
最大回撤                -8.34%
回撤持续时间            18天

夏普比率                1.94
索提诺比率              2.78
卡玛比率                4.42
收益波动率              18.92%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 交易统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

总交易次数              23 笔
盈利交易                16 笔  ✓
亏损交易                7 笔   ✗
胜率                    69.57%

盈亏比                  3.12
平均盈利                +4.82%
平均亏损                -2.35%
最大单笔盈利            +12.50%
最大单笔亏损            -4.39%

平均持仓周期            4.3 天
恢复系数                5.18

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 详细交易记录
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#01 | 多头 | 2024-01-15 → 2024-01-19 (4天)
     入场: $42,350.50  出场: $43,890.20
     收益: +$769.85 (+3.64%)
     原因: Spring形态确认，量价配合良好

#02 | 多头 | 2024-02-05 → 2024-02-12 (7天)
     入场: $43,120.00  出场: $44,850.75
     收益: +$865.38 (+4.01%)
     原因: 二次测试成功，吞没形态

#03 | 多头 | 2024-03-08 → 2024-03-11 (3天)
     入场: $45,200.25  出场: $43,890.50
     收益: -$654.88 (-2.90%)
     原因: 假突破，止损离场

#04 | 多头 | 2024-04-18 → 2024-04-25 (7天)
     入场: $44,670.80  出场: $49,230.45
     收益: +$2,279.83 (+10.21%)
     原因: 完美Spring设置，强势上涨

#05 | 多头 | 2024-05-12 → 2024-05-16 (4天)
     入场: $48,890.30  出场: $50,450.60
     收益: +$780.15 (+3.19%)
     原因: 区间震荡后突破

#06 | 多头 | 2024-06-03 → 2024-06-05 (2天)
     入场: $51,200.00  出场: $48,950.20
     收益: -$1,124.90 (-4.39%)
     原因: 市场转向，快速止损

#07 | 多头 | 2024-07-08 → 2024-07-15 (7天)
     入场: $50,120.50  出场: $53,670.25
     收益: +$1,774.88 (+7.08%)
     原因: 支撑位测试成功，强劲反弹

#08 | 多头 | 2024-08-22 → 2024-08-26 (4天)
     入场: $52,890.75  出场: $54,230.80
     收益: +$670.03 (+2.53%)
     原因: 小幅盈利出局

#09 | 多头 | 2024-09-10 → 2024-09-14 (4天)
     入场: $53,450.20  出场: $51,780.90
     收益: -$834.65 (-3.12%)
     原因: 趋势逆转，触发止损

#10 | 多头 | 2024-10-05 → 2024-10-12 (7天)
     入场: $54,120.00  出场: $60,890.50
     收益: +$3,385.25 (+12.50%) ⭐
     原因: 最佳交易，春天陷阱完美触发

#11 | 多头 | 2024-11-18 → 2024-11-23 (5天)
     入场: $59,870.30  出场: $62,150.75
     收益: +$1,140.23 (+3.81%)
     原因: 持续上涨，目标位出场

#12 | 多头 | 2024-12-08 → 2024-12-15 (7天)
     入场: $61,230.00  出场: $63,780.45
     收益: +$1,275.23 (+4.16%)
     原因: 年末行情，顺利盈利

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 月度收益分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q1  |  +5.2%   | Jan ▲ Feb ▲ Mar ▼
Q2  |  +9.4%   | Apr ▲▲ May ▲ Jun ▼
Q3  |  +6.8%   | Jul ▲▲ Aug ▲ Sep ▼
Q4  |  +13.3%  | Oct ▲▲▲ Nov ▲ Dec ▲

最佳月份: 10月 (+12.5%)
最差月份: 6月 (-4.4%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 策略评估结论
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【优势】
✓ 高胜率 (69.57%) 表明策略识别能力强
✓ 优秀的盈亏比 (3.12) 体现良好的风险管理
✓ 夏普比率 1.94 > 1.5，风险调整后收益优秀
✓ 最大回撤控制在 -8.34%，远低于市场平均
✓ 年化收益 36.89% 显著跑赢市场基准

【风险提示】
⚠ 策略依赖明确的吸筹区间识别
⚠ 在趋势市场中可能出现假信号
⚠ 需要严格执行止损（平均 -2.35%）
⚠ 最佳持仓周期为 4-7 天

【实盘建议】
→ 严格筛选 Spring 信号，确保量价配合
→ 在入场前确认支撑位二次测试成功
→ 设置 2-3% 的固定止损位
→ 目标位设在吸筹区间上沿（阻力位）
→ 避免在高波动市场环境中使用
→ 建议单次仓位不超过总资金的 20%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

回测完成时间: ${new Date().toLocaleString('zh-CN')}
数据质量评分: ⭐⭐⭐⭐⭐ (99.54%)

免责声明: 历史回测结果不代表未来表现，实盘交易需谨慎评估风险。`,
        type: "text",
      };

      setMessages((prev) => [...prev, backtestMessage]);
      setIsProcessing(false);
    }, 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    // 模拟文件上传
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `我上传了一个文件：${file.name}`,
      type: "file-upload",
      fileInfo: {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        rows: 5000,
      },
    };

    setMessages((prev) => [...prev, userMessage]);

    // 模拟AI分析
    setTimeout(() => {
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "正在分析您的数据文件...",
        type: "analysis",
        analysisResult: {
          columns: ["timestamp", "open", "high", "low", "close", "volume"],
          dataType: "OHLCV K线数据",
          timeRange: "2024-01-01 至 2024-12-31",
          issues: [
            "发现23个缺失值",
            "检测到5个异常价格波动点",
            "时间戳存在不规则间隔",
          ],
        },
      };

      setMessages((prev) => [...prev, analysisMessage]);

      // 模拟数据清洗
      setTimeout(() => {
        const cleaningMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "ai",
          content: "数据分析完成！我发现了一些问题，正在进行数据清洗...",
          type: "cleaning",
          cleaningSteps: [
            "✓ 填补缺失值（使用前向填充方法）",
            "✓ 移除异常价格波动点（超过5个标准差）",
            "✓ 规范化时间戳为1小时间隔",
            "✓ 转换数据格式为策略兼容格式",
            "✓ 验证数据完整性",
          ],
        };

        setMessages((prev) => [...prev, cleaningMessage]);

        // 询问是否执行回测
        setTimeout(() => {
          const confirmMessage: Message = {
            id: (Date.now() + 3).toString(),
            role: "ai",
            content:
              "数据已清洗完成！\n\n清洗后数据统计：\n• 总数据点：4,977个\n• 时间跨度：365天\n• 数据完整性：99.54%\n\n是否使用清洗后的数据执行 Wyckoff Spring 策略回测？",
            type: "backtest-confirm",
          };

          setMessages((prev) => [...prev, confirmMessage]);
          setIsProcessing(false);
        }, 1500);
      }, 2000);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // 普通回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "好的，您可以点击下方的上传按钮，或者继续告诉我更多关于您数据的信息。",
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const renderMessage = (message: Message) => {
    if (message.role === "user") {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="max-w-[80%] bg-[#3b82f6] text-white px-5 py-3 rounded-2xl rounded-tr-sm">
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
            {message.fileInfo && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center gap-2 text-[13px]">
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">{message.fileInfo.name}</span>
                </div>
                <div className="text-[12px] text-white/70 mt-1">
                  {message.fileInfo.size} • {message.fileInfo.rows.toLocaleString()} 行数据
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // AI消息
    return (
      <div key={message.id} className="flex justify-start mb-4">
        <div className="max-w-[85%]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-[13px] font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-[#18181b] text-white px-5 py-3 rounded-2xl rounded-tl-sm border border-[#27272a]">
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {/* 数据分析结果 */}
                {message.analysisResult && (
                  <div className="mt-4 pt-4 border-t border-[#27272a]">
                    <div className="space-y-3">
                      <div>
                        <div className="text-[12px] text-[#71717a] mb-1">数据类型</div>
                        <div className="text-[13px] text-[#10b981] font-medium">
                          {message.analysisResult.dataType}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[#71717a] mb-1">列名</div>
                        <div className="flex flex-wrap gap-2">
                          {message.analysisResult.columns.map((col, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[#27272a] text-[#a1a1aa] text-[12px] rounded-lg"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[#71717a] mb-1">时间范围</div>
                        <div className="text-[13px]">{message.analysisResult.timeRange}</div>
                      </div>
                      {message.analysisResult.issues.length > 0 && (
                        <div>
                          <div className="text-[12px] text-[#ef4444] mb-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            发现的问题
                          </div>
                          <div className="space-y-1">
                            {message.analysisResult.issues.map((issue, idx) => (
                              <div key={idx} className="text-[13px] text-[#fbbf24] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#fbbf24]" />
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 数据清洗步骤 */}
                {message.cleaningSteps && (
                  <div className="mt-4 pt-4 border-t border-[#27272a]">
                    <div className="text-[12px] text-[#71717a] mb-3">清洗步骤</div>
                    <div className="space-y-2">
                      {message.cleaningSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-[#10b981]">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 回测确认按钮 */}
                {message.type === "backtest-confirm" && (
                  <div className="mt-4 pt-4 border-t border-[#27272a]">
                    <button
                      onClick={handleConfirmBacktest}
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>确认回测</span>
                    </button>
                  </div>
                )}

                {/* 回测结果 */}
                {message.backtestResult && (
                  <div className="mt-4 pt-4 border-t border-[#27272a]">
                    {/* 策略名称和时间 */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[16px] font-semibold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-[#10b981]" />
                          Wyckoff Spring 策略回测报告
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-[#71717a]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {message.backtestResult.backtestPeriod}
                        </div>
                        <div>•</div>
                        <div>{message.backtestResult.tradingDays} 交易日</div>
                      </div>
                    </div>

                    {/* 核心绩效指标 */}
                    <div className="mb-6">
                      <div className="text-[13px] font-semibold text-[#a1a1aa] mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        核心绩效指标
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">总收益率</div>
                          <div className="text-[22px] font-bold text-[#10b981] flex items-center gap-1">
                            <TrendingUp className="w-5 h-5" />
                            {message.backtestResult.totalReturn}%
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">年化收益率</div>
                          <div className="text-[22px] font-bold text-[#10b981]">
                            {message.backtestResult.annualizedReturn}%
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">最大回撤</div>
                          <div className="text-[22px] font-bold text-[#ef4444] flex items-center gap-1">
                            <TrendingDown className="w-5 h-5" />
                            {message.backtestResult.maxDrawdown}%
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">夏普比率</div>
                          <div className="text-[22px] font-bold text-white">
                            {message.backtestResult.sharpeRatio}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 交易统计 */}
                    <div className="mb-6">
                      <div className="text-[13px] font-semibold text-[#a1a1aa] mb-3">交易统计</div>
                      <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f23] space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">总交易次数</span>
                          <span className="text-[14px] text-white font-semibold">
                            {message.backtestResult.totalTrades} 笔
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">盈利交易</span>
                          <span className="text-[14px] text-[#10b981] font-semibold">
                            {message.backtestResult.winningTrades} 笔 ({message.backtestResult.winRate}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">亏损交易</span>
                          <span className="text-[14px] text-[#ef4444] font-semibold">
                            {message.backtestResult.losingTrades} 笔
                          </span>
                        </div>
                        <div className="h-px bg-[#27272a] my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">盈亏比</span>
                          <span className="text-[14px] text-white font-semibold">
                            {message.backtestResult.profitFactor}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">平均盈利</span>
                          <span className="text-[14px] text-[#10b981] font-semibold">
                            +{message.backtestResult.avgWin}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">平均亏损</span>
                          <span className="text-[14px] text-[#ef4444] font-semibold">
                            {message.backtestResult.avgLoss}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#71717a]">平均持仓时间</span>
                          <span className="text-[14px] text-white font-semibold">
                            {message.backtestResult.avgHoldingPeriod}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 风险指标 */}
                    <div className="mb-6">
                      <div className="text-[13px] font-semibold text-[#a1a1aa] mb-3">风险指标</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">波动率</div>
                          <div className="text-[16px] font-semibold text-white">
                            {message.backtestResult.volatility}%
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">Calmar比率</div>
                          <div className="text-[16px] font-semibold text-white">
                            {message.backtestResult.calmarRatio}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#1f1f23]">
                          <div className="text-[11px] text-[#71717a] mb-1">Sortino比率</div>
                          <div className="text-[16px] font-semibold text-white">
                            {message.backtestResult.sortinoRatio}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 详细交易记录 */}
                    <div>
                      <div className="text-[13px] font-semibold text-[#a1a1aa] mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        详细交易记录 (共 {message.backtestResult.trades.length} 笔)
                      </div>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#27272a] scrollbar-track-transparent pr-2">
                        {message.backtestResult.trades.map((trade, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f23] hover:border-[#3b82f6] transition-all"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-[#71717a]">
                                  交易 #{idx + 1}
                                </span>
                                <span
                                  className={`text-[12px] font-medium px-2 py-0.5 rounded-lg ${
                                    trade.type === "多头"
                                      ? "bg-[#10b981]/10 text-[#10b981]"
                                      : "bg-[#ef4444]/10 text-[#ef4444]"
                                  }`}
                                >
                                  {trade.type}
                                </span>
                              </div>
                              <div
                                className={`text-[16px] font-bold ${
                                  trade.pnl > 0 ? "text-[#10b981]" : "text-[#ef4444]"
                                }`}
                              >
                                {trade.pnl > 0 ? "+" : ""}
                                {trade.pnlPercent.toFixed(2)}%
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] mb-3">
                              <div>
                                <span className="text-[#71717a]">入场日期：</span>
                                <span className="text-[#a1a1aa] ml-1">{trade.entryDate}</span>
                              </div>
                              <div>
                                <span className="text-[#71717a]">出场日期：</span>
                                <span className="text-[#a1a1aa] ml-1">{trade.exitDate}</span>
                              </div>
                              <div>
                                <span className="text-[#71717a]">入场价格：</span>
                                <span className="text-white ml-1 font-mono">
                                  ${trade.entryPrice.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-[#71717a]">出场价格：</span>
                                <span className="text-white ml-1 font-mono">
                                  ${trade.exitPrice.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-[#71717a]">持仓周期：</span>
                                <span className="text-[#a1a1aa] ml-1">{trade.holdingDays} 天</span>
                              </div>
                              <div>
                                <span className="text-[#71717a]">盈亏金额：</span>
                                <span
                                  className={`ml-1 font-mono font-semibold ${
                                    trade.pnl > 0 ? "text-[#10b981]" : "text-[#ef4444]"
                                  }`}
                                >
                                  {trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#27272a]">
                              <div className="text-[11px] text-[#71717a] mb-1">交易原因</div>
                              <div className="text-[12px] text-[#a1a1aa] leading-relaxed">
                                {trade.reason}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 结论 */}
                    <div className="mt-6 pt-6 border-t border-[#27272a]">
                      <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[13px] font-semibold text-[#10b981] mb-1">
                              回测结论
                            </div>
                            <div className="text-[12px] text-[#a1a1aa] leading-relaxed">
                              Wyckoff Spring 策略在2024年全年表现优异，总收益率达到 34.67%，年化收益率 36.89%。
                              策略胜率高达 69.57%，盈亏比 3.12，夏普比率 1.94，表明风险调整后的收益表现出色。
                              最大回撤控制在 -8.34%，风险管理良好。建议在实盘中严格执行止损策略，保持耐心等待高质量的 Spring 信号。
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] flex-shrink-0 bg-black">
        <div>
          <h2 className="text-[17px] font-semibold text-white tracking-tight">自定义回测对话</h2>
          <p className="text-[13px] text-[#71717a] mt-1">上传您的数据，AI将帮您分析、清洗并执行回测</p>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#27272a] scrollbar-track-transparent">
        {messages.map(renderMessage)}
        {isProcessing && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-[13px] font-semibold">AI</span>
              </div>
              <div className="bg-[#18181b] px-5 py-3 rounded-2xl rounded-tl-sm border border-[#27272a]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-[13px] text-[#71717a]">思考中...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-[#27272a] p-4 flex-shrink-0 bg-black">
        <div className="flex items-end gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-4 py-3 bg-[#18181b] hover:bg-[#27272a] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          >
            <Upload className="w-5 h-5" />
            <span className="text-[14px] font-medium">上传文件</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex-1 relative min-w-0">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="输入您的消息... (Shift+Enter 换行)"
              disabled={isProcessing}
              className="w-full bg-[#0a0a0a] text-white px-4 py-3 pr-12 rounded-xl border border-[#1f1f23] focus:outline-none focus:border-[#3b82f6] text-[14px] transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="px-5 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}