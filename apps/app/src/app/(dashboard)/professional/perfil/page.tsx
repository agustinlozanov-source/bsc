import type {
  AcademicDegree,
  Experience,
  ProfessionalProfileInput,
} from "@bsc/validators";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/professional/profile-form";

type UserRow = {
  first_name: string;
  last_name: string;
  phone: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
};

type ProfRow = {
  specialties: string[] | null;
  institutional_email: string | null;
  public_profile_slug: string | null;
  academic_degrees: AcademicDegree[] | null;
  professional_experience: Experience[] | null;
};

export default async function PerfilProfesionalPage() {
  await requireRole("professional");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRes = await supabase
    .from("user_profile")
    .select(
      "first_name, last_name, phone, bio, city, state, linkedin_url, instagram_url, website_url",
    )
    .eq("id", user!.id)
    .maybeSingle();
  const up = userRes.data as UserRow | null;

  const profRes = await supabase
    .from("professional_profile")
    .select(
      "specialties, institutional_email, public_profile_slug, academic_degrees, professional_experience",
    )
    .eq("user_id", user!.id)
    .maybeSingle();
  const pp = profRes.data as ProfRow | null;

  const initial: ProfessionalProfileInput = {
    firstName: up?.first_name ?? "",
    lastName: up?.last_name ?? "",
    phone: up?.phone ?? "",
    bio: up?.bio ?? "",
    city: up?.city ?? "",
    state: up?.state ?? "",
    linkedinUrl: up?.linkedin_url ?? "",
    instagramUrl: up?.instagram_url ?? "",
    websiteUrl: up?.website_url ?? "",
    institutionalEmail: pp?.institutional_email ?? "",
    publicProfileSlug: pp?.public_profile_slug ?? "",
    specialties: pp?.specialties ?? [],
    academicDegrees: pp?.academic_degrees ?? [],
    professionalExperience: pp?.professional_experience ?? [],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Profesional
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Mi perfil profesional
        </h1>
        <p className="mt-1 text-muted-foreground">
          Estos datos alimentan tu perfil público verificable.
        </p>
      </div>
      <ProfileForm initial={initial} />
    </div>
  );
}
