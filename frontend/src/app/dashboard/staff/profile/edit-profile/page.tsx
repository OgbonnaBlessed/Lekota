/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { ImageIcon, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Form = {
  image: File | null;
  name: string;
  email: string;
  service: string;
  sub_service: string[];
  location: string;
  bio: string;
};

const Page = () => {
  const [show, setShow] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    image: null,
    name: "",
    email: "",
    service: "",
    sub_service: [],
    location: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "sub_service") {
      setForm({
        ...form,
        sub_service: value.split(",").map((item) => item.trim()),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShow(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <div className="w-24 aspect-square flex items-center justify-center bg-gray-200 text-white rounded-full border border-[#2D36E0] cursor-pointer">
            <ImageIcon size={24} />
          </div>
          {form.image !== null && (
            <div className="relative w-24 aspect-square rounded-full cursor-pointer overflow-hidden">
              <Image
                src={"/banner.png"}
                alt="Profile photo"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h1 className="text-sm md:text-base font-medium">Brian Elvis</h1>
              <p className="text-xs md:text-sm text-[#ABABAB]">
                brian@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#2D36E0] cursor-pointer">
              <ImageUpIcon size={12} />
              <p>Upload profile photo</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <Input
            name="name"
            type="text"
            label="Name"
            placeholder="Brian Elvis"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            label="Email address"
            placeholder="brian@gmail.com"
            value={form.email}
            onChange={handleChange}
          />
          <div className="flex flex-col md:flex-row gap-8">
            <Input
              name="service"
              type="text"
              label="Service"
              placeholder="Enter your service"
              value={form.service}
              onChange={handleChange}
            />
            <Input
              name="sub_service"
              type="text"
              label="Subservice"
              placeholder="Enter your sub services"
              value={form?.sub_service?.join(", ") || ""}
              onChange={handleChange}
            />
          </div>
          <Input
            name="location"
            type="text"
            label="Location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter your location"
          />
          <Input
            name="bio"
            type="text"
            label="Bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Enter a brief info about yourself"
          />
        </div>

        <Button
          type="submit"
          disabled={Object.values(form).some(
            (field: any) =>
              !field || (Array.isArray(field) && field.length === 0),
          )}
          className="w-fit text-base py-6! px-12 mt-5 cursor-pointer bg-[#2D36E0] disabled:bg-[#2D36E066]"
        >
          Save
        </Button>
      </form>

      <Modal
        header="Profile successfully saved"
        href="./profile"
        link="Back to dashboard"
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default Page;
