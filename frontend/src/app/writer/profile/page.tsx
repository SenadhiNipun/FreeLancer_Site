"use client";

import React from "react";
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3,
  Camera,
  ExternalLink,
  CheckCircle2,
  Activity,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { getFileUrl } from "@/lib/api-client";

export default function WriterProfile() {
  const router = useRouter();

  // Profile data states
  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Field states
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [institutionName, setInstitutionName] = React.useState("");
  const [academicStatus, setAcademicStatus] = React.useState(""); // Degree Level
  const [experienceYears, setExperienceYears] = React.useState(0);
  const [profileImageUrl, setProfileImageUrl] = React.useState("");

  const fetchProfile = async () => {
    try {
      const res = await userService.getMyProfile();
      const data = res.results;
      setProfile(data);
      
      // Initialize states
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      setCountry(data.country || "");
      setBio(data.bio || "");
      setInstitutionName(data.institution_name || "");
      setAcademicStatus(data.education_level || "");
      setExperienceYears(data.experience_years || 0);
      setProfileImageUrl(data.profile_image_url || "");
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        city: city,
        country: country,
        bio: bio,
        institution_name: institutionName,
        academic_status: academicStatus,
        experience_years: experienceYears
      };
      await userService.updateMyProfile(payload);
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error: any) {
      alert(error.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await userService.uploadProfilePicture(file);
      const newUrl = res.results.profile_image_url;
      setProfileImageUrl(newUrl);
      alert("Profile picture uploaded successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to upload profile picture");
    }
  };

  const handleViewPublicProfile = () => {
    if (!profile) return;
    router.push(`/profile/${profile.user_id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Loading professional credentials...</p>
      </div>
    );
  }

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "WP";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1033]">Professional Profile</h1>
          <p className="text-[#9490a8] text-sm mt-1">Manage your identity, academic credentials, and portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleViewPublicProfile}
            variant="outline" 
            className="h-11 px-6 font-bold border-2 gap-2 border-violet-100 hover:bg-violet-50 text-[#7C5CFC] transition-colors rounded-xl"
          >
            View Public Profile
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="h-11 px-8 font-bold bg-[#7C5CFC] hover:bg-[#6d4ef0] shadow-lg shadow-violet-400/20 gap-2 transition-all hover:scale-105 active:scale-95 rounded-xl text-white flex items-center justify-center"
          >
             {isSaving ? (
               <Activity className="size-4 animate-spin" />
             ) : (
               <>
                 <Edit3 className="size-4" /> Save Changes
               </>
             )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="border-border/50 shadow-sm overflow-hidden text-center p-8 relative rounded-3xl bg-white/80 backdrop-blur-sm">
             <div className="absolute top-4 right-4">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                   <ShieldCheck className="size-4 text-green-600" />
                </div>
             </div>
             
             <div className="mx-auto w-32 h-32 rounded-3xl bg-violet-100 flex items-center justify-center text-[#7C5CFC] text-4xl font-black mb-6 border-4 border-white shadow-xl relative group overflow-hidden">
                {profileImageUrl ? (
                   <img src={getFileUrl(profileImageUrl)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   initials
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                   <Camera className="size-8 text-white" />
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     onChange={handleImageUpload} 
                   />
                </label>
             </div>
             
             <h2 className="text-2xl font-bold text-[#1a1033]">{firstName} {lastName}</h2>
             <p className="text-sm font-medium text-[#9490a8] mt-1 tracking-wide">Expert Academic Writer</p>
             
             <div className="mt-8 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-[#6b6880] border border-slate-200 uppercase">Verified Identity</span>
                <span className="px-3 py-1 rounded-full bg-violet-50 text-[10px] font-bold text-[#7C5CFC] border border-[#7C5CFC]/20 uppercase">Top 10% Writer</span>
             </div>

             <div className="mt-10 space-y-4 text-left border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3 text-sm">
                   <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#9490a8]">
                      <Mail className="size-4" />
                   </div>
                   <span className="text-[#1a1033] font-bold truncate">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#9490a8]">
                      <Phone className="size-4" />
                   </div>
                   <input 
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     className="text-[#1a1033] font-bold bg-transparent outline-none border-b border-transparent focus:border-[#7C5CFC]/50 w-full"
                     placeholder="Add Phone Number"
                   />
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#9490a8]">
                      <MapPin className="size-4" />
                   </div>
                   <div className="flex gap-1 w-full">
                     <input 
                       value={city}
                       onChange={(e) => setCity(e.target.value)}
                       className="text-[#1a1033] font-bold bg-transparent outline-none border-b border-transparent focus:border-[#7C5CFC]/50 w-1/2"
                       placeholder="City"
                     />
                     <span className="text-[#9490a8] font-bold">,</span>
                     <input 
                       value={country}
                       onChange={(e) => setCountry(e.target.value)}
                       className="text-[#1a1033] font-bold bg-transparent outline-none border-b border-transparent focus:border-[#7C5CFC]/50 w-1/2"
                       placeholder="Country"
                     />
                   </div>
                </div>
             </div>
          </Card>
          
          <Card className="border-violet-100/50 shadow-sm p-6 bg-gradient-to-br from-[#7C5CFC] to-[#6d4ef0] text-white rounded-3xl">
             <h3 className="font-bold flex items-center gap-2 mb-4">
                <Award className="size-5" /> Professional Bio
             </h3>
             <textarea 
               value={bio}
               onChange={(e) => setBio(e.target.value)}
               className="text-sm bg-white/10 text-white placeholder:text-white/60 p-3 rounded-2xl w-full min-h-[100px] outline-none border border-white/20 focus:border-white/50 leading-relaxed font-medium italic"
               placeholder="Tell clients about your academic qualifications and background..."
             />
          </Card>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-border/50 shadow-sm rounded-3xl bg-white">
              <CardHeader className="border-b border-slate-100 p-6">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200/50">
                       <GraduationCap className="size-5.5 text-orange-600" />
                    </div>
                    <div>
                       <CardTitle className="text-[#1a1033] font-black text-base">Academic Qualifications</CardTitle>
                       <CardDescription className="text-xs text-[#9490a8]">Your educational background and credentials.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-[#9490a8] uppercase tracking-wider">University / Institution</Label>
                       <Input 
                         value={institutionName} 
                         onChange={(e) => setInstitutionName(e.target.value)}
                         className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#7C5CFC]/20"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-[#9490a8] uppercase tracking-wider">Degree Level</Label>
                       <Input 
                         value={academicStatus} 
                         onChange={(e) => setAcademicStatus(e.target.value)}
                         className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#7C5CFC]/20"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-[#9490a8] uppercase tracking-wider">Years of Experience</Label>
                       <Input 
                         type="number"
                         value={experienceYears} 
                         onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                         className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#7C5CFC]/20"
                       />
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border/50 shadow-sm rounded-3xl bg-white">
              <CardHeader className="border-b border-slate-100 p-6">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200/50">
                       <ShieldCheck className="size-5.5 text-blue-600" />
                    </div>
                    <div>
                       <CardTitle className="text-[#1a1033] font-black text-base">Verification Status</CardTitle>
                       <CardDescription className="text-xs text-[#9490a8]">Identity and document verification status.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 border border-green-200/50">
                          <CheckCircle2 className="size-6" />
                       </div>
                       <div>
                          <p className="font-bold text-[#1a1033] leading-tight">Identity Verified</p>
                          <p className="text-xs text-[#9490a8] mt-1">NIC/Passport verification complete.</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#7C5CFC] font-bold gap-1 hover:bg-violet-50 rounded-lg">Update Document <ExternalLink className="size-3" /></Button>
                 </div>
                 
                 <div className="mt-8 flex justify-between items-center px-2">
                    <p className="text-sm font-bold text-[#6b6880]">Expertise Areas:</p>
                    <div className="flex gap-2">
                       {['Physics', 'Mathematics', 'Python', 'Latex'].map(tag => (
                          <span key={tag} className="px-3 py-1.5 bg-violet-50 rounded-lg text-xs font-bold text-[#7C5CFC] border border-violet-100">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
