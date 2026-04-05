import { Pencil } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full flex flex-col border rounded-xl overflow-hidden">
      <div className="w-full flex items-center justify-between bg-gray-100 p-5">
        <h1 className="text-xl sm:text-xl">Profile</h1>
        <Link href="./profile/edit-profile">
          <Pencil className="p-0.5" />
        </Link>
      </div>
      <div className="flex items-center justify-between gap-8 flex-wrap p-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg">Brian Elvis</h2>
          <p className="text-sm text-gray-500">Name</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg">Service 1</h2>
          <p className="text-sm text-gray-500">Subservice 1</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg">Not created</h2>
          <p className="text-sm text-gray-500">Location</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg">Not created</h2>
          <p className="text-sm text-gray-500">Phone number</p>
        </div>
      </div>
    </div>
  );
};

export default page;
