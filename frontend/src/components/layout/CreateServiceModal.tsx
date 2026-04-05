"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "../ui/modal";
import { Plus, Check, ChevronsUpDown, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useCreateServiceMutation } from "@/redux/api/tenant.api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const schedules = [
  "30 mins service, 10 mins buffer",
  "30 mins service, 20 mins buffer",
  "40 mins service, 10 mins buffer",
  "40 mins service, 20 mins buffer",
];

const CreateServiceModal = ({ open, onOpenChange }: Props) => {
  const [createService, { isLoading }] = useCreateServiceMutation();
  const [show, setShow] = useState<boolean>(false);

  const [form, setForm] = useState({
    name: "",
    schedule: "",
  });

  const [subservices, setSubservices] = useState<string[]>([]);
  const [showSubInput, setShowSubInput] = useState(false);
  const [newSub, setNewSub] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubservice = () => {
    if (!newSub.trim()) return;
    setSubservices((prev) => [...prev, newSub.trim()]);
    setNewSub("");
    setShowSubInput(false);
  };

  const handleRemoveSubservice = (sub: string) => {
    setSubservices((prev) => prev.filter((s) => s !== sub));
  };

  const handleSubmit = async () => {
    try {
      await createService({
        name: form.name,
        subServices: subservices,
        schedules: [
          {
            duration: parseInt(form.schedule.split(" ")[0]),
            buffer: parseInt(form.schedule.split(" ")[3]),
          },
        ],
      }).unwrap();

      setForm({ name: "", schedule: "" });
      setSubservices([]);
      onOpenChange(false);
      setShow(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col gap-10 w-2xl! max-w-[90%]! p-10"
        >
          <DialogHeader className="w-full items-center">
            <DialogTitle className="text-2xl">New Service</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-6">
            {/* Service Name */}
            <div className="flex flex-col gap-2">
              <Input
                name="serviceName"
                type="text"
                label="Service Name"
                placeholder="Enter service name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              {/* Subservices List */}
              {subservices.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {subservices.map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md"
                    >
                      <p>{sub}</p>
                      <div
                        onClick={() => handleRemoveSubservice(sub)}
                        className="cursor-pointer"
                      >
                        <X size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Subservice */}
              {!showSubInput ? (
                <button
                  onClick={() => setShowSubInput(true)}
                  className="flex items-center gap-1 text-xs text-[#2D36E0] self-end"
                >
                  <Plus size={10} /> subservice
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    placeholder="Enter subservice"
                    className="border border-gray-300 rounded-md py-2 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#2D36E0] focus:border-transparent"
                  />
                  <button
                    onClick={handleAddSubservice}
                    className="bg-[#2D36E0] text-white text-xs px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Schedule Dropdown (ShadCN way) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Schedule</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between text-base border border-gray-300 rounded-xl px-4 py-6 text-gray-400"
                  >
                    {form.schedule || "Select schedule"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandEmpty>No schedule found.</CommandEmpty>
                    <CommandGroup>
                      {schedules.map((item) => (
                        <CommandItem
                          key={item}
                          onSelect={() => handleChange("schedule", item)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          {item}
                          {form.schedule === item && (
                            <Check className="h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Button */}
            <Button
              onClick={handleSubmit}
              disabled={!form.name || !form.schedule || isLoading}
              className="w-full text-base py-6! mt-5 cursor-pointer bg-[#2D36E0] disabled:bg-[#2D36E0]/40"
            >
              Create Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Modal
        header="Service created successfully"
        body="Your service has been created successfully."
        href="/dashboard/tenant/services"
        link="Access Dashboard"
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default CreateServiceModal;
