"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Event, EventFormat } from "@/lib/supabase/types";
import { ImageUpload } from "@/components/dashboard/image-upload";

interface EditEventFormProps {
  event: Event;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: event.title,
    slug: event.slug,
    image_url: event.image_url,
    format: event.format,
    description_small: event.description_small,
    description: event.description,
    location: event.location,
    event_date: event.event_date,
    event_time: event.event_time,
    url: event.url || "",
    is_online: event.is_online,
    is_new: event.is_new,
    is_published: event.is_published,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("events")
      .update(formData)
      .eq("id", event.id);

    if (error) {
      toast.error("Gagal mengupdate event: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Event berhasil diupdate");
    router.push("/dashboard/events");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">Update informasi event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Event</CardTitle>
            <CardDescription>Detail dasar tentang event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Event *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <ImageUpload
              value={formData.image_url}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, image_url: url }))
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="format">Format *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: EventFormat) =>
                    setFormData((prev) => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="bincang-bincang">Bincang-bincang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL Event</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://example.com/register"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_small">Deskripsi Singkat *</Label>
              <Textarea
                id="description_small"
                value={formData.description_small}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description_small: e.target.value,
                  }))
                }
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Lengkap (HTML)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waktu & Lokasi</CardTitle>
            <CardDescription>Kapan dan dimana event diadakan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event_date">Tanggal *</Label>
                <Input
                  id="event_date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      event_date: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_time">Waktu *</Label>
                <Input
                  id="event_time"
                  value={formData.event_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      event_time: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi (HTML)</Label>
              <Textarea
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan</CardTitle>
            <CardDescription>Status dan visibilitas event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Event Online</Label>
                <p className="text-sm text-muted-foreground">
                  Apakah event ini diadakan secara online?
                </p>
              </div>
              <Switch
                checked={formData.is_online}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_online: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Event Baru</Label>
                <p className="text-sm text-muted-foreground">
                  Tampilkan badge &quot;New&quot; pada event
                </p>
              </div>
              <Switch
                checked={formData.is_new}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_new: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Publish</Label>
                <p className="text-sm text-muted-foreground">
                  Tampilkan event di website publik
                </p>
              </div>
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_published: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Update Event"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/events">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
