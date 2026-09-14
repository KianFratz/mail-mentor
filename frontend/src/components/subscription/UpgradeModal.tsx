import { Check, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Unlock Pro Features",
  description = "Take your email communication skills to the next level with unlimited AI coaching and feedback.",
  feature,
}: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    navigate("/pricing");
  };

  const proFeatures = [
    "Unlimited AI Conversation Replies",
    "Unlimited Daily Feedback & Grading",
    "Unlock All Scenario Levels (Intermediate & Advanced)",
    "Unlimited Conversation History Access",
    "Data Export (JSON, CSV, PDF)",
    "Priority AI Response Generation",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-violet-100 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-6 pt-8 pb-10 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3">
            Pro Plan Upgrade
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
          <p className="text-sm text-violet-100/90 leading-relaxed">
            {feature
              ? `The "${feature}" feature requires a Pro subscription.`
              : description}
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Everything included in Pro:
            </h4>
            <ul className="space-y-2.5">
              {proFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              onClick={handleUpgradeClick}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-base font-semibold shadow-lg shadow-violet-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Upgrade to Pro — ₱449/mo
            </Button>
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 text-center font-medium"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
