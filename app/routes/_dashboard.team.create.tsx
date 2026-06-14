import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const meta = () => [
  { title: "Tambah Anggota - Dashboard MaduraDev" },
];

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    instagram: "",
    linkedin: "",
    github: "",
    portfolio: "",
    order_index: 0,
    is_active: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase client not available");
      setLoading(false);
      return;
    }

    let avatar_url = null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, avatarFile);

      if (uploadError) {
        toast.error("Gagal mengupload foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
      avatar_url = publicUrl;
    }

    const { error } = await supabase.from("core_team").insert([
      { ...formData, avatar_url },
    ]);

    if (error) {
      toast.error("Gagal menambahkan anggota: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Anggota berhasil ditambahkan");
    navigate("/dashboard/team");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Anggota</h1>
          <p className="text-muted-foreground">
            Tambahkan anggota core team baru
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Anggota</CardTitle>
            <CardDescription>Data dasar anggota tim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nama lengkap" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input id="position" value={formData.position} onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))} placeholder="Frontend Developer" required />
              </div>
            </div>

            <div className="space-y-2">
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
                  <Input type="file" accept="image/*" onChange={handleAvatarChange} className="w-[250px]" disabled={loading} />
                  <p className="text-xs text-muted-foreground mt-2">Gunakan foto dengan aspek rasio 1:1 untuk hasil terbaik.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} placeholder="Full-stack developer, fokus di bidang..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Link profil social media</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" value={formData.instagram} onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))} placeholder="https://instagram.com/username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" value={formData.github} onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))} placeholder="https://github.com/username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input id="portfolio" value={formData.portfolio} onChange={(e) => setFormData((prev) => ({ ...prev, portfolio: e.target.value }))} placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan</CardTitle>
            <CardDescription>Status dan urutan tampilan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order_index">Urutan</Label>
                <Input id="order_index" type="number" value={formData.order_index} onChange={(e) => setFormData((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))} placeholder="0" />
                <p className="text-xs text-muted-foreground">Angka lebih kecil akan ditampilkan lebih dulu</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Status Aktif</Label>
                <p className="text-sm text-muted-foreground">Tampilkan anggota di website publik</p>
              </div>
              <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>) : "Simpan Anggota"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/team">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
