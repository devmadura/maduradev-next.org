import type { Route } from "./+types/_dashboard.events.$id";
import { Link, useLoaderData, useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  Download,
  Copy,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MapPin,
  FileSpreadsheet,
  ScanLine
} from "lucide-react";
import { toast } from "sonner";

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `RSVP: ${data?.event?.title || "Event Detail"} - Dashboard MaduraDev` },
  ];
};

export async function loader({ params }: Route.LoaderArgs) {
  const adminClient = createAdminClient();
  
  // 1. Fetch Event
  const { data: event, error: eventError } = await adminClient
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (eventError || !event) {
    throw new Response("Event not found", { status: 404 });
  }

  // 2. Fetch Registrations
  const { data: registrations, error: regError } = await adminClient
    .from("event_registrations")
    .select("*")
    .eq("event_id", event.id)
    .order("registered_at", { ascending: false });

  if (regError) {
    console.error("Error fetching registrations:", regError);
  }

  return {
    event,
    registrations: registrations || [],
  };
}

export default function EventRsvpDetailsPage() {
  const { event, registrations } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter/Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [kabupatenFilter, setKabupatenFilter] = useState("all");
  const [sortField, setSortField] = useState("registered_at"); // "name" | "registered_at"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Expanded Reasons State
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(new Set());

  const toggleReason = (id: string) => {
    setExpandedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    navigate(".", { replace: true });
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data berhasil disegarkan");
    }, 500);
  };

  // Filter & Sort Logic
  const filteredAndSortedRegistrations = useMemo(() => {
    // 1. Apply Search and Dropdown filter
    const filtered = registrations.filter((reg: any) => {
      const matchesSearch =
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.institution.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesKabupaten =
        kabupatenFilter === "all" || reg.kabupaten === kabupatenFilter;

      return matchesSearch && matchesKabupaten;
    });

    // 2. Apply Sort
    filtered.sort((a: any, b: any) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";

      if (sortField === "name") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        const timeA = new Date(a.registered_at).getTime();
        const timeB = new Date(b.registered_at).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }
    });

    return filtered;
  }, [registrations, searchQuery, kabupatenFilter, sortField, sortOrder]);

  // Pagination Logic
  const totalItems = filteredAndSortedRegistrations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedRegistrations = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRegistrations.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedRegistrations, currentPage]);

  // Export to CSV / Excel Helper
  const handleExport = (format: "csv" | "excel") => {
    if (filteredAndSortedRegistrations.length === 0) {
      toast.error("Tidak ada data peserta untuk di-export.");
      return;
    }

    const headers = [
      "No",
      "Nama Lengkap",
      "Email",
      "Nomor WhatsApp",
      "Instansi / Sekolah",
      "Kabupaten",
      "Role / Pekerjaan",
      "Alasan Ikut",
      "Tanggal Daftar",
      "Status"
    ];

    const rows = filteredAndSortedRegistrations.map((reg: any, index: number) => [
      index + 1,
      reg.name,
      reg.email,
      reg.whatsapp,
      reg.institution,
      reg.kabupaten,
      reg.role || "",
      reg.reason || "",
      new Date(reg.registered_at).toLocaleString("id-ID"),
      reg.status || "confirmed"
    ]);

    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const finalContent = format === "excel" ? "\uFEFF" + csvContent : csvContent;
    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rsvp_${event.slug}_${format === "excel" ? "excel" : "csv"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Berhasil mengekspor data ke format ${format === "excel" ? "Excel" : "CSV"}`);
  };

  // Copy all WA numbers helper
  const handleCopyAllWA = () => {
    if (registrations.length === 0) {
      toast.error("Tidak ada nomor WhatsApp peserta untuk disalin.");
      return;
    }
    const numbers = registrations.map((r: any) => r.whatsapp).join(", ");
    navigator.clipboard.writeText(numbers);
    toast.success("Berhasil menyalin semua nomor WhatsApp peserta ke papan klip!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke papan klip!");
  };

  // Stats Card Calculations
  const totalRegistrants = registrations.length;
  const isCapSet = !!event.max_attendees;
  const capPercent = isCapSet ? Math.min(100, Math.round((totalRegistrants / event.max_attendees!) * 100)) : 0;
  const remainingSeats = isCapSet ? Math.max(0, event.max_attendees! - totalRegistrants) : null;

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RSVP Peserta</h1>
            <p className="text-muted-foreground text-sm">
              Kelola data pendaftaran untuk event: <span className="font-semibold text-foreground">{event.title}</span>
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-9">
            <Link to={`/dashboard/events/${event.id}/checkin`}>
              <ScanLine className="mr-2 h-4 w-4 text-primary" />
              Buka Scanner Check-in
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-9">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyAllWA} className="h-9">
            <Copy className="mr-2 h-4 w-4" />
            Copy WA Semua
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="default" size="sm" onClick={() => handleExport("excel")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Registrants */}
        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase font-bold tracking-wider">Total Pendaftar</span>
            <Users className="h-5 w-5 text-primary/80" />
          </div>
          <div>
            <p className="text-3xl font-black text-foreground">{totalRegistrants}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isCapSet ? `Kuota Maksimal: ${event.max_attendees}` : "Tanpa batas kuota"}
            </p>
          </div>
        </div>

        {/* Slot Progress Bar */}
        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase font-bold tracking-wider">Kapasitas Kursi</span>
            <span className="text-xs font-bold text-foreground">{isCapSet ? `${capPercent}%` : "N/A"}</span>
          </div>
          <div className="pt-2">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${isCapSet ? capPercent : 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isCapSet ? `${totalRegistrants} terisi dari ${event.max_attendees} kuota` : "Kapasitas tidak dibatasi"}
            </p>
          </div>
        </div>

        {/* Remaining Seats */}
        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase font-bold tracking-wider">Sisa Kuota</span>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-foreground">
              {isCapSet ? remainingSeats : "∞"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isCapSet ? `${remainingSeats} kursi tersisa` : "Pendaftaran terus dibuka"}
            </p>
          </div>
        </div>

        {/* Check-in Stats */}
        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase font-bold tracking-wider">Sudah Hadir</span>
            <ScanLine className="h-5 w-5 text-primary/80" />
          </div>
          <div>
            <p className="text-3xl font-black text-foreground">
              {registrations.filter((r: any) => r.checked_in_at).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalRegistrants} peserta terdaftar
            </p>
          </div>
        </div>

        {/* Event Schedule */}
        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase font-bold tracking-wider">Waktu Pelaksanaan</span>
            <Calendar className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-xs space-y-1 text-foreground/95">
            <p className="font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {event.event_date}
            </p>
            <p className="font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              {event.event_time}
            </p>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter & Pengurutan Peserta</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Search Query */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, instansi..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 text-xs"
            />
          </div>

          {/* Kabupaten filter */}
          <div>
            <select
              value={kabupatenFilter}
              onChange={(e) => { setKabupatenFilter(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
            >
              <option value="all">Semua Kabupaten</option>
              <option value="Bangkalan">Bangkalan</option>
              <option value="Sampang">Sampang</option>
              <option value="Pamekasan">Pamekasan</option>
              <option value="Sumenep">Sumenep</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div>
            <select
              value={sortField}
              onChange={(e) => { setSortField(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
            >
              <option value="registered_at">Urutkan: Tanggal Daftar</option>
              <option value="name">Urutkan: Nama Lengkap</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
            >
              <option value="desc">Urutan: Terbaru / Descending</option>
              <option value="asc">Urutan: Terlama / Ascending</option>
            </select>
          </div>

        </div>
      </div>

      {/* Registrations List Table */}
      {paginatedRegistrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center bg-card/50">
          <Users className="w-12 h-12 mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground font-bold text-lg">Pendaftar tidak ditemukan</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Tidak ada data yang cocok dengan kriteria pencarian atau belum ada peserta yang mendaftar untuk event ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Instansi / Sekolah</TableHead>
                    <TableHead>Kabupaten</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead>Terdaftar Pada</TableHead>
                    <TableHead className="text-center">Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRegistrations.map((reg: any, index: number) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const isExpanded = expandedReasons.has(reg.id);
                    return (
                      <TableRow key={reg.id} className="hover:bg-muted/10 transition-colors">
                        
                        {/* Index */}
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {rowNumber}
                        </TableCell>

                        {/* Name */}
                        <TableCell className="font-semibold text-foreground whitespace-nowrap">
                          {reg.name}
                        </TableCell>

                        {/* Contacts */}
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <p className="font-medium text-foreground">{reg.email}</p>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="font-mono">{reg.whatsapp}</span>
                              <button 
                                onClick={() => copyToClipboard(reg.whatsapp)}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Salin nomor WhatsApp"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </TableCell>

                        {/* Institution */}
                        <TableCell className="text-xs font-medium text-foreground/80 max-w-[150px] truncate" title={reg.institution}>
                          {reg.institution}
                        </TableCell>

                        {/* Kabupaten */}
                        <TableCell>
                          <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] font-medium border border-border/20">
                            {reg.kabupaten}
                          </Badge>
                        </TableCell>

                        {/* Role */}
                        <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate" title={reg.role || "-"}>
                          {reg.role || <span className="opacity-40">-</span>}
                        </TableCell>

                        {/* Expandable Reason */}
                        <TableCell className="max-w-[200px]">
                          {reg.reason ? (
                            <div className="space-y-1 text-xs">
                              <p className={`text-muted-foreground leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                                {reg.reason}
                              </p>
                              {reg.reason.length > 50 && (
                                <button
                                  onClick={() => toggleReason(reg.id)}
                                  className="text-primary text-[10px] font-bold hover:underline transition-all block focus:outline-none"
                                >
                                  {isExpanded ? "Sembunyikan" : "Tampilkan Lengkap"}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="opacity-40 text-xs">-</span>
                          )}
                        </TableCell>

                        {/* Registered At */}
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(reg.registered_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                          <p className="text-[10px] opacity-75">
                            {new Date(reg.registered_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })} WIB
                          </p>
                        </TableCell>

                        {/* Check-in Status */}
                        <TableCell className="text-center">
                          {reg.checked_in_at ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                                ✅ Hadir
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(reg.checked_in_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
                              Belum Hadir
                            </Badge>
                          )}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
              <span className="text-xs text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="font-semibold text-foreground">{totalItems}</span> peserta
              </span>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className="h-8 w-8 text-xs font-semibold"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
