"use client";

const Marquee = () => {
  const items = [
    "EXAM TODAY ✱",
    "LEARNING INNOVATION ✱",
    "WORLDWIDE LEARNERS ✱",
    "UNIQUE KNOWLEDGE ✱",
  ];

  return (
    <div className="w-full bg-[#1ec28e] overflow-hidden py-6">
      <div className="flex whitespace-nowrap animate-marquee gap-10 text-white font-semibold text-lg">
        {items.map((item, index) => (
          <span key={`primary-${index}`}>{item}</span>
        ))}

        <span aria-hidden="true" className="contents">
          {items.map((item, index) => (
            <span key={`duplicate-${index}`}>{item}</span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Marquee;