import {
  ArrowRight,
  User,
  Cpu,
  FileText,
  BarChart3,
  PlayCircle,
  Activity,
  Code,
  Settings,
  Database,
} from "lucide-react";

export function PRDFlow() {
  return (
    <div className="h-full overflow-y-auto bg-black p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ChatGenTrade 产品流程图
          </h1>
          <p className="text-[#a1a1aa]">
            按时间顺序展示用户输入、系统处理、系统输出的完整交互流程
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex items-center gap-6 px-6 py-4 bg-[#0a0a0a] border border-[#27272a] rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#3b82f6] rounded"></div>
            <span className="text-sm text-[#a1a1aa]">
              用户输入
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#8b5cf6] rounded"></div>
            <span className="text-sm text-[#a1a1aa]">
              系统处理
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#10b981] rounded"></div>
            <span className="text-sm text-[#a1a1aa]">
              系统输出
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#f59e0b] rounded"></div>
            <span className="text-sm text-[#a1a1aa]">
              配置/设置
            </span>
          </div>
        </div>

        {/* Timeline Flow */}
        <div className="space-y-8">
          {/* ========== 阶段 0: 初始化 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-[#f59e0b] to-transparent mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 0: 系统初始化 & API配置
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击侧边栏"设置"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          选择交易所（Binance/OKX/Bybit）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>输入 API Key + Secret</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>选择实盘/模拟盘</span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>验证 API Key 有效性</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>测试交易所连接状态</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>加密存储 API 凭证</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>初始化交易引擎（CCXT）</span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示连接状态（成功/失败）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>保存配置到本地</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          API 列表更新（带状态指示器）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>启用策略创建功能</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 设置页面 ↔ 本地存储 ↔ CCXT引擎
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 阶段 1: 策略创建 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-[#3b82f6] to-transparent mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 1: 策略对话 & 代码生成
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"策略对话"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>输入策略需求（文本对话）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          示例："当恐慌贪婪指数&lt;30时买入BTC"
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          补充细节（止盈止损、资金管理）
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>AI解析策略需求</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>选择技术指标（Pandas-TA）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>生成Python策略代码（CCXT）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>实时更新策略蓝图</span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>左侧：AI对话历史（60%宽度）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          右侧：策略蓝图预览（40%宽度）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示买入/卖出条件</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示风险参数（止损/止盈）</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 策略对话页面 ↔ AI引擎 ↔
                    策略蓝图组件 ↔ 代码生成器
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 阶段 2: 回测验证 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-[#8b5cf6] to-transparent mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 2: 回测配置 & 性能验证
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"继续回测"按钮</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          选择回测时间范围（30天/90天/1年）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          设置初始资金（例如10,000 USDT）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"开始回测"</span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>从交易所获取历史K线数据</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>计算技术指标（ATR/RSI等）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>模拟执行买卖交易</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          计算收益、夏普比率、最大回撤
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>回测结果面板（总收益/胜率）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>权益曲线图表</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          关键指标卡片（夏普/最大回撤）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>成功则启用"部署策略"按钮</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 回测配置页面 ↔ CCXT历史数据 ↔
                    Pandas-TA指标计算 ↔ 回测引擎 ↔ 图表组件
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 阶段 3: 策略部署 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-[#10b981] to-transparent mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 3: 策略部署 & 启动执行
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"部署策略"按钮</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>选择交易所（已配置API）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>选择实盘/模拟盘模式</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          输入实际交易资金（例如1,000 USDT）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>确认风险参数，点击"启动"</span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>加载策略代码到执行引擎</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          连接交易所WebSocket（实时行情）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>初始化策略参数和资金池</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>启动策略监控线程</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>创建策略ID，保存到数据库</span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示部署成功提示</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>分配策略ID（例如 #001）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          状态标签显示"运行中"（绿色）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>自动跳转到策略仪表盘</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 部署页面 ↔ 策略执行引擎 ↔
                    CCXT交易接口 ↔ WebSocket行情 ↔ 数据库 ↔
                    策略仪表盘
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 阶段 4: 策略监控 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#06b6d4] to-[#0891b2] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-[#06b6d4] to-transparent mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 4: 策略仪表盘 & 实时监控
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"策略仪表盘"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>查看所有运行中的策略卡片</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          点击某个策略卡片（如策略 #001）
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>从数据库查询所有活跃策略</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          计算实时盈亏（当前价格 vs 持仓成本）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          更新策略状态（运行中/已停止）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          聚合交易统计（总收益/交易次数）
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          策略卡片网格（每个策略一张卡片）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示策略ID、名称、状态</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示实时盈亏（绿色/红色）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击卡片可进入策略详情</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 策略仪表盘 ↔ 数据库 ↔
                    实时行情数据 ↔ 盈亏计算引擎
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 阶段 5: 策略详情 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ec4899] to-[#db2777] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-[#ec4899] to-transparent mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 5: 策略详情视图
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>从仪表盘点击进入详情页</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>查看策略资金、持仓、盈亏</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>查看K线图和买卖信号标注</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          滚动查看策略执行Logs（分页）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"停止策略"或"编辑策略"</span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>查询策略详细配置和历史数据</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>获取K线数据并绘制图表</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          在K线上标注买卖点（绿色/红色）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          查询交易执行Logs（26条记录）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>实时更新持仓和盈亏</span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          顶部：策略资金卡片（总资金/可用/占用）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          中部：K线图 + 买卖信号（Recharts）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          底部：执行Logs表格（分页10条/页）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>操作按钮：停止/编辑/返回</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 策略详情页 ↔ 数据库 ↔ K线图组件
                    ↔ Logs表格组件 ↔ 实时行情
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 阶段 6: 策略编辑 ========== */}
          <div className="relative">
            <div className="flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  阶段 6: 策略编辑器视图
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* User Input */}
                  <div className="bg-[#0a0a0a] border-2 border-[#3b82f6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <h3 className="text-white font-semibold">
                        用户输入
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"策略编辑器"Tab切换</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>在AI对话区输入修改需求</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>查看代码编辑器中的策略代码</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>查看版本历史（v1/v2/v3）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>点击"保存修改"</span>
                      </div>
                    </div>
                  </div>

                  {/* System Processing */}
                  <div className="bg-[#0a0a0a] border-2 border-[#8b5cf6] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-[#8b5cf6]" />
                      <h3 className="text-white font-semibold">
                        系统处理
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>加载当前策略代码到编辑器</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>预加载7轮专业对话历史</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>AI解析修改需求并更新代码</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>创建新版本（v4）并保存</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>重新部署策略到执行引擎</span>
                      </div>
                    </div>
                  </div>

                  {/* System Output */}
                  <div className="bg-[#0a0a0a] border-2 border-[#10b981] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#10b981]" />
                      <h3 className="text-white font-semibold">
                        系统输出
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-[#a1a1aa]">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>中间：AI对话区（45%宽度）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          右侧：代码编辑器 + 版本列表（55%）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>显示Python代码（语法高亮）</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          版本历史卡片（时间戳 + 修改说明）
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>保存成功提示，返回详情视图</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                  <Database className="w-4 h-4" />
                  <span>
                    模块连接: 策略编辑器 ↔ AI引擎 ↔
                    代码编辑器组件 ↔ 版本管理系统 ↔
                    策略执行引擎
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-16 grid grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] border border-[#27272a] rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 text-lg">
              完整流程时间线
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#f59e0b] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  0
                </div>
                <div>
                  <div className="text-white font-medium">
                    系统初始化
                  </div>
                  <div className="text-[#71717a] text-xs">
                    配置交易所API → 验证连接 → 准备就绪
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#3b82f6] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="text-white font-medium">
                    策略创建
                  </div>
                  <div className="text-[#71717a] text-xs">
                    AI对话 → 生成代码 → 预览蓝图
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="text-white font-medium">
                    回测验证
                  </div>
                  <div className="text-[#71717a] text-xs">
                    历史数据回测 → 性能报告 → 风险评估
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="text-white font-medium">
                    策略部署
                  </div>
                  <div className="text-[#71717a] text-xs">
                    选择交易所 → 配置资金 → 启动执行
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#06b6d4] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="text-white font-medium">
                    实时监控
                  </div>
                  <div className="text-[#71717a] text-xs">
                    仪表盘展示 → 盈亏追踪 → 状态更新
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#ec4899] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <div className="text-white font-medium">
                    详情分析
                  </div>
                  <div className="text-[#71717a] text-xs">
                    K线图 + 交易信号 + 执行Logs
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#f97316] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <div className="text-white font-medium">
                    策略优化
                  </div>
                  <div className="text-[#71717a] text-xs">
                    编辑器 → AI辅助修改 → 版本管理
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#27272a] rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 text-lg">
              核心模块依赖关系
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-[#18181b] rounded-lg">
                <div className="text-white font-medium mb-1">
                  前端层
                </div>
                <div className="text-[#71717a] text-xs">
                  React + Tailwind + Recharts + Lucide Icons
                </div>
              </div>
              <div className="p-3 bg-[#18181b] rounded-lg">
                <div className="text-white font-medium mb-1">
                  AI引擎
                </div>
                <div className="text-[#71717a] text-xs">
                  策略对话解析 + 代码生成 + 策略优化建议
                </div>
              </div>
              <div className="p-3 bg-[#18181b] rounded-lg">
                <div className="text-white font-medium mb-1">
                  交易引擎
                </div>
                <div className="text-[#71717a] text-xs">
                  CCXT框架 + Pandas-TA指标 + WebSocket行情
                </div>
              </div>
              <div className="p-3 bg-[#18181b] rounded-lg">
                <div className="text-white font-medium mb-1">
                  数据层
                </div>
                <div className="text-[#71717a] text-xs">
                  策略配置 + 交易历史 + 版本管理 + API凭证
                </div>
              </div>
              <div className="p-3 bg-[#18181b] rounded-lg">
                <div className="text-white font-medium mb-1">
                  交易所接口
                </div>
                <div className="text-[#71717a] text-xs">
                  Binance/OKX/Bybit（实盘 + 模拟盘）
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}