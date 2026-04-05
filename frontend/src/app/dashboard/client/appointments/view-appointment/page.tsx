import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, StarIcon } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <Link href="../appointments">
        <div className="flex items-center gap-1 text-xs text-[#2D36E0]">
          <ArrowLeft size={12} />
          <p>Back to appointments</p>
        </div>
      </Link>

      <h1 className="text-xl md:text-3xl font-medium">Hailey Mendes</h1>

      <div className="flex flex-col gap-1">
        <h3>Time</h3>
        <div className="flex flex-col text-sm">
          <p>Wed, 18th March, 2026</p>
          <p className="text-xs text-gray-500">9:00 - 9:40 (UTC +00:00)</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3>Mode</h3>
        <p className="text-sm">Physical meeting</p>
      </div>

      <div className="flex flex-col gap-1">
        <h3>Meeting Link</h3>
        <p className="text-sm text-[#2D36E0]">lekota.room.1976</p>
      </div>

      <div className="flex flex-col gap-1">
        <h3>Duration</h3>
        <div>
          <p className="text-sm">40 mins, 20 mins buffer</p>
          <div className="flex items-center gap-5 text-sm mt-2">
            <p className="text-[#2D36E0]">Reschedule</p>
            <p className="text-red-500">Cancel</p>
          </div>
        </div>
      </div>

      <div className="w-fit flex items-center gap-4 bg-gray-200 text-gray-500 p-5 rounded-lg">
        <p className="text-sm">Rate</p>
        <div className="flex items-center gap-2">
          {["1", "2", "3", "4", "5"].map((r, i) => (
            <div key={i} className="cursor-pointer">
              <StarIcon fill="#FDCC0D" className="text-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden">
        <div className="text-gray-500 bg-gray-200 p-5">
          Session remark (optional)
        </div>
        <div className="relative flex flex-col justify-between px-2.5 py-2">
          <Textarea
            placeholder="Add remark..."
            className="min-h-52 border-none resize-none outline-none focus:ring-0 focus-visible:ring-0"
          />
          <Button className="absolute right-4 bottom-4 w-fit self-end bg-[#2D36E0] p-4">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
