"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            <span className="text-xl">🔒</span>
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Session expired
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            Your session has expired or you are not signed in. Please log in
            again to continue.
          </p>

          {/* CTA */}
          <Link href="/signin" className="w-full">
            <div className="w-full bg-[#2D36E0] text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition">
              Go to Sign in
            </div>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = user?.tenant?.subscription?.status === "expired";

  if (isExpired) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">⛔</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900">
            Subscription expired
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            Your free trial has ended. To continue using your dashboard, please
            renew your subscription.
          </p>

          {/* CTA */}
          <button
            onClick={async () => {
              try {
                const res = await fetch(
                  "http://localhost:5000/api/payments/initialize",
                  {
                    method: "POST",
                  },
                );
                const data = await res.json();
                window.location.href = data?.data?.authorization_url;
              } catch (err) {
                console.error(err);
              }
            }}
            className="w-full bg-[#2D36E0] text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Renew Subscription
          </button>

          {/* Secondary Action */}
          <Link href="/signin" className="text-xs text-gray-400 underline">
            Switch account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />

      <main className="relative min-h-screen flex-1 grow flex flex-col">
        <SidebarTrigger
          size="lg"
          className="md:hidden fixed right-5 top-5 bg-black/10 p-2 rounded-full pointer-events-auto z-10"
        />

        {/* Topbar */}
        <div className="md:pl-6">
          <div
            className={`w-full flex ${role === "staff" ? "flex-row" : "flex-col md:flex-row"} gap-4 items-center justify-between border-b py-4 pr-4`}
          >
            <h2
              className={`self-start text-lg font-medium capitalize pl-6 md:pl-0 ${role === "client" && "hidden md:block"}`}
            >
              {role.replace("_", " ")}
            </h2>

            {(role === "staff" || role === "client") && <Header />}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
