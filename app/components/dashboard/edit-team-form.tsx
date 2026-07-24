import { useState, useEffect } from "react";
import { useNavigate, Link, useFetcher } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CoreTeam } from "@/lib/supabase/types";
import { DeleteTeamButton } from "@/components/dashboard/delete-team-button";


interface EditTeamFormProps {
  member: CoreTeam;
  initialPermissions?: {
    can_manage_events: boolean;
    can_manage_media: boolean;
  };
}

export function EditTeamForm({ member, initialPermissions }: EditTeamFormProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: member.name,
    position: member.position,
    description: member.description || "",
    instagram: member.instagram || "",
    linkedin: member.linkedin || "",
    github: member.github || "",
    portfolio: member.portfolio || "",
    order_index: member.order_index,
    is_active: member.is_active,
  });

  const [permissions, setPermissions] = useState({
    can_manage_events: initialPermissions?.can_manage_events || false,
    can_manage_media: initialPermissions?.can_manage_media || false,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(member.avatar_url || null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    let avatar_url = member.avatar_url;

    if (avatarFile) {
      if (member.avatar_url) {
        const urlParts = member.avatar_url.split("/images/");
        if (urlParts.length > 1) {
          await supabase.storage.from("images").remove([urlParts[1]]);
        }
      }
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, avatarFile);
      if (uploadError) { toast.error("Gagal mengupload foto: " + uploadError.message); setLoading(false); return; }

      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
      avatar_url = publicUrl;
    }

    fetcher.submit(
      {
        name: formData.name,
        position: formData.position,
        description: formData.description,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        order_index: formData.order_index.toString(),
        is_active: formData.is_active.toString(),
        avatar_url: avatar_url || "",
        can_manage_events: permissions.can_manage_events.toString(),
        can_manage_media: permissions.can_manage_media.toString(),
      },
      { method: "post" }
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as { success: boolean; error?: string };
      setLoading(false);
      if (data.success) {
        toast.success("Anggota berhasil diupdate");
        navigate("/dashboard/team");
      } else {
        toast.error(data.error || "Gagal mengupdate anggota");
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/dashboard/team"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Anggota</h1>
          <p className="text-muted-foreground">Update informasi anggota team</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Informasi Anggota</CardTitle><CardDescription>Data profil anggota team</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label>Foto Profil</Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? <img src={avatarPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border" /> : <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border border-dashed"><span className="text-xs text-muted-foreground">Upload</span></div>}
                <div><Input type="file" accept="image/*" onChange={handleAvatarChange} className="w-[250px]" /><p className="text-xs text-muted-foreground mt-2">Gunakan foto dengan aspek rasio 1:1.</p></div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="name">Nama Lengkap *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required /></div>
              <div className="space-y-2"><Label htmlFor="position">Posisi *</Label><Input id="position" value={formData.position} onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={3} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Media</CardTitle><CardDescription>Link profil social media</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="instagram">Instagram</Label><Input id="instagram" value={formData.instagram} onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="github">GitHub</Label><Input id="github" value={formData.github} onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="portfolio">Portfolio URL</Label><Input id="portfolio" value={formData.portfolio} onChange={(e) => setFormData((prev) => ({ ...prev, portfolio: e.target.value }))} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pengaturan</CardTitle><CardDescription>Status dan urutan tampilan</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="order_index">Urutan</Label><Input id="order_index" type="number" value={formData.order_index} onChange={(e) => setFormData((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div className="flex items-center justify-between"><div><Label>Status Aktif</Label><p className="text-sm text-muted-foreground">Tampilkan anggota di website publik</p></div><Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} /></div>
          </CardContent>
        </Card>

        {member.user_id && (
          <Card>
            <CardHeader>
              <CardTitle>Akses Dashboard</CardTitle>
              <CardDescription>Atur hak akses dashboard untuk anggota ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Kelola Event</Label>
                  <p className="text-xs text-muted-foreground">Izinkan anggota ini menambah, mengedit, dan menghapus event</p>
                </div>
                <Switch
                  checked={permissions.can_manage_events}
                  onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, can_manage_events: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Kelola Media</Label>
                  <p className="text-xs text-muted-foreground">Izinkan anggota ini mengelola berita (Kabar Dev) dan blog (Blog Dev)</p>
                </div>
                <Switch
                  checked={permissions.can_manage_media}
                  onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, can_manage_media: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>{loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>) : "Update Anggota"}</Button>
            <Button type="button" variant="outline" asChild><Link to="/dashboard/team">Batal</Link></Button>
          </div>
          <DeleteTeamButton id={member.id} name={member.name} variant="button" onSuccess={() => navigate("/dashboard/team")} />
        </div>
      </form>
    </div>
  );
}
