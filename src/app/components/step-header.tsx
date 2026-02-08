import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface StepHeaderProps {
  steps: Step[];
  onStepClick: (stepId: string) => void;
}

export function StepHeader({ steps, onStepClick }: StepHeaderProps) {
  return (
    <div className="h-[73px] bg-black border-b border-[#1f1f23]">
      <div className="h-full px-6 flex items-center">
        {steps.map((step, index) => {
          const isActive = step.status === "current";
          const isCompleted = step.status === "completed";
          const isClickable = isActive || isCompleted;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step Button */}
              <button
                onClick={() => {
                  if (isClickable) {
                    onStepClick(step.id);
                  }
                }}
                disabled={!isClickable}
                className={`
                  relative px-5 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#0a0a0a] text-white"
                      : isCompleted
                      ? "text-white hover:bg-[#0a0a0a]/50"
                      : "text-[#52525b] cursor-not-allowed"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Completed Checkmark (only show for completed) */}
                  {isCompleted && (
                    <div className="w-7 h-7 rounded-full bg-[#10b981] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Label */}
                  <div className="flex flex-col items-start">
                    <span className={`font-medium tracking-tight ${isCompleted ? 'text-[13px]' : 'text-[15px]'}`}>
                      Step {index + 1}
                    </span>
                    <span className="text-[15px] font-medium tracking-tight">
                      {step.label}
                    </span>
                  </div>
                </div>
                
                {/* Active Bottom Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#3b82f6] rounded-full"></div>
                )}
              </button>

              {/* Connector Line (only between steps, not after the last one) */}
              {index < steps.length - 1 && (
                <div className="flex items-center px-3">
                  <div
                    className={`
                      h-0.5 w-12 transition-all duration-200
                      ${
                        isCompleted
                          ? "bg-[#10b981]"
                          : "bg-[#27272a]"
                      }
                    `}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}