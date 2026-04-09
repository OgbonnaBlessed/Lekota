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
import { ImageIcon, ImageUpIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Form = {
  image: File | null;
  imageUrl?: string;
  name: string;
  email: string;
  location: string;
  phone: string;
  bio: string;
  gender: string;
};

const Page = () => {
  const { data, isLoading } = useGetClientProfileQuery({});
  const [updateProfile] = useUpdateClientProfileMutation();

  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [form, setForm] = useState<Form>({
    image: null,
    imageUrl: "",
    name: "",
    email: "",
    location: "",
    phone: "",
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
        location: data.location || "",
        phone: data.phone || "",
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===============================
  // IMAGE SELECT
  // ===============================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageLoading(true);

      const file = e.target.files[0];

      setForm((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // ===============================
  // CLOUDINARY UPLOAD
  // ===============================
  const uploadToCloudinary = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "unsigned_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dddvbg9tm/image/upload",
      {
        method: "POST",
        body: fd,
      },
    );

    const data = await res.json();
    return data.secure_url;
  };

  useEffect(() => {
    return () => {
      if (form.image) {
        URL.revokeObjectURL(URL.createObjectURL(form.image));
      }
    };
  }, [form.image]);

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);

    let imageUrl = form.imageUrl;

    if (form.image) {
      try {
        imageUrl = await uploadToCloudinary(form.image);
      } catch {
        toast.error("Image upload failed");
        setUploading(false);
        return;
      }
    }

    const payload = {
      name: form.name,
      email: form.email,
      location: form.location,
      phone: form.phone,
      bio: form.bio,
      gender: form.gender,
      image: imageUrl,
    };

    await updateProfile(payload);

    setUploading(false);
    setShow(true);
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
                  <Image
                    src={URL.createObjectURL(form.image)}
                    alt=""
                    fill
                    onLoadingComplete={() => setImageLoading(false)}
                    className={`object-cover transition-opacity duration-500 ${
                      imageLoading ? "opacity-40" : "opacity-100"
                    }`}
                  />
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
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <ImageUpIcon size={12} /> Upload photo
              </p>
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
            name="location"
            label="Location"
            placeholder="Enter your location"
            value={form.location}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone number"
            type="number"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
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
            disabled={!hasChanged() || uploading || imageLoading}
            className="w-fit bg-[#2D36E0] disabled:bg-[#2D36E0]/50 p-5"
          >
            {uploading && <Loader2 size={14} className="animate-spin" />}
            {uploading ? "Saving..." : "Save Changes"}
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
