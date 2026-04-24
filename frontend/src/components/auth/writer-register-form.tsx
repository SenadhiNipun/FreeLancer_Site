"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { AlertCircle, Loader2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const EDUCATION_LEVELS = [
  "High School / A/L Completed",
  "Certificate Program",
  "Diploma",
  "Higher National Diploma (HND)",
  "Bachelor’s Degree",
  "Postgraduate Diploma",
  "Master’s Degree",
  "MPhil",
  "PhD / Doctorate",
  "Professional Qualification",
  "Other"
];

export function WriterRegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [specializations, setSpecializations] = useState<{id: number, name: string}[]>([]);
  const [isWhatsappSame, setIsWhatsappSame] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    whatsapp_number: "",
    city: "",
    country: "",
    education_level: "",
    institution_name: "",
    academic_status: "Completed",
    graduation_year: "",
    main_category_id: "",
    specialization_id: "",
    national_id_number: "",
    experience_years: 0,
    bio: ""
  });

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/fields/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.results) setCategories(data.results);
      })
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  // Fetch specializations when category changes
  useEffect(() => {
    if (formData.main_category_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/fields/specializations/${formData.main_category_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.results) setSpecializations(data.results);
        })
        .catch(err => console.error("Failed to fetch specializations:", err));
    } else {
      setSpecializations([]);
    }
  }, [formData.main_category_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "phone_number" && isWhatsappSame) {
      setFormData(prev => ({ ...prev, whatsapp_number: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsWhatsappSame(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, whatsapp_number: prev.phone_number }));
    }
  };

  const nextStep = () => {
    // Basic validation for current step
    if (step === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || formData.password !== formData.confirm_password) {
        setError(formData.password !== formData.confirm_password ? "Passwords do not match" : "Please fill all required fields");
        return;
      }
    }
    if (step === 2) {
      if (!formData.education_level || !formData.institution_name) {
        setError("Please fill all required fields");
        return;
      }
    }
    if (step === 3) {
        if (!formData.main_category_id || !formData.specialization_id) {
          setError("Please select your expertise");
          return;
        }
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mapping values to API expected types
      const payload = {
        ...formData,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year.toString()) : null,
        main_category_id: parseInt(formData.main_category_id),
        specialization_id: parseInt(formData.specialization_id),
        experience_years: Number(formData.experience_years || 0)
      };

      await authService.registerWriter(payload as any);
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}&role=WRITER`);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Mobile Number</Label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="0771234567" required />
            </div>
            <div className="flex items-center space-x-2 py-1">
              <Checkbox id="whatsapp_same" checked={isWhatsappSame} onChange={handleCheckboxChange} />
              <label htmlFor="whatsapp_same" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                WhatsApp number same as mobile
              </label>
            </div>
            {!isWhatsappSame && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input id="whatsapp_number" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} placeholder="0771234567" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} required />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="education_level">Education Level</Label>
              <Select id="education_level" name="education_level" value={formData.education_level} onChange={handleChange} required>
                <option value="">Select Level</option>
                {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution_name">University / Institute Name</Label>
              <Input id="institution_name" name="institution_name" value={formData.institution_name} onChange={handleChange} placeholder="University of..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academic_status">Academic Status</Label>
              <Select id="academic_status" name="academic_status" value={formData.academic_status} onChange={handleChange}>
                <option value="Currently Studying">Currently Studying</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduation_year">Graduation Year (Optional)</Label>
              <Input id="graduation_year" name="graduation_year" type="number" value={formData.graduation_year} onChange={handleChange} placeholder="2024" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="main_category_id">Main Academic Category</Label>
              <Select 
                id="main_category_id" 
                name="main_category_id" 
                value={formData.main_category_id} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization_id">Specialization</Label>
              <Select 
                id="specialization_id" 
                name="specialization_id" 
                value={formData.specialization_id} 
                onChange={handleChange} 
                disabled={!formData.main_category_id}
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => <option key={spec.id} value={spec.id}>{spec.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="bio">Short Bio / Expertise Summary</Label>
              <textarea 
                id="bio" 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Tell us about your academic strengths..."
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Colombo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Sri Lanka" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="national_id_number">NIC / Passport Number</Label>
              <Input id="national_id_number" name="national_id_number" value={formData.national_id_number} onChange={handleChange} placeholder="123456789V" required />
            </div>
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 mt-6">
              <h4 className="flex items-center gap-2 font-semibold text-primary mb-2">
                <ShieldCheck size={18} className="lucide lucide-shield-check" />
                Final Verification
              </h4>
              <p className="text-sm text-muted-foreground">
                By submitting, you agree to provide accurate information for academic verification purposes.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border border-border/50 shadow-xl shadow-primary/5 bg-card/80 backdrop-blur-sm overflow-hidden rounded-2xl">
      <div className="h-2 w-full bg-muted/30">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-in-out" 
          style={{ width: `${(step / 4) * 100}%` }} 
        />
      </div>
      <CardHeader className="space-y-4 lg:p-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
            Step {step} of 4
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "h-1.5 w-6 rounded-full transition-all duration-300", 
                  s === step ? "bg-accent w-10" : s < step ? "bg-primary/40" : "bg-muted"
                )} 
              />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            {step === 1 && "Basic Information"}
            {step === 2 && "Academic Background"}
            {step === 3 && "Expertise & Skills"}
            {step === 4 && "Identity & Location"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {step === 1 && "Start by creating your professional account"}
            {step === 2 && "Tell us about your educational qualifications"}
            {step === 3 && "Select your main categories and specializations"}
            {step === 4 && "Provide basic identity and location details"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="lg:px-10 lg:pb-10 pb-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 animate-in fade-in zoom-in-95 duration-300">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="min-h-[300px]">
            {renderStep()}
          </div>

          <div className="flex gap-4 pt-8 border-t border-border/50 mt-10">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-12 text-base font-bold border-2 hover:bg-muted/50 transition-all" 
                onClick={prevStep} 
                disabled={loading}
              >
                <ChevronLeft className="mr-2 size-5" /> Back
              </Button>
            )}
            {step < 4 ? (
              <Button 
                type="button" 
                className="flex-1 h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
                onClick={nextStep}
              >
                Next <ChevronRight className="ml-2 size-5" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="flex-1 h-12 text-base font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
                onClick={handleSubmit} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Register as Provider <CheckCircle2 className="ml-2 size-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Simple Icon component used in step 4
function ShieldCheck({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
