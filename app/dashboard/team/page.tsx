import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteTeamButton } from "@/components/dashboard/delete-team-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("core_team")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching team:", error);
    return [];
  }
  return data || [];
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Core Team</h1>
          <p className="text-muted-foreground">
            Kelola anggota core team MaduraDev
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/team/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Link>
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <p className="text-muted-foreground mb-4">Belum ada anggota team</p>
          <Button asChild>
            <Link href="/dashboard/team/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anggota Pertama
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Social</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar_url || ""} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {member.description || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          IG
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          LI
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "default" : "outline"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/team/${member.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteTeamButton id={member.id} name={member.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
