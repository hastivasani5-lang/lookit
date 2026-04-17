import React, { useEffect, useState } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Array<{ id: string; message: string; }>;
  section2?: Array<{ id: string; message: string; }>; 
  section3?: Array<{ id: string; message: string; }>; 
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notifications, section2 = [], section3 = [] }) => {
  const [activeSection, setActiveSection] = useState(0);
  if (!isOpen) return null;

  // Sidebar style modal
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl transform transition-transform duration-300 animate-slideInRight flex flex-col rounded-l-2xl border-l-4 border-[#1ec28e]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-[#1ec28e] tracking-wide">Notifications</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-[#1ec28e] transition-colors">&times;</button>
        </div>
        <div className="flex border-b bg-[#f6fefb]">
          <button
            className={`flex-1 py-3 text-sm transition font-semibold ${activeSection === 0 ? 'border-b-4 border-[#1ec28e] text-[#1ec28e] bg-white' : 'text-gray-500'}`}
            onClick={() => setActiveSection(0)}
          >Section 1</button>
          <button
            className={`flex-1 py-3 text-sm transition font-semibold ${activeSection === 1 ? 'border-b-4 border-[#1ec28e] text-[#1ec28e] bg-white' : 'text-gray-500'}`}
            onClick={() => setActiveSection(1)}
          >Section 2</button>
          <button
            className={`flex-1 py-3 text-sm transition font-semibold ${activeSection === 2 ? 'border-b-4 border-[#1ec28e] text-[#1ec28e] bg-white' : 'text-gray-500'}`}
            onClick={() => setActiveSection(2)}
          >Section 3</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#f9fbfa]">
          {activeSection === 0 && (
            <ul className="space-y-3">
              {notifications.length === 0 ? (
                <li className="text-gray-400 text-center">No notifications</li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id} className="p-4 bg-white rounded-xl shadow border border-[#e0e7ef] text-sm">{n.message}</li>
                ))
              )}
            </ul>
          )}
          {activeSection === 1 && (
            <ul className="space-y-3">
              {section2.length === 0 ? (
                <li className="text-gray-400 text-center">No items in Section 2</li>
              ) : (
                section2.map((n) => (
                  <li key={n.id} className="p-4 bg-white rounded-xl shadow border border-[#e0e7ef] text-sm">{n.message}</li>
                ))
              )}
            </ul>
          )}
          {activeSection === 2 && (
            <ul className="space-y-3">
              {section3.length === 0 ? (
                <li className="text-gray-400 text-center">No items in Section 3</li>
              ) : (
                section3.map((n) => (
                  <li key={n.id} className="p-4 bg-white rounded-xl shadow border border-[#e0e7ef] text-sm">{n.message}</li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
