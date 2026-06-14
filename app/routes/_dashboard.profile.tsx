import { useState } from "react";
import { redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/_dashboard.profile";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, KeyRound } from "lucide-react";
import { toast } from "sonner";

export const meta: Route.MetaFunction = () => [
  { title: "My Profile - Dashboard MaduraDev" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw redirect("/login");

  const adminClient = createAdminClient();
  const { data: member } = await adminClient
    .from("core_team")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { member };
}

export default function ProfilePage() {
  const { member: initialMember } = useLoaderData<typeof loader>();
  const supabase = createBrowserClient();

  const [member, setMember] = useState(initialMember);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    member?.avatar_url || null
  );

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          Profil team tidak ditemukan. Hubungi admin.
        </p>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    let avatar_url = member?.avatar_url || null;

    if (avatarFile) {
      if (member?.avatar_url) {
        const urlParts = member.avatar_url.split("/images/");
        if (urlParts.length > 1) {
          const oldFilePath = urlParts[1];
          await supabase.storage.from("images").remove([oldFilePath]);
        }
      }

      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, avatarFile);

      if (uploadError) {
        toast.error("Gagal mengupload foto: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
      avatar_url = publicUrl;
    }

    const updates: Record<string, any> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      instagram: formData.get("instagram") as string,
      linkedin: formData.get("linkedin") as string,
      github: formData.get("github") as string,
      portfolio: formData.get("portfolio") as string,
    };

    if (avatar_url) updates.avatar_url = avatar_url;

    const { error } = await supabase
      .from("core_team")
      .update(updates)
      .eq("id", member.id);

    if (error) {
      toast.error("Gagal menyimpan profil: " + error.message);
    } else {
      toast.success("Profil berhasil diperbarui");
      setMember((prev: any) => ({ ...prev, ...updates }));
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error("Gagal mengubah password: " + error.message);
    } else {
      toast.success("Password berhasil diubah");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Edit profil kamu sebagai anggota core team MaduraDev
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Data ini akan ditampilkan di halaman team website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-4">
              <Label>Foto Profil</Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border border-dashed">
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </div>
                )}
                <div>
                  <Input type="file" accept="image/*" onChange={handleAvatarChange} className="w-[250px]" disabled={saving} />
                  <p className="text-xs text-muted-foreground mt-2">Gunakan foto dengan aspek rasio 1:1.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" defaultValue={member.name} required disabled={saving} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi / Bio</Label>
              <Textarea id="description" name="description" defaultValue={member.description || ""} placeholder="Ceritakan sedikit tentang kamu..." rows={4} disabled={saving} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input id="instagram" name="instagram" defaultValue={member.instagram || ""} placeholder="https://instagram.com/username" disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" name="linkedin" defaultValue={member.linkedin || ""} placeholder="https://linkedin.com/in/username" disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input id="github" name="github" defaultValue={member.github || ""} placeholder="https://github.com/username" disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input id="portfolio" name="portfolio" defaultValue={member.portfolio || ""} placeholder="https://yourwebsite.com" disabled={saving} />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>) : (<><Save className="mr-2 h-4 w-4" />Simpan Profil</>)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>Ganti password login kamu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" required disabled={changingPassword} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ketik ulang password baru" required disabled={changingPassword} />
            </div>
            <Button type="submit" variant="outline" disabled={changingPassword}>
              {changingPassword ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengubah...</>) : (<><KeyRound className="mr-2 h-4 w-4" />Ubah Password</>)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
