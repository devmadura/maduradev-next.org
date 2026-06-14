import { useState } from "react";
import { useRevalidator, useFetcher } from "react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface GenerateAccountButtonProps {
  teamMemberId: string;
  memberName: string;
}

export function GenerateAccountButton({ teamMemberId, memberName }: GenerateAccountButtonProps) {
  const revalidator = useRevalidator();
  const fetcher = useFetcher();
  const [showDialog, setShowDialog] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loading = fetcher.state !== "idle";

  const handleGenerate = async () => {
    fetcher.submit({ teamMemberId }, { method: "post", action: "/auth/generate-account" });
  };

  const data = fetcher.data as any;
  if (data && !showDialog && !credentials) {
    if (data.success && data.email && data.password) {
      setCredentials({ email: data.email, password: data.password });
      setShowDialog(true);
    } else if (data.error) {
      toast.error(data.error);
    }
  }

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDialogClose = (open: boolean) => {
    setShowDialog(open);
    if (!open) revalidator.revalidate();
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
        {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <UserPlus className="mr-1 h-3 w-3" />}
        Generate
      </Button>

      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Akun Berhasil Dibuat</DialogTitle>
            <DialogDescription>Akun login untuk <strong>{memberName}</strong> telah dibuat.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Simpan credentials ini sekarang. Password tidak bisa dilihat lagi setelah dialog ini ditutup.
                </p>
              </div>
            </div>

            {credentials && (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex gap-2">
                    <Input value={credentials.email} readOnly />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(credentials.email, "email")}>
                      {copiedField === "email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex gap-2">
                    <Input value={credentials.password} readOnly />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(credentials.password, "password")}>
                      {copiedField === "password" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button className="w-full" variant="outline" onClick={() => handleCopy(`Email: ${credentials.email}\nPassword: ${credentials.password}`, "all")}>
                  {copiedField === "all" ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copy Semua
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
