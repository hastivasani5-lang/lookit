"use client";

const Marquee = () => {
  return (
    <div className="w-full bg-green-500 overflow-hidden py-4">

      <div className="flex whitespace-nowrap animate-marquee gap-10 text-white font-semibold text-lg">

        {/* Repeat content for infinite scroll */}
        <span>EXAM TODAY ✱</span>
        <span>LEARNING INNOVATION ✱</span>
        <span>WORLDWIDE LEARNERS ✱</span>
        <span>UNIQUE KNOWLEDGE ✱</span>

        {/* duplicate (important for loop) */}
        <span>EXAM TODAY ✱</span>
        <span>LEARNING INNOVATION ✱</span>
        <span>WORLDWIDE LEARNERS ✱</span>
        <span>UNIQUE KNOWLEDGE ✱</span>

      </div>

    </div>
  );
};

export default Marquee;