import { useState } from "react";

export const AIPopover: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-tertiary/20 transform translate-y-0 opacity-100 transition-all z-50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container shrink-0">
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-accent mb-1">
            AI Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">
            Based on your progress, the{" "}
            <strong className="text-primary">
              'Follow up after a meeting'
            </strong>{" "}
            scenario is perfect for your current learning path.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsVisible(false)}
              className="text-accent font-bold text-xs hover:underline"
            >
              Dismiss
            </button>
            <button className="px-4 py-1.5 bg-accent text-accent-foreground rounded-lg text-xs font-bold">
              Try Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
