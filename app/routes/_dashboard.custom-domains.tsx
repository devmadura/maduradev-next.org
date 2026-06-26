import type { Route } from "./+types/_dashboard.custom-domains";
import { useLoaderData, useFetcher, Link } from "react-router";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  listDnsRecords,
  createDnsRecord,
  updateDnsRecord,
  deleteDnsRecord,
  type NamecomDnsRecord,
} from "@/lib/namecom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Globe,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { redirect } from "react-router";

export const meta: Route.MetaFunction = () => [
  { title: "Domains - Dashboard MaduraDev" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect("/login");
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw redirect("/dashboard/profile");
  }

  const domain = process.env.NAMECOM_DOMAIN || "madura.dev";
  const credentialsConfigured = !!(
    process.env.NAMECOM_USERNAME && process.env.NAMECOM_API_TOKEN
  );

  // Fetch local custom domains
  const { data: dbDomains, error: dbError } = await adminClient
    .from("custom_domains")
    .select("*")
    .order("subdomain", { ascending: true });

  if (dbError) {
    console.error("Error fetching local custom domains:", dbError);
  }

  // Fetch live DNS records from Name.com Core API if credentials are set
  let namecomRecords: NamecomDnsRecord[] = [];
  let namecomError: string | null = null;

  if (credentialsConfigured) {
    try {
      namecomRecords = await listDnsRecords(domain);
    } catch (e: any) {
      namecomError = e.message || "Failed to fetch DNS records from Name.com";
    }
  }

  return {
    dbDomains: dbDomains || [],
    namecomRecords,
    namecomError,
    domain,
    credentialsConfigured,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const supabase = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "Forbidden: Admin access required." };
  }

  const domain = process.env.NAMECOM_DOMAIN || "madura.dev";
  const credentialsConfigured = !!(
    process.env.NAMECOM_USERNAME && process.env.NAMECOM_API_TOKEN
  );

  if (!credentialsConfigured) {
    return {
      success: false,
      error: "Name.com credentials are not configured on the server.",
    };
  }

  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "create") {
    const subdomain = (formData.get("subdomain") as string || "")
      .trim()
      .toLowerCase();
    const recordType = formData.get("record_type") as string;
    const target = (formData.get("target") as string || "").trim();
    const ttlStr = formData.get("ttl") as string;
    const ttl = parseInt(ttlStr, 10) || 300;

    // Validation
    if (!subdomain) return { success: false, error: "Subdomain is required" };
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return {
        success: false,
        error:
          "Subdomain must contain only lowercase alphanumeric characters and hyphens.",
      };
    }
    if (!recordType) return { success: false, error: "Record Type is required" };
    if (!target) return { success: false, error: "Target / Value is required" };
    if (ttl < 300) return { success: false, error: "TTL must be at least 300 seconds." };

    // Check duplicate record locally (match subdomain, type, and target to avoid exact duplicates)
    const { data: existing } = await adminClient
      .from("custom_domains")
      .select("id")
      .eq("subdomain", subdomain)
      .eq("record_type", recordType)
      .eq("target", target)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `DNS record untuk subdomain '${subdomain}' dengan tipe '${recordType}' dan target ini sudah terdaftar.`,
      };
    }

    try {
      // 1. Create record in Name.com
      const record = await createDnsRecord(
        domain,
        subdomain,
        recordType,
        target,
        ttl
      );
      const namecomRecordId = record.id;

      if (!namecomRecordId) {
        return { success: false, error: "Name.com API did not return a record ID." };
      }

      // 2. Save locally in database
      const { error: insertError } = await adminClient
        .from("custom_domains")
        .insert({
          subdomain,
          record_type: recordType,
          target,
          ttl,
          namecom_record_id: String(namecomRecordId),
          status: "active",
          created_by: user.id,
        });

      if (insertError) {
        console.error("Local DB Insert Error:", insertError);
        return {
          success: false,
          error: `Record created on Name.com (ID: ${namecomRecordId}) but failed to save in database: ${insertError.message}.`,
        };
      }

      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || "Failed to create record on Name.com",
      };
    }
  }

  if (_action === "update") {
    const id = formData.get("id") as string;
    const subdomain = (formData.get("subdomain") as string || "")
      .trim()
      .toLowerCase();
    const recordType = formData.get("record_type") as string;
    const target = (formData.get("target") as string || "").trim();
    const ttlStr = formData.get("ttl") as string;
    const ttl = parseInt(ttlStr, 10) || 300;

    if (!id) return { success: false, error: "ID is required for update" };
    if (!subdomain) return { success: false, error: "Subdomain is required" };
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return {
        success: false,
        error:
          "Subdomain must contain only lowercase alphanumeric characters and hyphens.",
      };
    }
    if (!recordType) return { success: false, error: "Record Type is required" };
    if (!target) return { success: false, error: "Target / Value is required" };
    if (ttl < 300) return { success: false, error: "TTL must be at least 300 seconds." };

    // Fetch existing record to get namecom_record_id
    const { data: dbRecord, error: fetchErr } = await adminClient
      .from("custom_domains")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !dbRecord) {
      return { success: false, error: "Record not found in local database." };
    }

    try {
      // 1. Update on Name.com
      await updateDnsRecord(
        domain,
        dbRecord.namecom_record_id,
        subdomain,
        recordType,
        target,
        ttl
      );

      // 2. Update locally
      const { error: updateError } = await adminClient
        .from("custom_domains")
        .update({
          subdomain,
          record_type: recordType,
          target,
          ttl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error("Local DB Update Error:", updateError);
        return {
          success: false,
          error: `Failed to update database record: ${updateError.message}`,
        };
      }

      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || "Failed to update record on Name.com",
      };
    }
  }

  if (_action === "delete") {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "ID is required for deletion" };

    // Fetch existing record to get namecom_record_id
    const { data: dbRecord, error: fetchErr } = await adminClient
      .from("custom_domains")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !dbRecord) {
      return { success: false, error: "Record not found in local database." };
    }

    try {
      // 1. Delete on Name.com
      try {
        await deleteDnsRecord(domain, dbRecord.namecom_record_id);
      } catch (namecomErr: any) {
        const errMsg = String(namecomErr.message || "").toLowerCase();
        // If the record was already deleted manually from Name.com, proceed with deleting locally
        if (!errMsg.includes("404") && !errMsg.includes("not found")) {
          throw namecomErr;
        }
      }

      // 2. Delete locally
      const { error: deleteError } = await adminClient
        .from("custom_domains")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Local DB Delete Error:", deleteError);
        return {
          success: false,
          error: `Failed to delete database record: ${deleteError.message}`,
        };
      }

      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || "Failed to delete record on Name.com",
      };
    }
  }

  if (_action === "import_from_namecom") {
    try {
      const liveRecords = await listDnsRecords(domain);

      const { data: dbRecords } = await adminClient
        .from("custom_domains")
        .select("namecom_record_id");

      const localIds = new Set(dbRecords?.map((r) => String(r.namecom_record_id)) || []);
      const supportedTypes = ["CNAME", "A", "AAAA", "TXT"];
      
      const recordsToImport = liveRecords.filter((r) => {
        const host = (r.host || "").trim().toLowerCase();
        const type = (r.type || "").toUpperCase();
        
        return (
          host &&
          host !== "@" &&
          supportedTypes.includes(type) &&
          !localIds.has(String(r.id))
        );
      });

      if (recordsToImport.length === 0) {
        return {
          success: true,
          message: "Semua subdomain di Name.com sudah terdaftar di database.",
        };
      }

      const inserts = recordsToImport.map((r) => ({
        subdomain: r.host.toLowerCase(),
        record_type: r.type,
        target: r.answer,
        ttl: r.ttl || 300,
        namecom_record_id: String(r.id),
        status: "active",
        created_by: user.id,
      }));

      const { error: insertError } = await adminClient
        .from("custom_domains")
        .insert(inserts);

      if (insertError) {
        console.error("Import Insert Error:", insertError);
        return {
          success: false,
          error: `Gagal menyimpan data impor: ${insertError.message}`,
        };
      }

      return {
        success: true,
        message: `Berhasil mengimpor ${recordsToImport.length} subdomain dari Name.com.`,
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || "Gagal mengimpor dari Name.com",
      };
    }
  }

  return { success: false, error: "Invalid action" };
}

export default function CustomDomainsPage() {
  const {
    dbDomains,
    namecomRecords,
    namecomError,
    domain,
    credentialsConfigured,
  } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const loading = fetcher.state !== "idle";

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [subdomain, setSubdomain] = useState("");
  const [recordType, setRecordType] = useState("CNAME");
  const [target, setTarget] = useState("");
  const [ttl, setTtl] = useState(300);

  // Deletion State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<any | null>(null);

  // Form Reset and Sync on Success
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as { success: boolean; error?: string; message?: string };
      if (data.success) {
        toast.success(
          data.message || (
            editingRecord
              ? "Subdomain berhasil diubah"
              : deletingRecord
                ? "Subdomain berhasil dihapus"
                : "Subdomain berhasil ditambahkan"
          )
        );
        setIsFormOpen(false);
        setIsDeleteOpen(false);
        setEditingRecord(null);
        setDeletingRecord(null);
        resetForm();
      } else {
        toast.error(data.error || "Terjadi kesalahan");
      }
    }
  }, [fetcher.state, fetcher.data]);

  const resetForm = () => {
    setSubdomain("");
    setRecordType("CNAME");
    setTarget("");
    setTtl(300);
  };

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (record: any) => {
    setEditingRecord(record);
    setSubdomain(record.subdomain);
    setRecordType(record.record_type);
    setTarget(record.target);
    setTtl(record.ttl);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (record: any) => {
    setDeletingRecord(record);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain) {
      toast.error("Subdomain tidak boleh kosong");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      toast.error(
        "Subdomain hanya boleh berisi huruf kecil, angka, dan strip (-)"
      );
      return;
    }
    if (!target) {
      toast.error("Target tidak boleh kosong");
      return;
    }
    if (ttl < 300) {
      toast.error("TTL minimal 300 detik");
      return;
    }

    fetcher.submit(
      {
        _action: editingRecord ? "update" : "create",
        id: editingRecord?.id || "",
        subdomain,
        record_type: recordType,
        target,
        ttl: String(ttl),
      },
      { method: "post" }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingRecord) return;
    fetcher.submit(
      {
        _action: "delete",
        id: deletingRecord.id,
      },
      { method: "post" }
    );
  };

  // Helper to verify if the record actually exists on Name.com
  const getRecordSyncStatus = (record: any) => {
    if (namecomError) {
      return {
        label: "API Error",
        variant: "destructive" as const,
        icon: AlertCircle,
        desc: "Koneksi ke Name.com terganggu",
      };
    }
    const match = namecomRecords.find(
      (r) => String(r.id) === String(record.namecom_record_id)
    );
    if (match) {
      return {
        label: "Aktif",
        variant: "default" as const,
        icon: CheckCircle2,
        desc: "Record aktif dan tersinkronisasi di Name.com",
      };
    }
    return {
      label: "Tidak Sinkron",
      variant: "destructive" as const,
      icon: AlertCircle,
      desc: "Record terhapus secara manual di Name.com",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Domain Management</h1>
          <p className="text-muted-foreground">
            Kelola DNS Record subdomain untuk domain{" "}
            <span className="font-semibold text-foreground underline decoration-primary">
              {domain}
            </span>{" "}
            tanpa harus masuk ke Name.com
          </p>
        </div>
        <div className="flex gap-3">
          <fetcher.Form method="post">
            <input type="hidden" name="_action" value="import_from_namecom" />
            <Button
              type="submit"
              variant="outline"
              disabled={loading || !credentialsConfigured}
            >
              {loading && fetcher.formData?.get("_action") === "import_from_namecom" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengimpor...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Impor dari Name.com
                </>
              )}
            </Button>
          </fetcher.Form>
          <Button onClick={handleOpenAddModal} disabled={!credentialsConfigured}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Subdomain
          </Button>
        </div>
      </div>

      {/* Warnings & Notices */}
      {!credentialsConfigured && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Kredensial API Belum Dikonfigurasi</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              NAMECOM_USERNAME dan NAMECOM_API_TOKEN harus diset di environment
              variables server agar fitur ini berfungsi.
            </p>
          </div>
        </div>
      )}

      {namecomError && credentialsConfigured && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-4 text-sm text-yellow-700 dark:text-yellow-500">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Koneksi Name.com Bermasalah</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gagal menyinkronkan status record langsung dari Name.com:{" "}
              {namecomError}
            </p>
          </div>
        </div>
      )}

      {/* Database Listing Table */}
      {dbDomains.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 bg-card">
          <Globe className="h-12 w-12 text-muted-foreground/30 mb-4 animate-pulse" />
          <p className="text-muted-foreground mb-4">
            Belum ada subdomain yang didaftarkan.
          </p>
          <Button
            onClick={handleOpenAddModal}
            disabled={!credentialsConfigured}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Subdomain Pertama
          </Button>
        </div>
      ) : (
        <div className="rounded-md border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subdomain</TableHead>
                <TableHead>Record Type</TableHead>
                <TableHead>Target / Answer</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dbDomains.map((record: any) => {
                const statusInfo = getRecordSyncStatus(record);
                const IconComponent = statusInfo.icon;
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary font-semibold">
                          {record.subdomain}
                        </span>
                        <span className="text-muted-foreground">.{domain}</span>
                        <a
                          href={`http://${record.subdomain}.${domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Buka website"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.record_type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs">
                      {record.target}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {record.ttl}s
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1.5 cursor-help"
                        title={statusInfo.desc}
                      >
                        <Badge variant={statusInfo.variant}>
                          <IconComponent className="mr-1 h-3 w-3 inline" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(record)}
                          disabled={!credentialsConfigured || loading}
                          title="Edit Record"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteModal(record)}
                          disabled={!credentialsConfigured || loading}
                          title="Hapus Record"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Form Modal Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "Edit DNS Record" : "Tambah DNS Record"}
            </DialogTitle>
            <DialogDescription>
              {editingRecord
                ? "Ubah data DNS record subdomain Anda di bawah ini."
                : "Masukkan detail subdomain baru untuk dideploy langsung ke Name.com."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="contoh: event, dashboard"
                  disabled={loading}
                  required
                />
                <span className="text-sm font-semibold text-muted-foreground shrink-0 select-none">
                  .{domain}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Hanya gunakan huruf kecil, angka, dan tanda strip (-)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record_type">Record Type</Label>
              <Select
                id="record_type"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                disabled={loading}
              >
                <option value="CNAME">CNAME (Alias)</option>
                <option value="A">A (IPv4)</option>
                <option value="AAAA">AAAA (IPv6)</option>
                <option value="TXT">TXT (Text)</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target / Answer</Label>
              <Input
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={
                  recordType === "CNAME"
                    ? "cname.vercel-dns.com."
                    : recordType === "A"
                      ? "192.168.1.1"
                      : "Value/target record"
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ttl">TTL (Seconds)</Label>
              <Input
                id="ttl"
                type="number"
                value={ttl}
                onChange={(e) => setTtl(parseInt(e.target.value) || 300)}
                placeholder="300"
                disabled={loading}
                min={300}
                required
              />
              <p className="text-[10px] text-muted-foreground">
                Minimal 300 detik (5 menit)
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingRecord ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambahkan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HelpCircle className="h-5 w-5" />
              Hapus Subdomain?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus subdomain{" "}
              <span className="font-semibold text-foreground">
                {deletingRecord?.subdomain}.{domain}
              </span>
              ? DNS record di Name.com akan ikut terhapus dan website yang
              menggunakan subdomain ini tidak akan bisa diakses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => setIsDeleteOpen(false)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Permanen
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
