import React from "react";
import { Search, Bell, Calendar as CalendarIcon } from "lucide-react";

export default function DashboardTopBar({
  searchQuery,
  setSearchQuery,
  setIsNotificationOpen,
  setIsCalendarOpen,
  isNotificationOpen,
  isCalendarOpen,
  NotificationModal,
  notificationFollowers,
  notificationBooksVideos,
  notificationPurchases
}) {
  return (
    <div className="flex w-full max-w-3xl items-center gap-3 md:w-auto md:flex-1 md:justify-end">
      <div className="flex h-12 flex-1 items-center gap-3 rounded-full border-none bg-[#f6fefb] px-4 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] md:max-w-xl">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        className="grid h-11 w-11 place-items-center rounded-full border-none bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]"
        onClick={() => setIsNotificationOpen(true)}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </button>
      {isNotificationOpen && NotificationModal && (
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notificationFollowers}
          section2={notificationBooksVideos}
          section3={notificationPurchases}
        />
      )}
      <button
        className="grid h-11 w-11 place-items-center rounded-full border-none bg-[#f6fefb] text-[#1ec28e] shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]"
        onClick={() => setIsCalendarOpen(true)}
        aria-label="Open calendar"
      >
        <CalendarIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
