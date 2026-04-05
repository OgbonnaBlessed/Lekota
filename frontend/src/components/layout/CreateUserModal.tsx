/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Modal from "../ui/modal";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useCreateUserMutation } from "@/redux/api/tenant.api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const roles = ["staff", "client"];

const roleMap: any = {
  staff: "staff",
  client: "client",
};

const CreateUserModal = ({ open, onOpenChange }: Props) => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [show, setShow] = useState<boolean>(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await createUser({
      name: form.name,
      email: form.email,
      role: roleMap[form.role],
    });
    setShow(true);

    setForm({ name: "", email: "", role: "" });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col gap-10 w-2xl! max-w-[90%]! p-10"
        >
          <DialogHeader className="w-full items-center">
            <DialogTitle className="text-2xl">New User</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-6">
            {/* Users' Name */}

            <Input
              name="name"
              type="text"
              label="Users' Name"
              placeholder="Enter users' name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {/* User Role Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Users&apos; Role</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between text-base border border-gray-300 rounded-xl px-4 py-6 text-gray-400"
                  >
                    {form.role || "Select users' role"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandEmpty>No role found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((item: any) => (
                        <CommandItem
                          key={item}
                          onSelect={() => handleChange("role", item)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          {item}
                          {form.role === item && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Button */}
            <Button
              onClick={handleSubmit}
              disabled={!form.name || !form.role || !form.email || isLoading}
              className="w-full text-base py-6! mt-5 cursor-pointer bg-[#2D36E0] disabled:bg-[#2D36E0]/40"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {isLoading ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Modal
        header="Your new user has been created"
        body="An email with the users' id and password has been sent to the provided email"
        href="/dashboard/tenant/users"
        link="Access Dashboard"
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default CreateUserModal;
