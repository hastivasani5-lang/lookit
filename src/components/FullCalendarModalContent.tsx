import React from "react";
import Calendar from "react-calendar";
import type { LooseValue } from "react-calendar/dist/shared/types.js";
import 'react-calendar/dist/Calendar.css';

export default function FullCalendarModalContent() {
  const [value, setValue] = React.useState<LooseValue>(new Date());
  return (
    <div className="w-full flex flex-col items-center">
      <Calendar
        onChange={setValue}
        value={value}
        calendarType="gregory"
        className="custom-calendar rounded-2xl shadow-lg border border-[#d1f5e0] bg-white p-4"
        tileClassName={({ date, view }) =>
          view === 'month' && date.toDateString() === new Date().toDateString()
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full' : ''
        }
      />
      <style jsx global>{`
        .custom-calendar {
          font-family: 'Inter', sans-serif;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(30,194,142,0.10);
        }
        .custom-calendar .react-calendar__tile--active {
          background: #1ec28e !important;
          color: #fff !important;
          border-radius: 9999px;
        }
        .custom-calendar .react-calendar__tile--now {
          background: #e0f7ef !important;
          color: #1ec28e !important;
          border-radius: 9999px;
        }
        .custom-calendar .react-calendar__tile {
          border-radius: 9999px;
          transition: background 0.2s, color 0.2s;
        }
        .custom-calendar .react-calendar__tile:enabled:hover {
          background: #d1f5e0 !important;
          color: #1ec28e !important;
        }
        .custom-calendar .react-calendar__navigation button {
          color: #1ec28e;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
