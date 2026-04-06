/* eslint-disable react-hooks/set-state-in-effect */
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
import { useEffect, useState } from "react";

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
  const [userStatus, setUserStatus] = useState<string | undefined>(
    user?.status,
  );

  const handleStatusChange = async (status: string) => {
    if (!user) return;

    await updateStatus({
      userId: user.id || (user as any)._id,
      status,
    });
  };

  useEffect(() => {
    if (user?.status) {
      setUserStatus(user?.status);
    }
  }, [user?.status]);

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-100 sm:w-125 outline-0">
        <SheetHeader>
          <SheetTitle className="text-xl!">User Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 p-5">
          <table>
            <tbody className="w-full text-sm">
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium align-top">
                  User name
                </td>
                <td className="py-2">{user.name}</td>
              </tr>
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium align-top">
                  Role
                </td>
                <td className="py-2">{user.role}</td>
              </tr>
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium align-top">
                  Status
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        userStatus === "active"
                          ? "bg-green-500"
                          : userStatus === "suspended"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="capitalize cursor-pointer"
                        >
                          {userStatus}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setUserStatus("active");
                            handleStatusChange("active");
                          }}
                        >
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setUserStatus("suspended");
                            handleStatusChange("suspended");
                          }}
                        >
                          Suspended
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setUserStatus("deleted");
                            handleStatusChange("deleted");
                          }}
                        >
                          Deleted
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium align-top">
                  Organization
                </td>
                <td className="py-2">
                  {(user as any)?.tenant?.organization || "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <div className="flex gap-8 p-5 mt-6 text-sm">
          <div className="flex flex-col gap-5">
            <p className="text-muted-foreground">User Name</p>
            <p className="text-muted-foreground">Role</p>
            <p className="text-muted-foreground">Status</p>
            <p className="text-muted-foreground">Organization</p>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-medium">{user.name}</p>
            <p className="font-medium">{user.role}</p>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsheet;
