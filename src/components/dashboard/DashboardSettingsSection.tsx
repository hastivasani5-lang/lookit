"use client";

import Image from "next/image";
import { Save, Settings, Upload } from "lucide-react";

type Props = {
  avatarSrc: string;
  profileFirstName: string; setProfileFirstName: (v: string) => void;
  profileLastName: string; setProfileLastName: (v: string) => void;
  profileEmail: string; setProfileEmail: (v: string) => void;
  profileContactNumber: string; setProfileContactNumber: (v: string) => void;
  profileAddress: string; setProfileAddress: (v: string) => void;
  profileCity: string; setProfileCity: (v: string) => void;
  profilePostalCode: string; setProfilePostalCode: (v: string) => void;
  profileCountry: string; setProfileCountry: (v: string) => void;
  profileFacebook: string; setProfileFacebook: (v: string) => void;
  profileGoogle: string; setProfileGoogle: (v: string) => void;
  profileTwitter: string; setProfileTwitter: (v: string) => void;
  profilePinterest: string; setProfilePinterest: (v: string) => void;
  profileAboutMe: string; setProfileAboutMe: (v: string) => void;
  profileSpecialization: string; setProfileSpecialization: (v: string) => void;
  profileLocation: string; setProfileLocation: (v: string) => void;
  certificateUploads: File[]; setCertificateUploads: (f: File[]) => void;
  certificateList: string[];
  setPhotoFile: (f: File | null) => void;
  profileError: string;
  profileMessage: string;
  savingProfile: boolean;
  handleProfileSave: (e: React.FormEvent<HTMLFormElement>) => void;
};

const inputCls = "h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]";

export default function DashboardSettingsSection(p: Props) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      {/* Left: photo + certificates */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Image src={p.avatarSrc} alt="Profile preview" width={96} height={96} className="h-24 w-24 rounded-3xl border border-slate-100 object-cover" />
          <div>
            <p className="text-sm font-medium text-slate-500">Profile Photo</p>
            <p className="mt-1 text-base font-semibold text-slate-900">Update your public image</p>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#18ab7d]">
              <Upload className="h-4 w-4" />
              Choose photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => p.setPhotoFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Certificates</p>
          <p className="mt-1">Upload certificates, awards, or proof documents.</p>
        </div>

        <label className="mt-4 block space-y-2 text-sm font-medium text-slate-700">
          Add certificates
          <div className="flex min-h-14 items-center gap-3 rounded-full border border-dashed border-slate-300 px-4 text-sm text-slate-500">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>{p.certificateUploads.length > 0 ? `${p.certificateUploads.length} file(s) selected` : "Choose one or more files"}</span>
          </div>
          <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => p.setCertificateUploads(Array.from(e.target.files ?? []))} />
        </label>

        {p.certificateList.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Saved certificates</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.certificateList.map((cert) => (
                <a key={cert} href={cert} target="_blank" rel="noreferrer" className="rounded-full bg-[#f7faf8] px-3 py-1 text-xs text-slate-600 transition hover:bg-[#eaf7f1] hover:text-[#1ec28e]">
                  {cert.split("/").pop()}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: edit form */}
      <form onSubmit={p.handleProfileSave} className="rounded-[24px] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Profile</h3>
            <p className="text-sm text-slate-500">Update your profile information and details.</p>
          </div>
          <Settings className="h-5 w-5 text-[#1ec28e]" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">First Name<input type="text" value={p.profileFirstName} onChange={(e) => p.setProfileFirstName(e.target.value)} placeholder="Enter first name" className={inputCls} /></label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Last Name<input type="text" value={p.profileLastName} onChange={(e) => p.setProfileLastName(e.target.value)} placeholder="Enter last name" className={inputCls} /></label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">Email Address<input type="email" value={p.profileEmail} onChange={(e) => p.setProfileEmail(e.target.value)} className={inputCls} /></label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Phone Number<input type="tel" value={p.profileContactNumber} onChange={(e) => p.setProfileContactNumber(e.target.value)} placeholder="e.g. +91 98765 43210" className={inputCls} /></label>
        </div>

        <div className="mt-4">
          <label className="space-y-2 text-sm font-medium text-slate-700">Address<input type="text" value={p.profileAddress} onChange={(e) => p.setProfileAddress(e.target.value)} placeholder="Enter your address" className={inputCls} /></label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700">City<input type="text" value={p.profileCity} onChange={(e) => p.setProfileCity(e.target.value)} placeholder="Enter city" className={inputCls} /></label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Postal Code<input type="text" value={p.profilePostalCode} onChange={(e) => p.setProfilePostalCode(e.target.value)} placeholder="Enter postal code" className={inputCls} /></label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Country<input type="text" value={p.profileCountry} onChange={(e) => p.setProfileCountry(e.target.value)} placeholder="Enter country" className={inputCls} /></label>
        </div>

        <div className="mt-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Social Links</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">Facebook<input type="url" value={p.profileFacebook} onChange={(e) => p.setProfileFacebook(e.target.value)} placeholder="https://facebook.com/username" className={inputCls} /></label>
            <label className="space-y-2 text-sm font-medium text-slate-700">Google<input type="url" value={p.profileGoogle} onChange={(e) => p.setProfileGoogle(e.target.value)} placeholder="https://google.com/username" className={inputCls} /></label>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">Twitter<input type="url" value={p.profileTwitter} onChange={(e) => p.setProfileTwitter(e.target.value)} placeholder="https://twitter.com/username" className={inputCls} /></label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Pinterest<input type="url" value={p.profilePinterest} onChange={(e) => p.setProfilePinterest(e.target.value)} placeholder="https://pinterest.com/username" className={inputCls} /></label>
        </div>

        <div className="mt-4">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            About Me
            <textarea value={p.profileAboutMe} onChange={(e) => p.setProfileAboutMe(e.target.value)} placeholder="Tell us about yourself..." rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e] focus:ring-1 focus:ring-[#1ec28e]" />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">Specialization<input type="text" value={p.profileSpecialization} onChange={(e) => p.setProfileSpecialization(e.target.value)} placeholder="e.g. UI/UX Design" className={inputCls} /></label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Location<input type="text" value={p.profileLocation} onChange={(e) => p.setProfileLocation(e.target.value)} placeholder="Enter your city or address" className={inputCls} /></label>
        </div>

        {p.profileError && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{p.profileError}</div>}
        {p.profileMessage && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{p.profileMessage}</div>}

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={p.savingProfile} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1ec28e] px-5 text-sm font-medium text-white transition hover:bg-[#18ab7d] disabled:cursor-not-allowed disabled:opacity-70">
            <Save className="h-4 w-4" />
            {p.savingProfile ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
