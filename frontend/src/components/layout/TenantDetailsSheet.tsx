/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateTenantStatusMutation } from "@/redux/api/admin.api";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";

type Tenant = {
  id: string;
  name: string;
  organization: string;
  createdAt: string;
  status: string;
  subscription: string;
};

type Props = {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TenantDetailsSheet = ({ tenant, open, onOpenChange }: Props) => {
  const [updateStatus] = useUpdateTenantStatusMutation();
  const [tenantStatus, setTenantStatus] = useState<string | undefined>(
    tenant?.status,
  );

  useEffect(() => {
    setTenantStatus(tenant?.status);
  }, [tenant?.status]);

  const handleStatusChange = async (status: string) => {
    if (!tenant) return;

    await updateStatus({
      tenantId: tenant.id || (tenant as any)._id,
      status,
    });
  };

  if (!tenant) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-100 sm:w-125 outline-0">
        <SheetHeader>
          <SheetTitle className="text-xl!">Tenant Details</SheetTitle>
        </SheetHeader>

        <div className="flex gap-8 p-5 mt-6 text-sm">
          <div className="flex flex-col gap-5">
            <p className="text-muted-foreground">Name</p>
            <p className="text-muted-foreground">ID</p>
            <p className="text-muted-foreground">Organization</p>
            <p className="text-muted-foreground">Status</p>
            <p className="text-muted-foreground">Subscription</p>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-medium">{tenant.name}</p>
            <p className="font-medium">{tenant.id}</p>
            <p className="font-medium">{tenant.organization}</p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  tenantStatus === "active"
                    ? "bg-green-500"
                    : tenantStatus === "suspended"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {tenantStatus}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setTenantStatus("active");
                      handleStatusChange("active");
                    }}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTenantStatus("suspended");
                      handleStatusChange("suspended");
                    }}
                  >
                    Suspended
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTenantStatus("deleted");
                      handleStatusChange("deleted");
                    }}
                  >
                    Deleted
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="font-medium capitalize">{tenant.subscription}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TenantDetailsSheet;
