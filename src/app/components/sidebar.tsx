import { MessageSquare, LayoutDashboard, Settings } from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "chat", label: "策略对话", icon: MessageSquare, label_en: "Strategy Chat" },
    { id: "dashboard", label: "策略仪表盘", icon: LayoutDashboard, label_en: "Strategy Dashboard" },
    { id: "settings", label: "设置", icon: Settings, label_en: "Settings" },
  ];

  return (
    <div className="w-64 h-screen bg-black border-r border-[#1f1f23] flex flex-col">
      {/* Logo and App Name - Fusion Design */}
      <div className="h-[73px] px-6 border-b border-[#1f1f23] flex items-center">
        {/* App Name with Special Typography - Full Logo */}
        <div className="flex items-baseline">
          <span className="text-[22px] font-bold tracking-tight">
            <span className="text-[#3b82f6]">&lt;</span>
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#10b981] to-[#3b82f6] bg-clip-text text-transparent font-mono">
              ChatGen
            </span>
            <span className="text-[#10b981] font-mono">Trade</span>
            <span className="text-[#3b82f6]">/&gt;</span>
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#0a0a0a] text-white shadow-sm"
                  : "text-[#71717a] hover:bg-[#0a0a0a] hover:text-white"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-[#3b82f6]" : ""}`} />
              <span className="text-[17px] font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="px-3 py-4 border-t border-[#1f1f23]">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#0a0a0a] rounded-xl">
          <div className="w-9 h-9 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[13px] font-semibold text-white">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium text-white truncate tracking-tight">User_8792</div>
          </div>
        </div>
      </div>
    </div>
  );
}
