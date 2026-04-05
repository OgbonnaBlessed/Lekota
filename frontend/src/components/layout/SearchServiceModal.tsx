import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type User = {
  image: string;
  name: string;
  services: string[];
};

const users: User[] = [
  {
    image: "/banner.png",
    name: "Jay Baxter",
    services: ["service 1", "service2"],
  },
  {
    image: "/banner.png",
    name: "Phillip Daniels",
    services: ["service 1"],
  },
  {
    image: "/banner.png",
    name: "Jacob Adeola",
    services: ["service 1"],
  },
];

const SearchServiceModal = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-8 w-2xl! max-w-[90%]! p-10"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="w-fit flex items-center bg-gray-100 rounded-lg pl-3 text-sm">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search services & staffs"
                className="bg-transparent border-none focus:outline-none p-3 placeholder:text-gray-400"
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-3xl font-medium">
            Service 1 (e.g Doctor)
          </h1>
          <p className="text-sm md:text-base">Pick from this list of staffs</p>
        </div>

        <div className="flex flex-col gap-5">
          {users.map((user, i) => (
            <Link key={i} href="./services/book-appointment">
              <div className="flex items-center gap-2">
                <div className="relative w-8 aspect-square rounded-full overflow-hidden">
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <p>{user.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {user?.services.map((service, idx) => (
                      <p key={idx}>{service}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchServiceModal;
