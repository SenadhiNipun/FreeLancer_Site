"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, Mail, Phone, MapPin, GraduationCap, ShieldCheck,
  CheckCircle2, ExternalLink, Loader2, Edit3,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";
import { toast } from "react-toastify";

const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-muted/30";

export default function WriterProfile() {
  const router    = useRouter();
  const [profile, setProfile]               = useState<any>(null);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [firstName, setFirstName]           = useState("");
  const [lastName, setLastName]             = useState("");
  const [phone, setPhone]                   = useState("");
  const [city, setCity]                     = useState("");
  const [country, setCountry]               = useState("");
  const [bio, setBio]                       = useState("");
  const [institutionName, setInstitution]   = useState("");
  const [academicStatus, setAcademicStatus] = useState("");
  const [experienceYears, setExpYears]      = useState(0);
  const [imageUrl, setImageUrl]             = useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await userService.getMyProfile();
    const d = res.results;
    setProfile(d);
    setFirstName(d.first_name || "");       setLastName(d.last_name || "");
    setPhone(d.phone || "");                setCity(d.city || "");
    setCountry(d.country || "");            setBio(d.bio || "");
    setInstitution(d.institution_name || "");
    setAcademicStatus(d.education_level || "");
    setExpYears(d.experience_years || 0);
    setImageUrl(d.profile_image_url || "");
  };

  useEffect(() => { load().catch(console.error).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateMyProfile({
        first_name: firstName, last_name: lastName, phone, city, country,
        bio, institution_name: institutionName,
        academic_status: academicStatus, experience_years: experienceYears,
      });
      toast.success("Profile updated successfully!");
      load();
    } catch (err) { toast.error((err as Error).message || "Failed to save profile."); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await userService.uploadProfilePicture(file);
      setImageUrl(res.results.profile_image_url);
      toast.success("Profile picture uploaded!");
    } catch (err) { toast.error((err as Error).message || "Failed to upload picture."); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "W";

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Professional Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your identity, credentials, and portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push(`/profile/${profile?.user_id}`)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            <ExternalLink className="size-4" /> Public Profile
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Edit3 className="size-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Avatar card */}
          <div className="bg-white border border-border rounded-xl p-5 text-center">
            <div className="relative inline-block cursor-pointer group mx-auto" onClick={() => fileInputRef.current?.click()}>
              <div className="size-24 rounded-2xl bg-violet-100 border-4 border-white shadow-lg mx-auto overflow-hidden flex items-center justify-center text-violet-700 text-3xl font-semibold">
                {imageUrl ? (
                  <img src={getFileUrl(imageUrl)} alt="Avatar" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="absolute bottom-0 right-0 size-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
                <Camera className="size-4" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <h2 className="text-lg font-semibold text-foreground mt-4">{firstName} {lastName}</h2>
            <p className="text-sm text-muted-foreground">Expert Academic Writer</p>

            <div className="mt-5 space-y-3 text-left border-t border-border pt-4">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-muted-foreground flex-shrink-0" />
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="text-sm text-foreground bg-transparent outline-none border-b border-transparent focus:border-primary/50 w-full"
                  placeholder="Add phone number" />
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-muted-foreground flex-shrink-0" />
                <div className="flex gap-1 flex-1">
                  <input value={city} onChange={e => setCity(e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none border-b border-transparent focus:border-primary/50 w-1/2"
                    placeholder="City" />
                  <span className="text-muted-foreground">,</span>
                  <input value={country} onChange={e => setCountry(e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none border-b border-transparent focus:border-primary/50 w-1/2"
                    placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          {/* Bio card */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Professional Bio</h3>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={5}
              placeholder="Tell clients about your academic qualifications…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Academic qualifications */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="size-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center">
                <GraduationCap className="size-4 text-orange-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Academic Qualifications</h3>
                <p className="text-xs text-muted-foreground">Your educational background and credentials</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">University / Institution</label>
                  <input value={institutionName} onChange={e => setInstitution(e.target.value)} className={inputCls} placeholder="e.g. University of Oxford" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Degree Level</label>
                  <input value={academicStatus} onChange={e => setAcademicStatus(e.target.value)} className={inputCls} placeholder="e.g. PhD, Masters, Bachelors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Years of Experience</label>
                  <input type="number" value={experienceYears} onChange={e => setExpYears(parseInt(e.target.value) || 0)} className={inputCls} min={0} />
                </div>
              </div>
            </div>
          </div>

          {/* Verification status */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="size-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
                <ShieldCheck className="size-4 text-blue-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Verification Status</h3>
                <p className="text-xs text-muted-foreground">Identity and document verification</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center">
                    <CheckCircle2 className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Identity Verified</p>
                    <p className="text-xs text-muted-foreground">NIC/Passport verification complete</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  Update <ExternalLink className="size-3" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Expertise Areas:</p>
                <div className="flex gap-2 flex-wrap justify-end">
                  {["Physics", "Mathematics", "Python", "LaTeX"].map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-xs font-medium text-violet-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
