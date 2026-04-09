"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "../ui/modal";
import { useCreateTenantMutation } from "@/redux/api/admin.api";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateTenantModal = ({ open, onOpenChange }: Props) => {
  const [createTenant, { isLoading }] = useCreateTenantMutation();
  const [show, setShow] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createTenant(form).unwrap();

      setForm({ name: "", organization: "", email: "" });
      onOpenChange(false);
      setShow(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col gap-10 w-2xl! max-w-[90%]! p-10"
        >
          <DialogHeader className="w-full items-center">
            <DialogTitle className="text-2xl">Tenant Creation</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-5">
            {/* Tenant Name */}
            <Input
              name="tenantName"
              type="text"
              label="Tenant Name"
              placeholder="Enter tenant admin name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            {/* Organization */}
            <Input
              name="organization"
              type="text"
              label="Tenant Organization"
              placeholder="Enter tenant organization name"
              value={form.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
            />

            {/* Email */}
            <Input
              name="email"
              type="email"
              label="Contact Email"
              placeholder="Enter tenant email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {/* Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                !form.name || !form.organization || !form.email || isLoading
              }
              className="w-full text-base py-6! mt-5 cursor-pointer bg-[#2D36E0] disabled:bg-[#2D36E0]/40"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {isLoading ? "Creating Tenant..." : "Create Tenant"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Modal
        header="Your tenant organization has been created successfully"
        body="An email with the tenant's ID and password has been sent to the tenant's email"
        href="/dashboard/admin/tenants"
        link="Access Dashboard"
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default CreateTenantModal;
