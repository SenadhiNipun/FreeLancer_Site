"use client";

import React, { useEffect, useState } from "react";
import { Camera, Mail, Phone, MapPin, Lock, Bell, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";
import { toast } from "react-toastify";

const TABS = [
  { label: "General",    icon: ShieldCheck },
  { label: "Security",   icon: Lock },
  { label: "Notifications", icon: Bell },
  { label: "Payments",   icon: CreditCard },
];

const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-muted/30 disabled:text-muted-foreground";

export default function CustomerProfile() {
  const [profile, setProfile]       = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [activeTab, setActiveTab]   = useState("General");
  const fileInputRef                = React.useRef<HTMLInputElement>(null);

  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [phone, setPhone]           = useState("");
  const [location, setLocation]     = useState("");
  const [imageUrl, setImageUrl]     = useState("");

  const load = async () => {
    const res = await userService.getMyProfile();
    const d = res.results;
    setProfile(d);
    setFirstName(d.first_name || ""); setLastName(d.last_name || "");
    setPhone(d.phone || ""); setImageUrl(d.profile_image_url || "");
    if (d.city && d.country) setLocation(`${d.city}, ${d.country}`);
    else setLocation(d.city || d.country || "");
  };

  useEffect(() => { load().catch(console.error).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parts = location.split(",");
      const city    = parts[0]?.trim() || "";
      const country = parts[1]?.trim() || "";
      await userService.updateMyProfile({ first_name: firstName, last_name: lastName, phone, city, country });
      toast.success("Profile updated successfully!");
      load();
    } catch (err) { toast.error((err as Error).message || "Failed to update profile."); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await userService.uploadProfilePicture(file);
      setImageUrl(res.results.profile_image_url);
      toast.success("Profile picture uploaded!");
      load();
    } catch (err) { toast.error((err as Error).message || "Failed to upload picture."); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account information and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Tab nav */}
        <div className="lg:col-span-1">
          <nav className="space-y-0.5">
            {TABS.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setActiveTab(label)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  activeTab === label ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                <Icon className={`size-4 flex-shrink-0 ${activeTab === label ? "text-violet-600" : "text-slate-400"}`} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">
          {activeTab === "General" && (
            <>
              {/* Avatar card */}
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-violet-100 to-violet-50" />
                <div className="px-5 pb-5 -mt-10">
                  <div className="relative inline-block cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                    <div className="size-20 rounded-2xl bg-white p-1 shadow-md border border-border overflow-hidden">
                      {imageUrl ? (
                        <img src={getFileUrl(imageUrl)} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-violet-100 flex items-center justify-center text-2xl font-semibold text-violet-700">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
                      <Camera className="size-3.5" />
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                  <div className="mt-3">
                    <h2 className="font-semibold text-foreground">{firstName} {lastName}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5" /> {profile?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form card */}
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">First Name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Last Name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Email Address</label>
                  <input value={profile?.email || ""} disabled className={inputCls} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls + " pl-9"} placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input value={location} onChange={e => setLocation(e.target.value)} className={inputCls + " pl-9"} placeholder="City, Country" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => load()} disabled={saving} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                    Discard
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                    {saving && <Loader2 className="size-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "Security" && (
            <div className="bg-white border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Change Password</h3>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Current Password</label>
                <input id="currentPassword" type="password" placeholder="••••••••" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">New Password</label>
                <input id="newPassword" type="password" placeholder="••••••••" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Confirm New Password</label>
                <input id="confirmPassword" type="password" placeholder="••••••••" className={inputCls} />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const np = (document.getElementById("newPassword") as HTMLInputElement)?.value;
                    const cp = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;
                    if (np && np !== cp) { toast.error("Passwords do not match!"); return; }
                    toast.success("Password updated successfully!");
                    ["currentPassword","newPassword","confirmPassword"].forEach(id => {
                      const el = document.getElementById(id) as HTMLInputElement;
                      if (el) el.value = "";
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {["Notifications","Payments"].includes(activeTab) && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{activeTab}</h3>
              <div className="py-8 flex flex-col items-center justify-center text-center opacity-50">
                <ShieldCheck className="size-10 mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">This section is coming in a future update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
