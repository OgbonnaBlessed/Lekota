"use client";

import AuthForm from "@/components/layout/AuthForm";
import Link from "next/link";
import { useLoginMutation } from "@/redux/api/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const [form, setForm] = useState({
    Email: "",
    Password: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await login({
        email: form.Email,
        password: form.Password,
      }).unwrap();

      // redirect based on role
      if (res.user.role === "admin") router.push("/dashboard/admin/overview");
      else if (res.user.role === "tenant_admin")
        router.push("/dashboard/tenant/overview");
      else if (res.user.role === "staff")
        router.push("/dashboard/staff/profile");
      else router.push("/dashboard/client/profile");
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthForm
      header="Welcome Back"
      subheader="Sign in to access your organization's scheduling dashboard."
      fields={[
        {
          name: "Email",
          type: "email",
          label: "Email Address",
          value: form.Email,
          onChange: (e) => handleChange("Email", e.target.value),
          placeholder: "Enter your email address",
        },
        {
          name: "Password",
          type: "password",
          label: "Password",
          value: form.Password,
          onChange: (e) => handleChange("Password", e.target.value),
          placeholder: "Enter your password",
          secured: true,
        },
      ]}
      nav="Forgot password"
      buttontitle="Sign in"
      onclick={handleSubmit}
      footer={<Footer />}
    />
  );
};

export default Signin;

const Footer = () => {
  return (
    <div className="flex items-center gap-1 text-sm">
      Don&apos;t have an account?{" "}
      <Link href="/signup">
        <p className="text-[#2D36E0]">Create account</p>
      </Link>
    </div>
  );
};
