import { useEffect, useState } from "react";

interface AutoPopupModalProps {
  onClose: () => void;
  userId: string;
}


const steps = [
  {
    title: "Country",
    question: "1. Which country do you live in?",
    options: ["India", "USA", "UK", "Canada", "Other"],
    key: "country"
  },
  {
    title: "Preferred Language",
    question: "2. Which language are you most comfortable with?",
    options: ["Gujarati", "Hindi", "English", "Other"],
    key: "language"
  },
  {
    title: "Profession",
    question: "3. What is your profession?",
    options: ["Student", "Teacher", "Professional", "Other"],
    key: "profession"
  },
  {
    title: "Source of Knowledge",
    question: "4. How did you hear about us?",
    options: ["Friends", "Social Media", "School/College", "Other"],
    key: "source"
  },
    {
    title: "Study Time",
    question: "3. How much time do you study daily?",
    options: ["1-2 hours", "2-4 hours", "4+ hours", "Never"],
    key: "studyTime"
  },
];

const AutoPopupModal: React.FC<AutoPopupModalProps> = ({ onClose, userId }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [steps[step].key]: option }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      // Save answers to localStorage for dashboard use, per user
      if (typeof window !== "undefined" && userId) {
        window.localStorage.setItem(`student_profile_answers_${userId}`, JSON.stringify(answers));
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-md animate-fade-in text-black">
        <h2 className="text-xl font-bold mb-4 text-center">{steps[step].title}</h2>
        <div className="mb-4 text-center">
          <div className="font-medium mb-2">{steps[step].question}</div>
          <div className="flex flex-col gap-2">
            {steps[step].options.map(option => (
              <button
                key={option}
                type="button"
                className={`px-4 py-2 rounded border transition-all ${answers[steps[step].key] === option ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300 hover:bg-blue-50"}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handlePrev}
            disabled={step === 0}
          >
            Previous
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={handleNext}
              disabled={!answers[steps[step].key]}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 rounded bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:bg-green-700 disabled:opacity-50"
              onClick={handleNext}
              disabled={!answers[steps[step].key]}
            >
              Finish
            </button>
          )}
        </div>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AutoPopupModal;
