/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
"use client";

import Animate from "@/components/layout/Animate";
import { Button } from "@/components/ui/button";
import { Command, CommandItem } from "@/components/ui/command";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EditProfileSkeleton from "@/components/ui/skeleton/EditProfileSkeleton";
import {
  useGetClientProfileQuery,
  useUpdateClientProfileMutation,
} from "@/redux/api/client.api";
import { formatUKPhone } from "@/utils/phone";
import { ImageIcon, ImageUpIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Form = {
  image: File | null;
  imageUrl?: string;
  name: string;
  email: string;
  address: string;
  postcode: string;
  county: string;
  phone: string;
  bio: string;
  gender: string;
};

const Page = () => {
  const { data, isLoading } = useGetClientProfileQuery({});

  const [updateProfile, { isLoading: updating }] =
    useUpdateClientProfileMutation();
  const [show, setShow] = useState(false);

  const [form, setForm] = useState<Form>({
    image: null,
    imageUrl: "",
    name: "",
    email: "",
    address: "",
    postcode: "",
    county: "",
    phone: "+44",
    bio: "",
    gender: "other",
  });

  const initialRef = useRef<Form | null>(null);

  // ===============================
  // PREFILL
  // ===============================
  useEffect(() => {
    if (data) {
      const initial = {
        image: null,
        imageUrl: data.image || "",
        name: data.name || "",
        email: data.email || "",
        address: data.address || "",
        postcode: data.postcode || "",
        county: data.county || "",
        phone: formatUKPhone(data.phone || ""),
        bio: data.bio || "",
        gender: data.gender || "other",
      };

      setForm(initial);
      initialRef.current = initial;
    }
  }, [data]);

  // ===============================
  // CHANGE DETECTION (BETTER)
  // ===============================
  const hasChanged = () => {
    if (!initialRef.current) return false;

    const clean = (obj: Form) => ({
      ...obj,
      image: undefined, // ignore file
    });

    return (
      JSON.stringify(clean(form)) !== JSON.stringify(clean(initialRef.current))
    );
  };

  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = formatUKPhone(value);

      setForm((prev) => ({
        ...prev,
        phone: formatted,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      // ❌ block videos
      if (!file.type.startsWith("image/")) {
        toast.error("Only images allowed");
        return;
      }

      setForm((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  useEffect(() => {
    let previewUrl: string;

    if (form.image) {
      previewUrl = URL.createObjectURL(form.image);
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [form.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value) {
        formData.append("image", value as File);
      } else if (value) {
        formData.append(key, value as string);
      }
    });

    try {
      await updateProfile(formData).unwrap(); // ✅ THIS IS THE MAGIC

      setShow(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <EditProfileSkeleton />;

  return (
    <>
      <Animate>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* IMAGE */}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input type="file" hidden onChange={handleImageChange} />

              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-[#2D36E0]">
                {form.image ? (
                  <>
                    <Image
                      src={URL.createObjectURL(form.image)}
                      alt=""
                      fill
                      className="object-cover transition-all duration-300"
                    />
                  </>
                ) : form.imageUrl ? (
                  <Image
                    src={form.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <ImageIcon />
                  </div>
                )}
              </div>
            </label>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="text-sm font-medium">{form.name}</p>
                <p className="text-xs text-gray-400">{form.email}</p>
              </div>
              <label className="cursor-pointer text-xs text-blue-600 flex items-center gap-1">
                <ImageUpIcon size={12} /> Upload photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* INPUTS */}
          <Input
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Address"
            placeholder="Enter your address"
            value={form.address}
            onChange={handleChange}
          />
          <Input
            name="postcode"
            label="Post code"
            placeholder="Enter your post code"
            value={form.postcode}
            onChange={handleChange}
          />
          <Input
            name="county"
            label="County"
            placeholder="Enter your county"
            value={form.county}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone number"
            type="tel"
            placeholder="+44XXXXXXXXXX"
            value={form.phone}
            onChange={handleChange}
            maxLength={13}
            onKeyDown={(e: any) => {
              // Prevent deleting +44
              if (
                (e.key === "Backspace" || e.key === "Delete") &&
                form.phone.length <= 3
              ) {
                e.preventDefault();
              }
            }}
          />
          <Input
            name="bio"
            label="Bio"
            placeholder="Enter your bio"
            value={form.bio}
            onChange={handleChange}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#6B7280]">Gender</label>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="border rounded-xl px-4 py-3 text-left"
                >
                  {form.gender || "Select gender"}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  {["male", "female", "other"].map((g) => (
                    <CommandItem
                      key={g}
                      onSelect={() =>
                        setForm((prev) => ({ ...prev, gender: g }))
                      }
                    >
                      {g}
                    </CommandItem>
                  ))}
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={!hasChanged() || updating}
            className="w-fit bg-[#2D36E0] disabled:bg-[#2D36E0]/50 p-5"
          >
            {updating && <Loader2 size={14} className="animate-spin" />}
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Animate>

      <Modal
        header="Profile updated"
        href="../profile"
        link="Back to profile"
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default Page;
