/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLazySearchServicesQuery } from "@/redux/api/search.api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import SearchServiceModalSkeleton from "../ui/skeleton/SearchServiceModalSkeleton";
import { Search } from "lucide-react";

const SearchServiceModal = ({ open, onOpenChange, service }: any) => {
  const [triggerSearch, { data, isLoading }] = useLazySearchServicesQuery();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredStaff = staff.filter((s: any) =>
    s.profile?.sub_service?.some((sub: string) =>
      sub.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  useEffect(() => {
    if (service?.name) {
      setLoading(true);
      triggerSearch(service.name);

      setTimeout(() => {
        setLoading(false);
      }, 5000); // ⏳ forced skeleton delay
    }
  }, [service, triggerSearch]);

  useEffect(() => {
    if (data?.staff) {
      setStaff(data.staff);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-8 max-w-[90%]">
        {/* SERVICE TITLE */}
        <DialogTitle>
          <div className="w-fit flex items-center bg-gray-100 rounded-lg px-3 text-sm">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subservices"
              className="bg-transparent p-3 outline-none"
            />
          </div>
        </DialogTitle>
        <div>
          <h1 className="text-2xl font-semibold">{service?.name}</h1>
          <p className="text-sm text-gray-500">Pick from available staff</p>
        </div>

        {/* STAFF LIST */}
        <div className="flex flex-col gap-4 mt-5">
          {isLoading || loading ? (
            <SearchServiceModalSkeleton />
          ) : (
            <>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((user: any) => (
                  <Link
                    key={user._id}
                    href={{
                      pathname: "./services/book-appointment",
                      query: {
                        staffId: user._id,
                        serviceId: service?._id,
                      },
                    }}
                    prefetch
                  >
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {user.profile?.image ? (
                          <Image
                            src={user.profile.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center gap-1 flex-wrap text-xs text-gray-500">
                          <p>{user.profile?.sub_service?.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="w-full min-h-20 flex items-center justify-center text-sm text-gray-500">
                  <p>There&apos;s is no staff for this subservice</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchServiceModal;
