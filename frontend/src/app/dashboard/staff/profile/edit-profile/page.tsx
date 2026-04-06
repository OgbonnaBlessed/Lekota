/* eslint-disable react-hooks/refs */
"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import EditProfileSkeleton from "@/components/ui/skeleton/EditProfileSkeleton";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/staff.api";
import { ImageIcon, ImageUpIcon, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Form = {
  image: File | null;
  imageUrl?: string;
  name: string;
  email: string;
  service: string;
  sub_service: string[];
  location: string;
  bio: string;
};

const Page = () => {
  const { data, isLoading } = useGetProfileQuery({});
  const [updateProfile] = useUpdateProfileMutation();

  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showAddSubserviceField, setShowAddSubserviceField] =
    useState<boolean>(false);
  const [newSub, setNewSub] = useState("");

  const [form, setForm] = useState<Form>({
    image: null,
    imageUrl: "",
    name: "",
    email: "",
    service: "",
    sub_service: [],
    location: "",
    bio: "",
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
        service: data.service || "",
        sub_service: data.sub_service || [],
        location: data.location || "",
        bio: data.bio || "",
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

  // ===============================
  // SUBSERVICE LOGIC
  // ===============================
  const addSubService = () => {
    if (!newSub.trim()) return;

    setForm((prev) => ({
      ...prev,
      sub_service: [...prev.sub_service, newSub.trim()],
    }));

    setNewSub("");
    setShowAddSubserviceField(false);
  };

  const removeSubService = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sub_service: prev.sub_service.filter((_, i) => i !== index),
    }));
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);

    let imageUrl = form.imageUrl;

    if (form.image) {
      imageUrl = await uploadToCloudinary(form.image);
    }

    const payload = {
      name: form.name,
      email: form.email,
      service: form.service,
      sub_service: form.sub_service,
      location: form.location,
      bio: form.bio,
      image: imageUrl,
    };
    console.log("Payload", payload);

    await updateProfile(payload);

    setUploading(false);
    setShow(true);
  };

  if (isLoading) return <EditProfileSkeleton />;

  return (
    <>
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

        <div className="w-full flex flex-col lg:flex-row gap-4">
          <Input
            name="service"
            label="Service"
            placeholder="Enter your Service"
            value={form.service}
            onChange={handleChange}
            className="w-full lg:w-1/2"
          />
          {/* SUB SERVICES */}
          <AnimatePresence>
            <div className="w-full lg:w-1/2 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#6B7280]">
                Subservices
              </label>

              <div className="relative w-full min-h-12 flex flex-row border border-gray-300 rounded-lg gap-2 p-2 mt-2 overflow-x-auto no-scroll-bar">
                {form.sub_service.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-[#2D36E0]/10 text-xs text-[#2D36E0] rounded"
                  >
                    <span>{item}</span>
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => removeSubService(index)}
                    />
                  </div>
                ))}

                {!showAddSubserviceField && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onClick={() => setShowAddSubserviceField(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2D36E0] text-white p-2 rounded-full cursor-pointer"
                  >
                    <Plus size={14} />
                  </motion.div>
                )}
              </div>

              {showAddSubserviceField && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex items-center gap-2 mt-2"
                >
                  <input
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    placeholder="Add subservice"
                    className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2D36E0] focus:border-transparent placeholder:text-gray-400 transition-all duration-500 ease-in-out"
                  />
                  <Button
                    type="button"
                    onClick={addSubService}
                    className="bg-[#2D36E0] p-4!"
                  >
                    Add
                  </Button>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>

        <Input
          name="location"
          label="Location"
          placeholder="Enter your location"
          value={form.location}
          onChange={handleChange}
        />
        <Input
          name="bio"
          label="Bio"
          placeholder="Enter your bio"
          value={form.bio}
          onChange={handleChange}
        />

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
