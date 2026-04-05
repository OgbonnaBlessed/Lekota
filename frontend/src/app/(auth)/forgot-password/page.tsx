"use client";

import AuthForm from "@/components/layout/AuthForm";
import { useForgotPasswordMutation } from "@/redux/api/auth.api";
import Link from "next/link";
import { useState } from "react";

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  return (
    <AuthForm
      header="Forgot Password"
      subheader="No worries, we will send you reset instructions"
      fields={[
        {
          name: "Email",
          type: "email",
          label: "Email Address",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: "Enter your email address",
        },
      ]}
      buttontitle="Send reset instructions"
      onclick={async () => {
        await forgotPassword({ email });
      }}
      footer={<Footer />}
    />
  );
};

export default ForgotPassword;

const Footer = () => {
  return (
    <div className="flex items-center gap-1 text-sm">
      Back to main page?{" "}
      <Link href="/signup">
        <p className="text-[#2D36E0]">Create account</p>
      </Link>
    </div>
  );
};
