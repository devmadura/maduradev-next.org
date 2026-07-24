import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ControlledSelect, SelectItem } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Eye, PenTool } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { marked } from "marked";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const meta = () => [
  { title: "Tambah Artikel - Dashboard MaduraDev" },
];

export default function CreateMediaPostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [htmlPreview, setHtmlPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    image_url: null as string | null,
    type: "kabar" as "kabar" | "blog",
    status: "draft" as "published" | "draft",
    published_at: "",
  });

  useEffect(() => {
    if (activeTab === "preview") {
      try {
        const parsed = marked.parse(formData.content || "") as string;
        setHtmlPreview(parsed);
      } catch (e) {
        setHtmlPreview("<p className='text-destructive'>Gagal mengurai Markdown.</p>");
      }
    }
  }, [activeTab, formData.content]);

  // Set default published_at to current time when loading form
  useEffect(() => {
    const localDateTime = new Date();
    // Format to YYYY-MM-DDThh:mm for datetime-local input value compatibility
    const offset = localDateTime.getTimezoneOffset();
    const localISO = new Date(localDateTime.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);
    setFormData((prev) => ({ ...prev, published_at: localISO }));
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase client tidak tersedia");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      setLoading(false);
      return;
    }

    // Format local datetime input string into standard UTC ISOString for PostgreSQL
    const publishDate = formData.published_at 
      ? new Date(formData.published_at).toISOString() 
      : new Date().toISOString();

    const payload = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      image_url: formData.image_url,
      type: formData.type,
      status: formData.status,
      published_at: publishDate,
      author_id: user.id,
    };

    const { error } = await supabase.from("media_posts").insert([payload]);

    if (error) {
      toast.error("Gagal membuat artikel: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Artikel berhasil diterbitkan/disimpan");
    navigate("/dashboard/media");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/media">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Artikel</h1>
          <p className="text-muted-foreground">
            Terbitkan pengumuman baru (Kabar Dev) atau tulisan teknis (Blog Dev)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Konten Artikel</CardTitle>
                <CardDescription>Masukkan isi utama tulisan Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Artikel *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Judul artikel menarik..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Ringkasan Singkat (Summary) *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, summary: e.target.value }))
                    }
                    placeholder="Ringkasan singkat untuk list artikel..."
                    rows={3}
                    required
                  />
                </div>

                {/* Editor vs Preview Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <Label>Isi Konten (Markdown) *</Label>
                    <div className="flex gap-1.5 p-0.5 bg-muted rounded-lg border">
                      <button
                        type="button"
                        onClick={() => setActiveTab("edit")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
                          activeTab === "edit"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" /> Tulis
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
                          activeTab === "preview"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Pratinjau
                      </button>
                    </div>
                  </div>

                  {activeTab === "edit" ? (
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      placeholder="Tulis artikel menggunakan format Markdown..."
                      rows={15}
                      className="font-mono text-sm leading-relaxed"
                      required
                    />
                  ) : (
                    <div className="border rounded-lg p-6 bg-card/50 min-h-[340px] max-h-[500px] overflow-y-auto">
                      <MarkdownRenderer content={htmlPreview} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Publikasi</CardTitle>
                <CardDescription>Konfigurasi publikasi artikel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug Artikel *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="slug-artikel-ini"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Artikel *</Label>
                  <ControlledSelect
                    value={formData.type}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, type: value as "kabar" | "blog" }))
                    }
                  >
                    <SelectItem value="kabar">Kabar Dev</SelectItem>
                    <SelectItem value="blog">Blog Dev</SelectItem>
                  </ControlledSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <ControlledSelect
                    value={formData.status}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, status: value as "published" | "draft" }))
                    }
                  >
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Diterbitkan</SelectItem>
                  </ControlledSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="published_at">Tanggal Terbit</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, published_at: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>Gambar thumbnail artikel</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, image_url: url }))
                  }
                  folder="media"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Artikel"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/media">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
