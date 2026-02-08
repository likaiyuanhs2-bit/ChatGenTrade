import { useState } from "react";
import { Plus, Trash2, AlertTriangle, ExternalLink, X } from "lucide-react";

interface ApiConnection {
  id: string;
  exchange: string;
  name: string;
  lastTrade: string;
  bgColor: string;
  textColor: string;
}

// API Key 获取链接映射
const getApiKeyUrl = (exchange: string, accountType: string): string => {
  const urls: Record<string, Record<string, string>> = {
    Binance: {
      "Spot 模拟盘": "https://testnet.binance.vision/",
      "Future 模拟盘": "https://testnet.binancefuture.com/",
    },
    OKX: {
      "Spot 模拟盘": "https://www.okx.com/demo-trading",
      "Future 模拟盘": "https://www.okx.com/demo-trading",
    },
    Bybit: {
      "Spot 模拟盘": "https://testnet.bybit.com/",
      "Future 模拟盘": "https://testnet.bybit.com/",
    },
    Coinbase: {
      "Spot 模拟盘": "https://public.sandbox.pro.coinbase.com/",
      "Future 模拟盘": "https://public.sandbox.pro.coinbase.com/",
    },
    Kraken: {
      "Spot 模拟盘": "https://demo-futures.kraken.com/",
      "Future 模拟盘": "https://demo-futures.kraken.com/",
    },
  };

  return urls[exchange]?.[accountType] || "#";
};

export function Settings() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const connections: ApiConnection[] = [
    {
      id: "1",
      exchange: "Binance",
      name: "Spot 模拟盘",
      lastTrade: "2分钟前",
      bgColor: "#F0B90B",
      textColor: "#000000",
    },
    {
      id: "2",
      exchange: "OKX",
      name: "Future 模拟盘",
      lastTrade: "5分钟前",
      bgColor: "#000000",
      textColor: "#FFFFFF",
    },
    {
      id: "3",
      exchange: "Bybit",
      name: "Spot 模拟盘",
      lastTrade: "15分钟前",
      bgColor: "#F7A600",
      textColor: "#000000",
    },
  ];

  const showApiKeyLink = selectedExchange && selectedAccountType && 
                         selectedExchange !== "选择交易所" && 
                         selectedAccountType !== "选择账户类型";

  const apiKeyUrl = showApiKeyLink 
    ? getApiKeyUrl(selectedExchange, selectedAccountType)
    : "#";

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-4xl">
        {/* Security Warning - Top Priority */}
        <div className="mb-8 bg-[#ef4444]/10 border-2 border-[#ef4444] rounded-lg p-6 flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-[#ef4444] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl text-[#ef4444] mb-2 font-semibold">安全警告</h3>
            <p className="text-[#ef4444]">
              <strong>仅支持模拟盘 API 密钥导入，请勿导入实盘 API</strong>
            </p>
            <p className="text-[#ef4444]/80 text-sm mt-2">
              所有交易仅在模拟环境中执行，使用实盘 API 可能导致真实资金损失。
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl text-white mb-2">交易所 API 管理</h2>
          <p className="text-[#a1a1aa]">管理你的交易所模拟盘 API 密钥以连接并执行自动化交易策略</p>
        </div>

        {/* Add New Account Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-4 rounded-lg transition-all mb-6 flex items-center justify-center gap-3 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[15px] font-medium">添加模拟盘账户</span>
        </button>

        {/* Existing Connections */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27272a]">
            <h3 className="text-lg text-white">已连接的交易所</h3>
          </div>

          <div className="divide-y divide-[#27272a]">
            {connections.map((connection) => (
              <div key={connection.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#27272a]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
                    style={{ 
                      backgroundColor: connection.bgColor,
                      color: connection.textColor 
                    }}
                  >
                    {connection.exchange === "Binance" && (
                      <svg viewBox="0 0 126.61 126.61" className="w-8 h-8">
                        <path fill="currentColor" d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.42 38.9l14.31 14.3zm-14.3 10.12L10.11 49.01 0 59.12l10.11 10.11 14.32-14.32zm14.3 10.12l24.59 24.58 24.6-24.6 14.31 14.29-38.9 38.9-38.91-38.88 14.31-14.31zm48.9-10.12l14.31 14.32L112.5 63.32l-10.11-10.11-14.32 14.32z"/>
                        <path fill="currentColor" d="M77.83 63.32L63.32 48.8 52.59 59.53l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.48z"/>
                      </svg>
                    )}
                    {connection.exchange === "OKX" && (
                      <span className="text-2xl font-black">OKX</span>
                    )}
                    {connection.exchange === "Bybit" && (
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 2.2l8 4v8.8c0 4.4-3 8.5-8 9.8-5-1.3-8-5.4-8-9.8V8.2l8-4z"/>
                        <circle cx="12" cy="12" r="5"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{connection.exchange}</div>
                    <div className="text-sm text-[#a1a1aa]">{connection.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-[#a1a1aa]">
                      最近交易发生于 <span className="text-white">{connection.lastTrade}</span>
                    </div>
                  </div>

                  <button className="p-2 rounded-lg bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#27272a] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl text-white font-semibold">添加模拟盘账户</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#a1a1aa]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">交易所</label>
                <select 
                  className="w-full bg-black text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb] transition-colors"
                  value={selectedExchange}
                  onChange={(e) => setSelectedExchange(e.target.value)}
                >
                  <option>选择交易所</option>
                  <option>Binance</option>
                  <option>OKX</option>
                  <option>Bybit</option>
                  <option>Coinbase</option>
                  <option>Kraken</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">账户类型</label>
                <select 
                  className="w-full bg-black text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb] transition-colors"
                  value={selectedAccountType}
                  onChange={(e) => setSelectedAccountType(e.target.value)}
                >
                  <option>选择账户类型</option>
                  <option>Spot 模拟盘</option>
                  <option>Future 模拟盘</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-[#a1a1aa]">API Key</label>
                  {showApiKeyLink && (
                    <a
                      href={apiKeyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1"
                    >
                      跳转至官网申请API
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="输入模拟盘 API Key"
                  className="w-full bg-black text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb] placeholder-[#a1a1aa] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-[#a1a1aa]">API Secret</label>
                  {showApiKeyLink && (
                    <a
                      href={apiKeyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1"
                    >
                      跳转至官网申请API
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="输入模拟盘 API Secret"
                  className="w-full bg-black text-white px-4 py-3 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#2563eb] placeholder-[#a1a1aa] transition-colors"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-[#27272a] px-6 py-4 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white px-6 py-3 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  // 添加逻辑
                  setShowAddModal(false);
                }}
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加连接
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}