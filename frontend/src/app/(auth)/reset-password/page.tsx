"use client";

import AuthForm from "@/components/layout/AuthForm";
import Modal from "@/components/ui/modal";
import { useResetPasswordMutation } from "@/redux/api/auth.api";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const ResetPassword = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [resetPassword] = useResetPasswordMutation();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.password || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await resetPassword({
      token,
      ...form,
    });

    if (res) setOpen(true);
  };

  return (
    <>
      <AuthForm
        header="Reset Password"
        fields={[
          {
            name: "password",
            type: "password",
            label: "New Password",
            value: form.password,
            onChange: (e) => handleChange("password", e.target.value),
            placeholder: "Enter your new password",
            secured: true,
          },
          {
            name: "confirmPassword",
            type: "password",
            label: "Confirm New Password",
            value: form.confirmPassword,
            onChange: (e) => handleChange("confirmPassword", e.target.value),
            placeholder: "Confirm your new password",
            secured: true,
          },
        ]}
        buttontitle="Reset password"
        onclick={handleSubmit}
      />
      <Modal
        header="Your password has been successfully reset"
        href="/signin"
        link="Back to Login"
        visible={open}
      />
    </>
  );
};

export default ResetPassword;
