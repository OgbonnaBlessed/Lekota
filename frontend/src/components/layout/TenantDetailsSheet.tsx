"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
                  tenant.status === "active"
                    ? "bg-green-500"
                    : tenant.status === "suspended"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <p className="capitalize">{tenant.status}</p>
            </div>
            <p className="font-medium capitalize">{tenant.subscription}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TenantDetailsSheet;
