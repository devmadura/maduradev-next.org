import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteTeamButtonProps {
  id: string;
  name: string;
  variant?: "icon" | "button";
  onSuccess?: () => void;
}

export function DeleteTeamButton({
  id,
  name,
  variant = "icon",
  onSuccess,
}: DeleteTeamButtonProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const loading = fetcher.state !== "idle";

  const handleDelete = () => {
    fetcher.submit(
      { id },
      { method: "post", action: "/auth/delete-team" }
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as { success: boolean; error?: string };
      if (data.success) {
        toast.success("Anggota berhasil dihapus");
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(data.error || "Gagal menghapus anggota");
      }
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  return (
    <>
      {variant === "button" ? (
        <Button variant="destructive" type="button" onClick={() => setOpen(true)} disabled={loading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Anggota
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} disabled={loading}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus "{name}" dari core team? Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)} disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menghapus...</>) : (<><Trash2 className="mr-2 h-4 w-4" />Hapus</>)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
