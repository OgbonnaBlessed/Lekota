/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateUserStatusMutation } from "@/redux/api/tenant.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type User = {
  id: string;
  image: string;
  name: string;
  role: string;
  createdAt: string;
  status: string;
};

type Props = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const UserDetailsheet = ({ user, open, onOpenChange }: Props) => {
  const [updateStatus] = useUpdateUserStatusMutation();

  const handleStatusChange = async (status: string) => {
    if (!user) return;

    await updateStatus({
      userId: user.id || (user as any)._id,
      status,
    });
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-100 sm:w-125 outline-0">
        <SheetHeader>
          <SheetTitle className="text-xl!">User Details</SheetTitle>
        </SheetHeader>

        <div className="flex gap-8 p-5 mt-6 text-sm">
          <div className="flex flex-col gap-5">
            <p className="text-muted-foreground">User Name</p>
            <p className="text-muted-foreground">Role</p>
            <p className="text-muted-foreground">Status</p>
            <p className="text-muted-foreground">Organization</p>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-medium">{user.name}</p>
            <p className="font-medium">{user.role}</p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  user.status === "active"
                    ? "bg-green-500"
                    : user.status === "suspended"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {user.status}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("active")}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("suspended")}
                  >
                    Suspended
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("deleted")}
                  >
                    Deleted
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="font-medium">
              {(user as any)?.tenant?.organization || "—"}
            </p>{" "}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsheet;
