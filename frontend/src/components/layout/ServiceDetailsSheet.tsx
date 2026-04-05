/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, X, Loader2, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useUpdateServiceMutation,
  useUpdateServiceStatusMutation,
} from "@/redux/api/tenant.api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ServiceDetailsSheet = ({ service, open, onOpenChange }: any) => {
  const [subservices, setSubservices] = useState<string[]>([]);
  const [showSubInput, setShowSubInput] = useState(false);
  const [newSub, setNewSub] = useState("");
  const [updateService, { isLoading: isSaving }] = useUpdateServiceMutation();
  const [updateStatus] = useUpdateServiceStatusMutation();

  // ✅ Sync state when service changes
  useEffect(() => {
    if (service?.subServices) {
      setSubservices(service.subServices);
    } else {
      setSubservices([]);
    }

    setNewSub("");
    setShowSubInput(false);
  }, [service]);

  const normalizedOriginal = useMemo(
    () =>
      JSON.stringify((service?.subServices || []).map((s: string) => s.trim())),
    [service],
  );

  const normalizedCurrent = useMemo(
    () => JSON.stringify(subservices.map((s) => s.trim())),
    [subservices],
  );

  const hasChanges = normalizedOriginal !== normalizedCurrent;

  if (!service) return null;

  // ✅ Remove subservice
  const handleRemoveSubservice = (sub: string) => {
    setSubservices((prev) => prev.filter((s) => s !== sub));
  };

  // ✅ Add subservice locally
  const handleAddSubservice = () => {
    const value = newSub.trim();

    if (!value) return;

    const exists = subservices.some(
      (sub) => sub.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      toast.error("Subservice already exists");
      return;
    }

    setSubservices((prev) => [...prev, value]);
    setNewSub("");
    setShowSubInput(false);
  };

  // ✅ Persist changes to backend
  const handleSaveChanges = async () => {
    try {
      await updateService({
        serviceId: service._id,
        subServices: subservices,
      }).unwrap();

      onOpenChange(false);
    } catch {
      // toast handled in RTK
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-125 outline-0 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            Service Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 p-5">
          <table className="w-full text-sm">
            <tbody>
              {/* Service Title */}
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium w-37.5">
                  Service Title
                </td>
                <td className="py-2">{service.name}</td>
              </tr>

              {/* Subservices */}
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium align-top">
                  Subservices
                </td>
                <td className="py-2">
                  <div className="space-y-3">
                    {/* Subservices List */}
                    {subservices.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {subservices.map((sub, i) => (
                          <div
                            key={`${sub}-${i}`}
                            className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md"
                          >
                            <p>{sub}</p>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubservice(sub)}
                              className="cursor-pointer text-gray-500 hover:text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No subservices added yet.
                      </p>
                    )}

                    {/* Add Subservice */}
                    {!showSubInput ? (
                      <button
                        type="button"
                        onClick={() => setShowSubInput(true)}
                        className="flex items-center gap-1 text-xs text-[#2D36E0]"
                      >
                        <Plus size={10} />
                        <p>Add Subservice</p>
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-2 mt-2">
                        <input
                          value={newSub}
                          onChange={(e) => setNewSub(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubservice();
                            }

                            if (e.key === "Escape") {
                              setShowSubInput(false);
                              setNewSub("");
                            }
                          }}
                          placeholder="Enter subservice"
                          className="border border-gray-300 rounded-md py-2 px-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#2D36E0] focus:border-transparent"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAddSubservice}
                            className="bg-[#2D36E0] text-white text-xs px-4 py-2 rounded-md"
                          >
                            Add
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowSubInput(false);
                              setNewSub("");
                            }}
                            className="border border-gray-300 text-xs px-4 py-2 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {/* Status */}
              <tr>
                <td className="text-muted-foreground py-2 pr-6 font-medium">
                  Status
                </td>
                <div className="flex items-center gap-4">
                  <td className="py-2 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        service.status === "active"
                          ? "bg-green-500"
                          : service.status === "suspended"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="capitalize">{service.status}</span>
                  </td>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <td className="bg-gray-200 text-gray-500 p-1 rounded-sm cursor-pointer">
                        <ChevronDown size={12} />
                      </td>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {["active", "suspended", "deleted"].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            updateStatus({
                              serviceId: service._id,
                              status,
                            })
                          }
                          className="capitalize cursor-pointer"
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </tr>

              {/* Organization */}
              <tr>
                <td className="flex items-start text-muted-foreground py-2 pr-6 font-medium">
                  Organization
                </td>
                <td className="py-2">{service.tenant?.organization}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className="bg-[#2D36E0] text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ServiceDetailsSheet;
