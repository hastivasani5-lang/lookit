import React from "react";

type OverviewCard = {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg?: string;
};

type OverviewCardsProps = {
  overviewCards: OverviewCard[];
};

export default function OverviewCards({ overviewCards }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {overviewCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col items-center rounded-3xl bg-white p-8 shadow-sm border border-[#eef5f3]"
          >
            <div className={`mb-4 flex items-center justify-center h-14 w-14 rounded-xl ${card.iconBg}`}>
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-600 text-center">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}
