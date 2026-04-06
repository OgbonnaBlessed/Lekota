"use client";

import ProfileSkeleton from "@/components/ui/skeleton/ProfileSkeleton";
import { useGetProfileQuery } from "@/redux/api/staff.api";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const { data, isLoading } = useGetProfileQuery({});
  const user = data;
  console.log("Profile:", user);

  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) return <ProfileSkeleton />;

  return (
    <div className="w-full flex flex-col border rounded-xl overflow-hidden">
      <div className="w-full flex items-center justify-between bg-gray-100 p-5">
        <h1 className="text-xl">Profile</h1>
        <Link href="./profile/edit-profile">
          <Pencil />
        </Link>
      </div>

      <div className="flex justify-between gap-8 flex-wrap p-5">
        <div>
          <h2>{user?.name}</h2>
          <p>Name</p>
        </div>

        <div>
          <h2>{user?.service}</h2>
          <p>Service</p>
        </div>

        <div>
          <h2>{user?.location}</h2>
          <p>Location</p>
        </div>

        <div>
          <h2>{user?.phone}</h2>
          <p>Phone</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
