import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ControlledSelect, SelectItem } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import { MADURA_REGIONS, type MaduraRegion } from "@/lib/community";
import { ImageUpload } from "@/components/dashboard/image-upload";
import "leaflet/dist/leaflet.css";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const MADURA_CENTER: [number, number] = [-7.05, 113.4];

// Leaflet map picker component (client-only)
function CoordinatePicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    Promise.all([import("leaflet")]).then(
      ([L]) => {
        if (cancelled || !mapRef.current) return;

        // Fix default icon
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current).setView(MADURA_CENTER, 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add marker at current position if set
        if (latitude !== 0 && longitude !== 0) {
          markerRef.current = L.marker([latitude, longitude]).addTo(map);
        }

        // Click handler
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          onChange(
            parseFloat(lat.toFixed(6)),
            parseFloat(lng.toFixed(6))
          );

          // Update marker position
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(map);
          }
        });
      }
    );

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when lat/lng change externally
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (latitude !== 0 && longitude !== 0) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-lg border overflow-hidden"
    />
  );
}

export const meta = () => [
  { title: "Tambah Komunitas - Dashboard MaduraDev" },
];

export default function CreateCommunityPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    instagram: "",
    logo_url: null as string | null,
    latitude: 0,
    longitude: 0,
    region: "Bangkalan" as MaduraRegion,
    order_index: 0,
    is_active: true,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
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

    const { error } = await supabase.from("communities").insert([formData]);

    if (error) {
      toast.error("Gagal membuat komunitas: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Komunitas berhasil dibuat");
    navigate("/dashboard/communities");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/communities">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tambah Komunitas
          </h1>
          <p className="text-muted-foreground">
            Tambahkan komunitas baru ke peta Madura
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Komunitas</CardTitle>
            <CardDescription>Detail dasar tentang komunitas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Komunitas *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Bangkalan Dev"
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
                  placeholder="bangkalan-dev"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                  placeholder="bangkalandev"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region (Kabupaten) *</Label>
                <ControlledSelect
                  value={formData.region}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({
                      ...prev,
                      region: value as MaduraRegion,
                    }))
                  }
                >
                  {MADURA_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </ControlledSelect>
              </div>
            </div>

            <ImageUpload
              value={formData.logo_url}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, logo_url: url }))
              }
              folder="communities"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi di Peta</CardTitle>
            <CardDescription>
              Klik peta untuk menentukan lokasi komunitas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CoordinatePicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={(lat, lng) =>
                setFormData((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                }))
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="-7.05"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longitude: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="113.4"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan</CardTitle>
            <CardDescription>Status dan urutan komunitas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order_index">Urutan</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order_index: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <div>
                  <Label>Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan komunitas di peta
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
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
              "Simpan Komunitas"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/communities">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
