export const FeaturedScenario: React.FC = () => {
  return (
    <div className="md:col-span-2 relative rounded-2xl overflow-hidden min-h-[300px] border border-gray-300 hover:shadow-lg transition-all h-full hover:-translate-y-1 group">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="Professional collaboration"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiUnmkIirrnMIaLrp8vl9k23PRXQ-E0YSPQAG_FOBS500e9SsKytuYDYcn1FWB00jVwdc9fsuxTFsJ92-r3RnFvmHzVXsg1xkCeokDXkFqLJkgPtbPVlxajjCdTlSb3ZOsqN0GtwH_F-_QOjc-WMrCn4L02JI_3RAxMD0XlJ_SiNEVu9mAp2Jl7rU6CoQQwVWFeWLzoTvCtD7qiTHp1FISWb7AgPYrlN-jq7evACLIwlNJU-HKwlhVa8vN4UoSeUm94J7vcpsANlTb"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          New: AI Salary Negotiation
        </h2>
        <p className="text-white/80 text-base max-w-lg mb-4">
          Our latest advanced scenario helps you navigate difficult financial
          conversations using AI-backed sentiment analysis.
        </p>
        <button className="w-fit px-8 py-3 bg-secondary text-secondary-foreground rounded-2xl font-bold active:scale-95 transition-all">
          Start Scenario
        </button>
      </div>
    </div>
  );
};
