/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, ImageIcon, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Form = {
  image: File | null;
  name: string;
  email: string;
  gender: string;
  location: string;
  bio: string;
};

const Page = () => {
  const [show, setShow] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    image: null,
    name: "",
    email: "",
    gender: "",
    location: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleGenderSelect = (value: string) => {
    setForm({ ...form, gender: value });
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

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#6B7280] font-medium">Gender</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between text-base border border-gray-300 rounded-xl px-4 py-6 text-gray-400"
                >
                  {form.gender || "Select gender"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandGroup>
                    {["Male", "Female", "Other"].map((item) => (
                      <CommandItem
                        key={item}
                        onSelect={() => handleGenderSelect(item)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        {item}
                        {form.gender === item && <Check className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
