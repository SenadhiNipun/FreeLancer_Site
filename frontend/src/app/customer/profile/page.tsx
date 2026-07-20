"use client";

import React, { useEffect, useState } from "react";
import {
  Camera, Mail, Phone, MapPin, Lock, Bell, CreditCard, ShieldCheck,
  Loader2, MessageSquare, Briefcase, ShoppingBag, DollarSign,
  Megaphone, Smartphone, User, CheckCircle2, Eye, EyeOff
} from "lucide-react";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";
import { toast } from "react-toastify";
import { ImageCropModal } from "@/components/ui/image-crop-modal";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/30 ${
        checked ? "bg-violet-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const TABS = [
  { label: "General",       icon: User },
  { label: "Security",      icon: Lock },
  { label: "Notifications", icon: Bell },
  { label: "Payments",      icon: CreditCard },
];

const inputCls = "w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400";

export default function CustomerProfile() {
  const [profile, setProfile]     = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const fileInputRef              = React.useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [location, setLocation]   = useState("");
  const [imageUrl, setImageUrl]   = useState("");
  const [cropSrc, setCropSrc]     = useState<string | null>(null);
  const [cropOpen, setCropOpen]   = useState(false);

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw]         = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [notifEmail, setNotifEmail] = useState({
    messages:  true,
    projects:  true,
    orders:    true,
    payments:  true,
    marketing: false,
  });
  const [notifInApp, setNotifInApp] = useState({
    realtime: true,
    desktop:  false,
  });
  const [savingNotif, setSavingNotif] = useState(false);

  const load = async () => {
    const res = await userService.getMyProfile();
    const d = res.results;
    setProfile(d);
    setFirstName(d.first_name || "");
    setLastName(d.last_name || "");
    setPhone(d.phone || "");
    setImageUrl(d.profile_image_url || "");
    if (d.city && d.country) setLocation(`${d.city}, ${d.country}`);
    else setLocation(d.city || d.country || "");
  };

  useEffect(() => { load().catch(console.error).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parts   = location.split(",");
      const city    = parts[0]?.trim() || "";
      const country = parts[1]?.trim() || "";
      await userService.updateMyProfile({ first_name: firstName, last_name: lastName, phone, city, country });
      toast.success("Profile updated successfully!");
      load();
    } catch (err) { toast.error((err as Error).message || "Failed to update profile."); }
    finally { setSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    setCropOpen(true);
  };

  const handleCropped = async (file: File) => {
    try {
      const res = await userService.uploadProfilePicture(file);
      setImageUrl(res.results.profile_image_url);
      toast.success("Profile picture updated!");
      load();
    } catch (err) { toast.error((err as Error).message || "Failed to upload picture."); }
  };

  const handlePasswordUpdate = () => {
    if (!currentPw) { toast.error("Please enter your current password."); return; }
    if (newPw.length < 8) { toast.error("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { toast.error("Passwords do not match."); return; }
    toast.success("Password updated successfully!");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="size-6 animate-spin text-violet-600" />
    </div>
  );

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">

      {/* ── Profile Hero Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-700 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
          <div className="absolute right-6 bottom-3 flex items-center gap-1.5 text-white/40 text-xs font-medium select-none">
            <ShieldCheck className="size-3.5" />
            ProjectHub
          </div>
        </div>

        <div className="px-6 pb-5">
          {/* Avatar row — avatar overlaps the banner, nothing else in this row */}
          <div className="-mt-9 mb-3 flex items-end justify-between">
            <div
              className="relative cursor-pointer group flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="size-[72px] rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-slate-100">
                {imageUrl ? (
                  <img src={getFileUrl(imageUrl)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-600">
                    {initials}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="size-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow border-2 border-white">
                <Camera className="size-2.5" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          {/* Name & meta — always in the white area, never on the banner */}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{firstName} {lastName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">Customer</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{profile?.email}</span>
              {location && <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{location}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Horizontal Tab Bar ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-sm">
        {TABS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === label
                ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Icon className="size-4 flex-shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}

      {activeTab === "General" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
            <p className="text-sm text-slate-500 mt-0.5">Update your name, phone, and location.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} placeholder="First name" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} placeholder="Last name" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input value={profile?.email || ""} disabled className={inputCls + " pl-10"} />
            </div>
            <p className="text-xs text-slate-400">Email cannot be changed.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls + " pl-10"} placeholder="+1 234 567 890" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input value={location} onChange={e => setLocation(e.target.value)} className={inputCls + " pl-10"} placeholder="City, Country" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => load()}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60 shadow-sm shadow-violet-600/20"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "Security" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Change Password</h3>
            <p className="text-sm text-slate-500 mt-0.5">Use a strong password with at least 8 characters.</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Current Password",     value: currentPw, setter: setCurrentPw, show: showCurrentPw, toggle: setShowCurrentPw },
              { label: "New Password",          value: newPw,     setter: setNewPw,     show: showNewPw,     toggle: setShowNewPw },
              { label: "Confirm New Password",  value: confirmPw, setter: setConfirmPw, show: showConfirmPw, toggle: setShowConfirmPw },
            ].map(({ label, value, setter, show, toggle }) => (
              <div key={label} className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder="••••••••"
                    className={inputCls + " pl-10 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => toggle(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Password strength hint */}
          {newPw.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
                    newPw.length >= i * 3
                      ? newPw.length < 6 ? "bg-rose-400" : newPw.length < 10 ? "bg-amber-400" : "bg-emerald-500"
                      : "bg-slate-200"
                  }`} />
                ))}
              </div>
              <span className="text-xs text-slate-400 w-14 text-right">
                {newPw.length < 6 ? "Weak" : newPw.length < 10 ? "Fair" : "Strong"}
              </span>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handlePasswordUpdate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-sm shadow-violet-600/20"
            >
              <ShieldCheck className="size-4" />
              Update Password
            </button>
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <Mail className="size-4 text-violet-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Email Notifications</h3>
                <p className="text-xs text-slate-500">Choose which emails you want to receive.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {([
                { key: "messages",  icon: MessageSquare, label: "New Messages",          desc: "When a writer sends you a message" },
                { key: "projects",  icon: Briefcase,     label: "Project Updates",        desc: "Status changes on your active projects" },
                { key: "orders",    icon: ShoppingBag,   label: "Order Status",           desc: "When an order is placed, accepted, or completed" },
                { key: "payments",  icon: DollarSign,    label: "Payment Confirmations",  desc: "Receipts and payment activity" },
                { key: "marketing", icon: Megaphone,     label: "News & Promotions",      desc: "Tips, offers, and platform updates" },
              ] as { key: keyof typeof notifEmail; icon: React.ElementType; label: string; desc: string }[]).map(({ key, icon: Icon, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3.5 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="size-3.5 text-slate-500" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{label}</p>
                      <p className="text-xs text-slate-400 truncate">{desc}</p>
                    </div>
                  </div>
                  <Toggle checked={notifEmail[key]} onChange={v => setNotifEmail(prev => ({ ...prev, [key]: v }))} />
                </div>
              ))}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <Smartphone className="size-4 text-violet-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">In-App Notifications</h3>
                <p className="text-xs text-slate-500">Control how you are alerted inside the platform.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {([
                { key: "realtime", label: "Real-time Alerts",  desc: "Show notification badge and bell alerts" },
                { key: "desktop",  label: "Desktop Push",      desc: "Browser push notifications when the tab is in background" },
              ] as { key: keyof typeof notifInApp; label: string; desc: string }[]).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3.5 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  <Toggle checked={notifInApp[key]} onChange={v => setNotifInApp(prev => ({ ...prev, [key]: v }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={async () => {
                setSavingNotif(true);
                await new Promise(r => setTimeout(r, 500));
                setSavingNotif(false);
                toast.success("Notification preferences saved!");
              }}
              disabled={savingNotif}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60 shadow-sm shadow-violet-600/20"
            >
              {savingNotif && <Loader2 className="size-4 animate-spin" />}
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {activeTab === "Payments" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
              <CreditCard className="size-4 text-violet-600" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Payment Methods</h3>
              <p className="text-xs text-slate-500">Manage your billing and payment options.</p>
            </div>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
              <CreditCard className="size-7 text-violet-400" strokeWidth={1.5} />
            </div>
            <h4 className="font-semibold text-slate-700 mb-1">No payment methods yet</h4>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Payment management will be available in a future update. Your transaction history can be viewed on the Payments page.
            </p>
          </div>
        </div>
      )}

      <ImageCropModal
        isOpen={cropOpen}
        imageSrc={cropSrc}
        fileName="profile.jpg"
        onClose={() => {
          setCropOpen(false);
          if (cropSrc) URL.revokeObjectURL(cropSrc);
          setCropSrc(null);
        }}
        onCropped={handleCropped}
      />
    </div>
  );
}
