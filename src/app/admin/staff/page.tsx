import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { UserPlus, Phone as PhoneIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSession } from "@/lib/auth/session";
import { getTenantStaff } from "@/lib/api/tenant-admin";
import { redirect } from "next/navigation";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function StaffPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const staffMembers = await getTenantStaff(tenantId);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Staff"
        description={`${staffMembers.length} team member${staffMembers.length !== 1 ? "s" : ""} in your organisation.`}
        action={
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Staff
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No staff members yet. Invite your first team member!
                </TableCell>
              </TableRow>
            ) : (
              staffMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(member.name ?? "?")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-primary/10 text-primary capitalize">
                      {member.role?.replace("_", " ") ?? "staff"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.phone ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <PhoneIcon className="w-3.5 h-3.5" />
                        {member.phone}
                      </div>
                    ) : (
                      <span className="italic text-muted-foreground/60 text-sm">No phone</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(member.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
