/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Role, sidebarConfig } from "@/lib/sidebar-config";
import { useAppSelector } from "@/redux/hooks";
import { persistor } from "@/redux/store";
import { Home, LogOut, PanelLeft, Shield, Stars } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../ui/modal";
import { logout } from "@/redux/slices/auth.slice";
import { useInitializePaymentMutation } from "@/redux/api/tenant.api";

export function AppSidebar({ role }: { role: Role }) {
  const router = useRouter();
  const [initializePayment] = useInitializePaymentMutation();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [show, setShow] = useState<boolean>(false);
  const [pay, setPay] = useState<boolean>(false);
  const pathname = usePathname();
  const links = sidebarConfig[role];
  const { toggleSidebar } = useSidebar();

  const shouldUseFallback =
    !user?.profile?.image ||
    user?.role === "tenant_admin" ||
    user?.role === "admin";

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  const handleLogout = async () => {
    router.push("/signin");
    setTimeout(async () => {
      dispatch(logout());
      await persistor.purge();
    }, 500);
  };

  const handlePayment = async () => {
    const res: any = await initializePayment({});

    const url = res?.data?.data?.authorization_url;

    if (url) {
      window.location.href = url;
    }
  };

  return (
    <>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu className="mt-5 group-data-[collapsible=icon]:mt-7">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                onClick={() => toggleSidebar()}
                className="group w-full"
              >
                <div className="w-full flex items-center justify-between group-data-[collapsible=icon]:justify-center p-4 cursor-pointer">
                  <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:py-4">
                    <Shield size={18} />
                  </div>
                  <span className="text-lg font-medium group-data-[collapsible=icon]:hidden">
                    LEKOTA
                  </span>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <PanelLeft size={18} />
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-4">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(`/dashboard${link.href}`);

                return (
                  <SidebarMenuItem
                    key={link.href}
                    className={`group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data- [collapsible=icon]:py-4 transition-all duration-300 rounded-lg
                    ${isActive && "bg-[#2D36E0]"} ${!isActive && "hover:bg-[#2D36E0]/10"}
                    `}
                  >
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className={`gap-4 px-8 py-5 hover:bg-customgreys-secondarybg group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center ${isActive && "text-white!"}`}
                    >
                      <Link
                        href={`/dashboard${link.href}`}
                        scroll={false}
                        className="relative flex items-center hover:bg-[#2D36E0]/10"
                      >
                        <Icon
                          className={isActive ? "text-white" : "text-black"}
                        />
                        <span
                          className={`font-medium text-md ml-4 group-data-[collapsible=icon]:hidden ${isActive ? "text-white" : "text-black"}`}
                        >
                          {link.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu className="w-full gap-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:py-4">
              {/* Pay for Lekota */}
              {role === "tenant_admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="w-fit hover:bg-transparent group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 transition-all duration-300 rounded-lg"
                  >
                    <button
                      onClick={() => setPay((prev) => !prev)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2D36E0]/10 transition"
                    >
                      <Stars size={18} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Pay for Lekota
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-fit hover:bg-transparent group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 transition-all duration-300 rounded-lg"
                >
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2D36E0]/10 transition"
                  >
                    <Home size={18} />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Home
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Logout */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-red-500/10 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 transition-all duration-300 rounded-lg"
                >
                  <button
                    onClick={() => setShow(true)}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg transition"
                  >
                    <LogOut size={18} />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Logout
                    </span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Divider */}
              <div className="my-2 h-px bg-gray-200" />

              {/* User / Organization */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-fit hover:bg-transparent group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="relative w-7 min-w-5 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                      {shouldUseFallback ? (
                        <span className="text-xs font-semibold text-gray-700">
                          {firstLetter}
                        </span>
                      ) : (
                        <Image
                          src={user.profile.image}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="text-xs leading-tight group-data-[collapsible=icon]:hidden">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <Modal
        header="Are you sure you want to log out"
        body={
          <div className="flex items-center gap-8 text-white text-sm">
            <p
              onClick={() => setShow(false)}
              className="bg-[#2D36E0] p-3 rounded-lg cursor-pointer"
            >
              No, Stay in Lekota
            </p>
            <p
              onClick={handleLogout}
              className={`bg-[#ED301F] p-3 rounded-lg cursor-pointer`}
            >
              Yes, Log out
            </p>
          </div>
        }
        visible={show}
        onClose={() => setShow(false)}
      />

      <Modal
        header="Lekota Premium"
        body={
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs text-gray-500">
              Advanced scheduling infrastructure for growing organizations
            </p>
            <div className="flex items-baseline">
              <p className="text-lg font-medium">N1,000</p>
              <p className="text-[10px] text-[#ABABAB]">/Month</p>
            </div>

            <ul className="w-full px-5 list-disc space-y-2 text-xs">
              <li>Healthcare clinics with multiple practitioners</li>
              <li>University advisory or service departments</li>
              <li>
                Independent practices experiencing increased booking demand
              </li>
              <li>Care facilities managing multiple service units</li>
            </ul>
          </div>
        }
        href="/payment"
        link="Proceed to Payment"
        visible={pay}
        onClose={() => {setPay(false)}}
        onClick={handlePayment}
      />
    </>
  );
}
