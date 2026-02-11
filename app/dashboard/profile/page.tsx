"use client";

import { useState, useEffect } from "react";
import { getCurrentUserTeamMember, updateOwnTeamProfile, changePassword } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, KeyRound } from "lucide-react";
import { toast } from "sonner";
import type { CoreTeam } from "@/lib/supabase/types";

export default function ProfilePage() {
    const [member, setMember] = useState<CoreTeam | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        async function loadProfile() {
            const data = await getCurrentUserTeamMember();
            setMember(data);
            setLoading(false);
        }
        loadProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateOwnTeamProfile(formData);

        if (result.success) {
            toast.success("Profil berhasil diperbarui");
        } else {
            toast.error(result.error || "Gagal menyimpan profil");
        }
        setSaving(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("Password minimal 6 karakter");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Password tidak cocok");
            return;
        }

        setChangingPassword(true);
        const result = await changePassword(newPassword);

        if (result.success) {
            toast.success("Password berhasil diubah");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            toast.error(result.error || "Gagal mengubah password");
        }
        setChangingPassword(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                    Profil team tidak ditemukan. Hubungi admin.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">
                    Edit profil kamu sebagai anggota core team MaduraDev
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>
                        Data ini akan ditampilkan di halaman team website
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={member.name}
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi / Bio</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={member.description || ""}
                                placeholder="Ceritakan sedikit tentang kamu..."
                                rows={4}
                                disabled={saving}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <Input
                                    id="instagram"
                                    name="instagram"
                                    defaultValue={member.instagram || ""}
                                    placeholder="https://instagram.com/username"
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    defaultValue={member.linkedin || ""}
                                    placeholder="https://linkedin.com/in/username"
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Profil
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Ubah Password</CardTitle>
                    <CardDescription>
                        Ganti password login kamu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Password Baru</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimal 6 karakter"
                                required
                                disabled={changingPassword}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ketik ulang password baru"
                                required
                                disabled={changingPassword}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={changingPassword}
                        >
                            {changingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengubah...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Ubah Password
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
