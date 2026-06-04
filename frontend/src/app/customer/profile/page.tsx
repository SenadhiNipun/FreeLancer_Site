"use client";

import React from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  Bell, 
  ShieldCheck,
  CreditCard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";
import { toast } from "react-toastify";

export default function Profile() {
  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("General Information");

  // States for editable fields
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [profileImageUrl, setProfileImageUrl] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await userService.getMyProfile();
      const data = res.results;
      setProfile(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setPhone(data.phone || "");
      setProfileImageUrl(data.profile_image_url || "");
      
      // Location is constructed from city and country
      if (data.city && data.country) {
        setLocation(`${data.city}, ${data.country}`);
      } else if (data.city) {
        setLocation(data.city);
      } else if (data.country) {
        setLocation(data.country);
      } else {
        setLocation("");
      }
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
      // Split location into city and country
      let city = "";
      let country = "";
      if (location) {
        const parts = location.split(",");
        if (parts.length >= 2) {
          city = parts[0].trim();
          country = parts[1].trim();
        } else {
          city = location.trim();
        }
      }

      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        city: city,
        country: country
      };

      await userService.updateMyProfile(payload);
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile changes");
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
      toast.success("Profile picture uploaded successfully!");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "JD";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { label: "General Information", icon: User },
            { label: "Security & Password", icon: Lock },
            { label: "Notifications", icon: Bell },
            { label: "Payment Methods", icon: CreditCard },
            { label: "Privacy & Data", icon: ShieldCheck },
          ].map((item, i) => {
            const isActive = activeTab === item.label;
            return (
              <Button 
                key={i} 
                onClick={() => setActiveTab(item.label)}
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 rounded-xl h-11 px-4 ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground'}`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "General Information" && (
            <>
              {/* Profile Header */}
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                <CardContent className="relative pt-0">
                   <div className="flex flex-col sm:flex-row items-end gap-6 -mt-10 px-4">
                      <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl border border-border/50 overflow-hidden">
                          {profileImageUrl ? (
                            <img 
                              src={getFileUrl(profileImageUrl)} 
                              alt="Avatar" 
                              className="h-full w-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                              {initials}
                            </div>
                          )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Camera className="size-4" />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>
                      <div className="pb-2 space-y-1">
                        <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="size-3" /> {profile?.email}
                        </p>
                      </div>
                   </div>
                </CardContent>
              </Card>

              {/* Form Sections */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Update your basic contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="rounded-xl h-11 bg-muted/30 border-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="rounded-xl h-11 bg-muted/30 border-none" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={profile?.email || ""} 
                      disabled 
                      className="rounded-xl h-11 bg-muted/50 border-none" 
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          className="pl-10 rounded-xl h-11 bg-muted/30 border-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          id="location" 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)} 
                          placeholder="e.g. New York, USA"
                          className="pl-10 rounded-xl h-11 bg-muted/30 border-none" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Account Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                     <div className="space-y-1">
                        <p className="text-sm font-bold">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates about your tasks and messages.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                     <div className="space-y-1">
                        <p className="text-sm font-bold">Public Profile</p>
                        <p className="text-xs text-muted-foreground">Allow others to see your reviews and feedback.</p>
                     </div>
                     <Switch />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button 
                  variant="ghost" 
                  onClick={fetchProfile} 
                  disabled={isSaving} 
                  className="rounded-xl px-6"
                >
                  Discard Changes
                </Button>
                <Button 
                  onClick={handleSaveChanges} 
                  disabled={isSaving} 
                  className="rounded-xl px-8 shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="size-4 animate-spin" />}
                  Save Profile
                </Button>
              </div>
            </>
          )}

          {activeTab === "Security & Password" && (
            <Card className="border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <CardHeader>
                <CardTitle className="text-lg">Security & Password</CardTitle>
                <CardDescription>Manage your password and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="••••••••" className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="••••••••" className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => {
                      const newPass = (document.getElementById("newPassword") as HTMLInputElement).value;
                      const confirmPass = (document.getElementById("confirmPassword") as HTMLInputElement).value;
                      if (newPass && newPass !== confirmPass) {
                        toast.error("Passwords do not match!");
                        return;
                      }
                      toast.success("Password updated successfully!");
                      (document.getElementById("currentPassword") as HTMLInputElement).value = "";
                      (document.getElementById("newPassword") as HTMLInputElement).value = "";
                      (document.getElementById("confirmPassword") as HTMLInputElement).value = "";
                    }} 
                    className="rounded-xl px-8 shadow-lg shadow-primary/20"
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {["Notifications", "Payment Methods", "Privacy & Data"].includes(activeTab) && (
            <Card className="border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <CardHeader>
                <CardTitle className="text-lg">{activeTab}</CardTitle>
                <CardDescription>This section is under construction.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                  <ShieldCheck className="size-12 mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Coming soon in a future update.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
