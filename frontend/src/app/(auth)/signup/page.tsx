"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/api/auth.api";
import AuthForm from "@/components/layout/AuthForm";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  const [form, setForm] = useState({
    OrganizationName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

    try {
      await register({
        organization: form.OrganizationName,
        email: form.Email,
        password: form.Password,
        confirmPassword: form.ConfirmPassword
      }).unwrap();

      router.push("./signin");
    } catch {}
  };

  return (
    <AuthForm
      header="Create Your Organization Account"
      subheader={<Subheader />}
      fields={[
        {
          name: "OrganizationName",
          type: "text",
          label: "Organization Name",
          value: form.OrganizationName,
          onChange: (e) => handleChange("OrganizationName", e.target.value),
          placeholder: "Enter your organization name",
        },
        {
          name: "Email",
          type: "email",
          label: "Contact Email",
          value: form.Email,
          onChange: (e) => handleChange("Email", e.target.value),
          placeholder: "Enter your email address",
        },
        {
          name: "Password",
          type: "password",
          label: "New Password",
          value: form.Password,
          onChange: (e) => handleChange("Password", e.target.value),
          placeholder: "Enter your new password",
          secured: true,
        },
        {
          name: "ConfirmPassword",
          type: "password",
          label: "Confirm New Password",
          value: form.ConfirmPassword,
          onChange: (e) => handleChange("ConfirmPassword", e.target.value),
          placeholder: "Confirm your new password",
          secured: true,
        },
      ]}
      buttontitle="Create new account"
      onclick={handleSubmit}
      footer={<Footer />}
    />
  );
};

export default Signup;

const Subheader = () => {
  return (
    <p className="text-[#ABABAB] text-lg sm:text-xl">
      Start managing appointments and resources more efficiently with{" "}
      <span className="text-[#2D36E0] font-semibold">LEKOTA</span>.
    </p>
  );
};

const Footer = () => {
  return (
    <div className="flex items-center gap-1 text-sm">
      Already have an account?{" "}
      <Link href="/signin">
        <p className="text-[#2D36E0]">Sign in</p>
      </Link>
    </div>
  );
};
