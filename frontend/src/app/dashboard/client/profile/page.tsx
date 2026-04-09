"use client";

import Animate from "@/components/layout/Animate";
import ProfileSkeleton from "@/components/ui/skeleton/ProfileSkeleton";
import { useGetClientProfileQuery } from "@/redux/api/client.api";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const { data, isLoading } = useGetClientProfileQuery({});
  const user = data;

  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) return <ProfileSkeleton />;

  return (
    <Animate>
      <div className="w-full flex flex-col border rounded-xl overflow-hidden">
        <div className="w-full flex items-center justify-between bg-gray-100 p-5">
          <h1 className="text-xl sm:text-xl">Profile</h1>
          <Link href="./profile/edit-profile">
            <Pencil className="p-0.5" />
          </Link>
        </div>

        <div className="flex justify-between gap-8 flex-wrap p-5">
          <div>
            <h2>{user?.name}</h2>
            <p>Name</p>
          </div>

          <div>
            <h2>{user?.email || "Not set"}</h2>
            <p>Email</p>
          </div>

          <div>
            <h2>{user?.location || "Not set"}</h2>
            <p>Location</p>
          </div>

          <div className="flex flex-col items-end">
            <h2>{user?.phone || "Not set"}</h2>
            <p>Phone</p>
          </div>
        </div>
      </div>
    </Animate>
  );
};

export default Page;
