import Image from "next/image";

type BadgeProps = {
  title: string;
};

const Badge = ({ title }: BadgeProps) => {
  return (
    <div className="w-fit flex items-center gap-2 bg-white shadow rounded-full px-3 py-2 sm:px-4 sm:py-3 text-[10px] sm:text-xs md:text-sm text-nowrap">
      <div className="relative w-[1em] h-[1em]">
        <Image src="/star.png" alt="star" fill className="object-contain" />
      </div>

      <p>{title}</p>
    </div>
  );
};

export default Badge;
