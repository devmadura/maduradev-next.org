import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, Image, Trash } from "lucide-react";
import { toast } from "sonner";

export const meta = () => [
  { title: "Settings - Dashboard MaduraDev" },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [templateTimestamp, setTemplateTimestamp] = useState(Date.now());
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [hasCustomTemplate, setHasCustomTemplate] = useState(false);
  const [resettingTemplate, setResettingTemplate] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    };
    getUser();

    const fetchTemplate = async () => {
      if (!supabase) return;
      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl("twibbon/template.png");
      
      try {
        const res = await fetch(publicUrl, { method: "HEAD" });
        if (res.ok) {
          setTemplatePreview(publicUrl);
          setHasCustomTemplate(true);
        }
      } catch (err) {
        console.error("Template check error:", err);
      }
    };
    fetchTemplate();
  }, []);

  const handleTemplateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/png") {
        toast.error("Format file harus PNG (transparan)");
        return;
      }
      setTemplateFile(file);
      setTemplatePreview(URL.createObjectURL(file));
    }
  };

  const handleTemplateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !templateFile) return;

    setUploadingTemplate(true);
    const { error } = await supabase.storage
      .from("images")
      .upload("twibbon/template.png", templateFile, {
        upsert: true,
        contentType: "image/png"
      });

    if (error) {
      toast.error("Gagal mengunggah template: " + error.message);
      setUploadingTemplate(false);
      return;
    }

    toast.success("Template Twibbon berhasil diperbarui");
    setTemplateFile(null);
    setHasCustomTemplate(true);
    setTemplateTimestamp(Date.now());
    setUploadingTemplate(false);
  };

  const handleResetTemplate = async () => {
    if (!supabase) return;

    if (!confirm("Apakah Anda yakin ingin menghapus template kustom dan kembali ke template default?")) {
      return;
    }

    setResettingTemplate(true);
    const { error } = await supabase.storage
      .from("images")
      .remove(["twibbon/template.png"]);

    if (error) {
      toast.error("Gagal menghapus template: " + error.message);
      setResettingTemplate(false);
      return;
    }

    toast.success("Template kustom berhasil dihapus. Kembali ke bingkai default.");
    setTemplatePreview(null);
    setHasCustomTemplate(false);
    setTemplateFile(null);
    setTemplateTimestamp(Date.now());
    setResettingTemplate(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (passwords.new !== passwords.confirm) {
      toast.error("Password baru tidak cocok");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });

    if (error) {
      toast.error("Gagal mengubah password: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Password berhasil diubah");
    setPasswords({ new: "", confirm: "" });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Kelola pengaturan akun admin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Admin</CardTitle>
          <CardDescription>Informasi akun yang sedang login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Twibbon</CardTitle>
          <CardDescription>
            Unggah bingkai template Twibbon kustom (format PNG transparan)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTemplateUpload} className="space-y-6">
            <div className="space-y-4">
              <Label>Preview Bingkai Aktif</Label>
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="relative w-36 h-36 rounded-2xl border border-dashed flex items-center justify-center bg-slate-900 overflow-hidden shrink-0">
                  {templatePreview && hasCustomTemplate ? (
                    <img
                      src={`${templatePreview}?t=${templateTimestamp}`}
                      alt="Active Twibbon Template"
                      className="w-full h-full object-contain"
                      onError={() => setHasCustomTemplate(false)}
                    />
                  ) : (
                    <div className="text-center p-3 text-xs text-muted-foreground flex flex-col items-center gap-2">
                      <Image className="h-8 w-8 opacity-40" />
                      <span>Bingkai Default Aktif</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3 flex-1">
                  <Input
                    type="file"
                    accept="image/png"
                    onChange={handleTemplateFileChange}
                    className="max-w-xs"
                    disabled={uploadingTemplate}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Unggah file gambar kustom format **PNG transparan** dengan aspek rasio **1:1 (Square)**, disarankan resolusi **1080x1080px**. Gambar ini akan menimpa bingkai bawaan pada halaman Twibbon.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {templateFile && (
                      <Button type="submit" disabled={uploadingTemplate} className="flex items-center gap-2">
                        {uploadingTemplate ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Mengunggah...</>
                        ) : (
                          <><Upload className="h-4 w-4" /> Perbarui Template</>
                        )}
                      </Button>
                    )}
                    {hasCustomTemplate && !templateFile && (
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={resettingTemplate}
                        onClick={handleResetTemplate}
                        className="flex items-center gap-2"
                      >
                        {resettingTemplate ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</>
                        ) : (
                          <><Trash className="h-4 w-4" /> Reset ke Default</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>Perbarui password akun untuk keamanan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <Input id="new-password" type="password" value={passwords.new} onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))} placeholder="Minimal 6 karakter" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input id="confirm-password" type="password" value={passwords.confirm} onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))} placeholder="Ulangi password baru" required />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>) : "Ubah Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
