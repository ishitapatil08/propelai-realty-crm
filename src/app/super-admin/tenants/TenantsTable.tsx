"use client";

import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MoreHorizontal, Edit, Ban, UserCheck, ArrowUpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { suspendTenant, activateTenant, impersonateTenant } from "@/lib/api/super-admin";

type Tenant = {
  id: string;
  name: string;
  status: string;
  plan: string;
  createdAt: Date;
  admins: number;
  mrr: number;
};

export function TenantsTable({ initialTenants }: { initialTenants: Tenant[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Admins</TableHead>
            <TableHead className="text-right">MRR</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialTenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>
                <StatusBadge status={tenant.status.toLowerCase()} />
              </TableCell>
              <TableCell>{tenant.plan}</TableCell>
              <TableCell className="text-right">{tenant.admins}</TableCell>
              <TableCell className="text-right tabular-nums">${tenant.mrr}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Tenant
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <form action={impersonateTenant.bind(null, tenant.id)} className="w-full">
                        <button type="submit" className="flex w-full items-center">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Impersonate
                        </button>
                      </form>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {tenant.status.toLowerCase() !== 'suspended' ? (
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                        onClick={async () => {
                          await suspendTenant(tenant.id);
                        }}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend Tenant
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950/50"
                        onClick={async () => {
                          await activateTenant(tenant.id);
                        }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate Tenant
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {initialTenants.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No tenants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
