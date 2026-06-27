import type { Scenario } from "@/types/scenario.type";

interface ReviewPanelProps {
  scenario: Scenario;
}

export default function ReviewPanel({ scenario }: ReviewPanelProps) {
  if (!scenario) return null;

  return (
    <aside className="hidden lg:flex flex-col h-full w-80 bg-card border-l border-border p-6 gap-6 overflow-y-auto shrink-0">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Review Panel
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Key Objectives
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                check_circle
              </span>
              <span className="text-sm text-foreground">
                Subject line clarity
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                check_circle
              </span>
              <span className="text-sm text-foreground">
                Direct call to action
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-muted-foreground text-[20px]">
                radio_button_unchecked
              </span>
              <span className="text-sm text-muted-foreground">
                Value proposition check
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-muted-foreground text-[20px]">
                radio_button_unchecked
              </span>
              <span className="text-sm text-muted-foreground">
                Proofread attachment mention
              </span>
            </li>
          </ul>
        </div>
        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">
              Module Progress
            </span>
            <span className="text-xs font-medium text-primary">65%</span>
          </div>
          <div className="w-full bg-border h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            alt="Alex Rivera"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuATzUKM1t1LOJrjWmtC32_8orAq1lcVQVgwhHxBO7csVT-AgwJ8CTBOYqfRfLa8m8ou13xyFU71EWe3jEvquqwhMQh6FgkgB0Rn_OJVse5FMLnscGzIDPIEhO1-EDA2FAHqqaRag6ateTvr4XN5XBU-QTz7JcbgOXVeUfnhdpf-gdn9zrVVbJ0CY41mxXY8hmQmxkPnSAIS9yCdpqqPY65Oo79Re1GxilCWeUEje8NeIC_Rn_mUTYrCJKiwfO6MyyJ2EXnrZXT7_YAK"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{scenario.hrName}</p>
            <p className="text-sm text-muted-foreground">
              {scenario.hrProfession}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
