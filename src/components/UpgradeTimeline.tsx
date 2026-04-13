"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface UpgradeTimelineProps {
  boostedUntil: string | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  percentageRemaining: number;
  isExpired: boolean;
  isAlmostExpired: boolean; // True when < 2 days remaining
}

function calculateTimeRemaining(boostedUntilDate: string | null): TimeRemaining {
  if (!boostedUntilDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentageRemaining: 0,
      isExpired: false,
      isAlmostExpired: false,
    };
  }

  const expiryTime = new Date(boostedUntilDate).getTime();
  const now = Date.now();
  const remainingMs = expiryTime - now;

  if (remainingMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentageRemaining: 0,
      isExpired: true,
      isAlmostExpired: false,
    };
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  // Calculate original duration for percentage calculation
  // Work backwards from the expiry time to estimate original duration
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
  const THREE_MONTH_MS = 3 * 30 * 24 * 60 * 60 * 1000;

  // Estimate based on remaining time
  let estimatedTotalDuration = MONTH_MS;
  if (remainingMs > THREE_MONTH_MS) {
    estimatedTotalDuration = THREE_MONTH_MS;
  } else if (remainingMs > MONTH_MS) {
    estimatedTotalDuration = MONTH_MS;
  } else if (remainingMs > WEEK_MS) {
    estimatedTotalDuration = WEEK_MS;
  } else {
    estimatedTotalDuration = remainingMs + WEEK_MS;
  }

  const percentageRemaining = Math.max(0, Math.min(100, (remainingMs / estimatedTotalDuration) * 100));
  const isAlmostExpired = days < 2; // Less than 2 days remaining

  return {
    days,
    hours,
    minutes,
    seconds,
    percentageRemaining,
    isExpired: false,
    isAlmostExpired,
  };
}

export default function UpgradeTimeline({ boostedUntil }: UpgradeTimelineProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(boostedUntil)
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!boostedUntil) return;

    // Update immediately on mount
    setTimeRemaining(calculateTimeRemaining(boostedUntil));

    // Update every second for live countdown
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(boostedUntil));
    }, 1000);

    return () => clearInterval(interval);
  }, [boostedUntil]);

  if (!isMounted || !boostedUntil || timeRemaining.isExpired) {
    return null;
  }

  const { days, hours, minutes, seconds, percentageRemaining, isAlmostExpired } = timeRemaining;

  // Determine colors based on remaining time
  const progressBarColor = isAlmostExpired
    ? "bg-red-500"
    : percentageRemaining > 50
      ? "bg-green-500"
      : "bg-gradient-to-r from-green-400 to-yellow-400";

  const statusBgColor = isAlmostExpired ? "bg-red-50" : "bg-green-50";
  const statusBorderColor = isAlmostExpired ? "border-red-200" : "border-green-200";
  const statusTextColor = isAlmostExpired ? "text-red-700" : "text-green-700";
  const statusDotColor = isAlmostExpired ? "bg-red-500" : "bg-green-500";

  return (
    <div className="mt-6 space-y-4">
      {/* Main Timeline Card */}
      <div className={`rounded-2xl border-2 p-6 transition-all duration-300 ${statusBgColor} ${statusBorderColor}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${statusDotColor} bg-opacity-10`}>
            {isAlmostExpired ? (
              <AlertCircle className={`h-5 w-5 ${statusTextColor}`} />
            ) : (
              <Calendar className={`h-5 w-5 ${statusTextColor}`} />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${statusTextColor}`}>
              {isAlmostExpired ? "Profile Boost Expiring Soon" : "Profile Boost Active"}
            </p>
            <p className={`text-sm ${statusTextColor} opacity-75`}>
              {isAlmostExpired
                ? "Less than 2 days remaining"
                : `${days} day${days !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Time Remaining</span>
            <span className={`text-sm font-semibold ${statusTextColor}`}>
              {percentageRemaining.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-1000 ease-out ${progressBarColor}`}
              style={{ width: `${percentageRemaining}%` }}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white/50 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-slate-900">{days}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Days</p>
          </div>
          <div className="rounded-xl bg-white/50 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-slate-900">{hours}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Hours</p>
          </div>
          <div className="rounded-xl bg-white/50 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-slate-900">{minutes}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Minutes</p>
          </div>
          <div className="rounded-xl bg-white/50 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-slate-900">{seconds}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Seconds</p>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      {isAlmostExpired && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">⚠️ Boost Expiring Soon</p>
          <p className="text-xs text-red-600 mt-1">
            Your profile boost will expire in {days} day{days !== 1 ? "s" : ""}. Consider renewing to maintain your ranking.
          </p>
        </div>
      )}

      {/* Info Message */}
      {!isAlmostExpired && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">✓ Boost Active</p>
          <p className="text-xs text-green-600 mt-1">
            Your profile is actively boosted and appearing higher in professional listings.
          </p>
        </div>
      )}
    </div>
  );
}
