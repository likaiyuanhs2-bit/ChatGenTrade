import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface TradeLog {
  id: string;
  timestamp: string;
  type: "BUY" | "SELL";
  price: number;
  amount: number;
  total: number;
  pnl?: number;
  pnlPercent?: number;
  fee: number;
}

// 模拟交易记录数据
const generateTradeLogs = (): TradeLog[] => {
  const logs: TradeLog[] = [];
  let price = 2500;
  
  for (let i = 0; i < 48; i++) {
    const isBuy = i % 2 === 0;
    const date = new Date("2024-01-01");
    date.setHours(date.getHours() + i * 12);
    
    const tradePrice = price + (Math.random() - 0.5) * 100;
    const amount = 0.5 + Math.random() * 2;
    const total = tradePrice * amount;
    const fee = total * 0.001;
    
    const log: TradeLog = {
      id: `trade_${i + 1}`,
      timestamp: date.toISOString(),
      type: isBuy ? "BUY" : "SELL",
      price: parseFloat(tradePrice.toFixed(2)),
      amount: parseFloat(amount.toFixed(4)),
      total: parseFloat(total.toFixed(2)),
      fee: parseFloat(fee.toFixed(2)),
    };
    
    // 如果是卖出，计算盈亏
    if (!isBuy && i > 0) {
      const prevBuy = logs[i - 1];
      const pnl = total - prevBuy.total - fee - prevBuy.fee;
      const pnlPercent = (pnl / prevBuy.total) * 100;
      log.pnl = parseFloat(pnl.toFixed(2));
      log.pnlPercent = parseFloat(pnlPercent.toFixed(2));
    }
    
    logs.push(log);
    price = tradePrice;
  }
  
  return logs;
};

const tradeLogs = generateTradeLogs();

export function TradeLogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const totalPages = Math.ceil(tradeLogs.length / logsPerPage);
  
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const currentLogs = tradeLogs.slice(startIndex, endIndex);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  
  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1f1f23]">
        <h3 className="text-[15px] font-semibold text-white tracking-tight">交易记录</h3>
        <p className="text-[13px] text-[#71717a] mt-0.5">共 {tradeLogs.length} 笔交易</p>
      </div>
      
      {/* Table - 定高450px */}
      <div className="h-[450px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#0a0a0a] z-10">
            <tr className="border-b border-[#1f1f23]">
              <th className="px-6 py-3 text-left text-[13px] font-medium text-[#71717a] tracking-tight">时间</th>
              <th className="px-6 py-3 text-left text-[13px] font-medium text-[#71717a] tracking-tight">类型</th>
              <th className="px-6 py-3 text-right text-[13px] font-medium text-[#71717a] tracking-tight">价格</th>
              <th className="px-6 py-3 text-right text-[13px] font-medium text-[#71717a] tracking-tight">数量</th>
              <th className="px-6 py-3 text-right text-[13px] font-medium text-[#71717a] tracking-tight">总额</th>
              <th className="px-6 py-3 text-right text-[13px] font-medium text-[#71717a] tracking-tight">手续费</th>
              <th className="px-6 py-3 text-right text-[13px] font-medium text-[#71717a] tracking-tight">盈亏</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr key={log.id} className="border-b border-[#1f1f23] hover:bg-[#18181b] transition-colors">
                <td className="px-6 py-3.5 text-[13px] text-[#a1a1aa] font-mono">{formatTimestamp(log.timestamp)}</td>
                <td className="px-6 py-3.5">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                    log.type === "BUY" 
                      ? "bg-[#10b981]/10 text-[#10b981]" 
                      : "bg-[#ef4444]/10 text-[#ef4444]"
                  }`}>
                    {log.type === "BUY" ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[13px] font-medium">{log.type}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-right text-[13px] text-white font-mono">${log.price.toLocaleString()}</td>
                <td className="px-6 py-3.5 text-right text-[13px] text-[#a1a1aa] font-mono">{log.amount}</td>
                <td className="px-6 py-3.5 text-right text-[13px] text-white font-mono">${log.total.toLocaleString()}</td>
                <td className="px-6 py-3.5 text-right text-[13px] text-[#71717a] font-mono">${log.fee.toFixed(2)}</td>
                <td className="px-6 py-3.5 text-right text-[13px] font-mono">
                  {log.pnl !== undefined ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className={log.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>
                        {log.pnl >= 0 ? "+" : ""}${log.pnl.toFixed(2)}
                      </span>
                      <span className={`text-[11px] ${log.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                        ({log.pnlPercent! >= 0 ? "+" : ""}{log.pnlPercent}%)
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#52525b]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#1f1f23] flex items-center justify-between">
        <div className="text-[13px] text-[#71717a]">
          显示 {startIndex + 1}-{Math.min(endIndex, tradeLogs.length)} 条，共 {tradeLogs.length} 条
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 1
                ? "text-[#52525b] cursor-not-allowed"
                : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-[13px] font-medium transition-all ${
                  currentPage === page
                    ? "bg-[#3b82f6] text-white"
                    : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? "text-[#52525b] cursor-not-allowed"
                : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
