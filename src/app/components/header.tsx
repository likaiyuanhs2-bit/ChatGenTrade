import { ChevronRight, ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onBack?: () => void;
  showBackButton?: boolean;
}

export function Header({ title, breadcrumbs, onBack, showBackButton }: HeaderProps) {
  return (
    <div className="h-[73px] bg-black border-b border-[#1f1f23] px-6 flex items-center gap-4">
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#18181b] rounded-lg transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      )}
      
      <div className="flex flex-col justify-center flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-1.5">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#52525b]" />}
                <span className={`text-[13px] tracking-tight ${index === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-[#71717a]'}`}>
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-[24px] font-semibold text-white tracking-tight">{title}</h2>
      </div>
    </div>
  );
}