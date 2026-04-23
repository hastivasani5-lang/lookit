"use client";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Save, Settings, Upload } from "lucide-react";

type SettingsSectionProps = {
  avatarSrc: string;
  profileFirstName: string;
  setProfileFirstName: (v: string) => void;
  profileLastName: string;
  setProfileLastName: (v: string) => void;
  profileEmail: string;
  setProfileEmail: (v: string) => void;
  profileContactNumber: string;
  setProfileContactNumber: (v: string) => void;
  profileAddress: string;
  setProfileAddress: (v: string) => void;
  profileCity: string;
  setProfileCity: (v: string) => void;
  profilePostalCode: string;
  setProfilePostalCode: (v: string) => void;
  profileCountry: string;
  setProfileCountry: (v: string) => void;
  profileFacebook: string;
  setProfileFacebook: (v: string) => void;
  profileGoogle: string;
  setProfileGoogle: (v: string) => void;
  profileTwitter: string;
  setProfileTwitter: (v: string) => void;
  profilePinterest: string;
  setProfilePinterest: (v: string) => void;
  profileAboutMe: string;
  setProfileAboutMe: (v: string) => void;
  profileSpecialization: string;
  setProfileSpecialization: (v: string) => void;
  profileLocation: string;
  setProfileLocation: (v: string) => void;
  certificateList: string[];
  certificateUploads: File[];
  setCertificateUploads: (files: File[]) => void;
  setPhotoFile: (f: File | null) => void;
  savingProfile: boolean;
  profileError: string;
  profileMessage: string;
  handleProfileSave: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function SettingsSection({
  avatarSrc,
  profileFirstName, setProfileFirstName,
  profileLastName, setProfileLastName,
  profileEmail, setProfileEmail,
  profileContactNumber, setProfileContactNumber,
  profileAddress, setProfileAddress,
  profileCity, setProfileCity,
  profilePostalCode, setProfilePostalCode,
  profileCountry, setProfileCountry,
  profileFacebook, setProfileFacebook,
  profileGoogle, setProfileGoogle,
  profileTwitter, setProfileTwitter,
  profilePinterest, setProfilePinterest,
  profileAboutMe, setProfileAboutMe,
  profileSpecialization, setProfileSpecialization,
  profileLocation, setProfileLocation,
  certificateList,
  certificateUploads, setCertificateUploads,
  setPhotoFile,
  savingProfile,
  profileError,
  profileMessage,
  handleProfileSave,
}: SettingsSectionProps) {
  const [zipLoading, setZipLoading] = useState(false);
  const cityDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-fetch ZIP code when city is typed
  const handleCityChange = useCallback((value: string) => {
    setProfileCity(value);
    
    // Clear previous timeout
    if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
    
    // Debounce API call
    cityDebounceRef.current = setTimeout(async () => {
      const city = value.trim();
      if (!city || city.length < 3) return;
      
      setZipLoading(true);
      try {
        // Try India first (most common for this app)
        const indiaRes = await fetch(`https://api.zippopotam.us/in/${encodeURIComponent(city)}`);
        if (indiaRes.ok) {
          const data = await indiaRes.json();
          if (data.places && data.places[0]) {
            setProfilePostalCode(data.places[0]["post code"]);
            setProfileCountry("India");
            setZipLoading(false);
            return;
          }
        }
        
        // Try US
        const usRes = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(city)}`);
        if (usRes.ok) {
          const data = await usRes.json();
          if (data.places && data.places[0]) {
            setProfilePostalCode(data.places[0]["post code"]);
            setProfileCountry("United States");
            setZipLoading(false);
            return;
          }
        }
      } catch {
        // Silently fail — user can manually enter ZIP
      }
      setZipLoading(false);
    }, 800);
  }, [setProfileCity, setProfilePostalCode, setProfileCountry]);

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      {/* Left: Photo + Certificates */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src={avatarSrc}
            alt="Profile preview"
            width={96}
            height={96}
            className="h-24 w-24 rounded-3xl border border-slate-100 object-cover"
          />
          <div>
            <p className="text-sm font-medium text-slate-500">Profile Photo</p>
            <p className="mt-1 text-base font-semibold text-slate-900">Update your public image</p>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
              <Upload className="h-4 w-4" />
              Choose photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Certificate</p>
          <p className="mt-1">Upload one certificate, award, or proof document. New upload replaces the existing one.</p>
        </div>

        <label className="mt-4 block space-y-2 text-sm font-medium text-slate-700">
          Upload certificate
          <div className="flex min-h-14 items-center gap-3 rounded-full border border-dashed border-slate-300 px-4 text-sm text-slate-500">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>{certificateUploads.length > 0 ? `✓ ${certificateUploads[0].name}` : "Choose a file (PDF, image)"}</span>
          </div>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(event) => setCertificateUploads(event.target.files?.[0] ? [event.target.files[0]] : [])}
          />
        </label>

        {certificateList.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Current certificate</p>
            <div className="mt-3 flex flex-col gap-2">
              {certificateList.slice(0, 1).map((certificate, idx) => {
                const ext = certificate.split(".").pop()?.toLowerCase() ?? "";
                const isPdf = ext === "pdf";
                return (
                  <a
                    key={certificate}
                    href={certificate}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#f7faf8] px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-[#effaf6] hover:text-[#1ec28e]"
                  >
                    <svg className="h-4 w-4 shrink-0 text-[#1ec28e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Certificate {idx + 1}{isPdf ? " (PDF)" : ""}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Edit Profile Form */}
      <form onSubmit={handleProfileSave} className="rounded-[24px] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Profile</h3>
            <p className="text-sm text-slate-500">Update your profile information and details.</p>
          </div>
          <Settings className="h-5 w-5 text-[#1ec28e]" />
        </div>

        {/* First Name + Last Name */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            First Name
            <input type="text" value={profileFirstName} onChange={(e) => setProfileFirstName(e.target.value)} placeholder="Enter first name"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Last Name
            <input type="text" value={profileLastName} onChange={(e) => setProfileLastName(e.target.value)} placeholder="Enter last name"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        {/* Email + Phone */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Email Address
            <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Phone Number
            <input type="tel" value={profileContactNumber} onChange={(e) => setProfileContactNumber(e.target.value)} placeholder="e.g. +91 98765 43210"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        {/* Address */}
        <div className="mt-4">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Address
            <input type="text" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} placeholder="Enter your address"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        {/* City + Postal + Country */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            City
            <input type="text" value={profileCity}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Enter city (ZIP auto-fills)"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Postal / ZIP Code
            <div className="relative">
              <input type="text" value={profilePostalCode}
                onChange={(e) => setProfilePostalCode(e.target.value)}
                placeholder="Auto-filled from city"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 pr-8 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
              {zipLoading && (
                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-emerald-500" />
              )}
            </div>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Country
            <input type="text" value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} placeholder="Enter country"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        {/* Social Links */}
        <div className="mt-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Social Links</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Facebook
              <input type="url" value={profileFacebook} onChange={(e) => setProfileFacebook(e.target.value)} placeholder="https://facebook.com/username"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Google
              <input type="url" value={profileGoogle} onChange={(e) => setProfileGoogle(e.target.value)} placeholder="https://google.com/username"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
            </label>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Twitter
            <input type="url" value={profileTwitter} onChange={(e) => setProfileTwitter(e.target.value)} placeholder="https://twitter.com/username"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Pinterest
            <input type="url" value={profilePinterest} onChange={(e) => setProfilePinterest(e.target.value)} placeholder="https://pinterest.com/username"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        {/* About Me */}
        <div className="mt-4">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            About Me
            <textarea value={profileAboutMe} onChange={(e) => setProfileAboutMe(e.target.value)}
              placeholder="Tell us about yourself, your experience, and expertise..." rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        {/* Specialization + Location */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Specialization
            <input type="text" value={profileSpecialization} onChange={(e) => setProfileSpecialization(e.target.value)} placeholder="e.g. UI/UX Design"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Location / ZIP Code
            <input type="text" value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} placeholder="e.g. Mumbai 400001 or New York 10001"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
            <span className="text-xs text-gray-400 font-normal">Include ZIP/PIN code so students can find you by location</span>
          </label>
        </div>

        {profileError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>
        )}
        {profileMessage && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={savingProfile}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
            <Save className="h-4 w-4" />
            {savingProfile ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
